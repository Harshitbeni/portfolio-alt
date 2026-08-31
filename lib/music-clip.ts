import "server-only";

import { Redis } from "@upstash/redis";

const MUSIC_CLIPS_KEY = "portfolio:music-clips:v1";
const QUERY_MAX_CHARS = 300;
const LOOKUP_TIMEOUT_MS = 4_000;

export type MusicClipSource = "deezer" | "itunes" | "none";

type StoredMusicClip = {
  previewUrl: string | null;
  source: MusicClipSource;
  resolvedAt: number;
};

type ClipCandidate = {
  title: string;
  artist: string;
  previewUrl: string;
};

type DeezerSearchResponse = {
  data?: {
    title?: string;
    artist?: { name?: string };
    preview?: string;
  }[];
};

type ITunesSearchResponse = {
  results?: {
    trackName?: string;
    artistName?: string;
    previewUrl?: string;
  }[];
};

function clipTrackId(name: string, artist: string) {
  return `${artist}\u0000${name}`.toLocaleLowerCase();
}

function clipField(id: string) {
  return id.replaceAll("\u0000", "\t");
}

function clampQuery(value: string) {
  return Array.from(value).slice(0, QUERY_MAX_CHARS).join("").trim();
}

function fold(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function pickPreview(
  candidates: ClipCandidate[],
  name: string,
  artist: string,
): string | null {
  const wantTitle = fold(name);
  const wantArtist = fold(artist);

  if (!wantTitle || !wantArtist) {
    return null;
  }

  let fallback: string | null = null;

  for (const candidate of candidates) {
    if (!candidate.previewUrl) {
      continue;
    }

    const title = fold(candidate.title);
    const artistName = fold(candidate.artist);
    const titleHit =
      title === wantTitle ||
      title.includes(wantTitle) ||
      wantTitle.includes(title);
    const artistHit =
      artistName === wantArtist ||
      artistName.includes(wantArtist) ||
      wantArtist.includes(artistName);

    if (!titleHit || !artistHit) {
      continue;
    }

    if (title === wantTitle && artistName === wantArtist) {
      return candidate.previewUrl;
    }

    fallback ??= candidate.previewUrl;
  }

  return fallback;
}

function parseStoredClip(value: unknown): StoredMusicClip | null {
  let clip: unknown = value;

  if (typeof value === "string") {
    try {
      clip = JSON.parse(value) as unknown;
    } catch {
      return null;
    }
  }

  if (!clip || typeof clip !== "object") {
    return null;
  }

  const stored = clip as Partial<StoredMusicClip>;
  const source = stored.source;

  if (
    (stored.previewUrl !== null && typeof stored.previewUrl !== "string") ||
    (source !== "deezer" && source !== "itunes" && source !== "none") ||
    typeof stored.resolvedAt !== "number"
  ) {
    return null;
  }

  return {
    previewUrl: stored.previewUrl,
    source,
    resolvedAt: stored.resolvedAt,
  };
}

function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

async function readCachedClip(id: string) {
  const redis = getRedis();

  if (!redis) {
    return null;
  }

  try {
    return parseStoredClip(await redis.hget(MUSIC_CLIPS_KEY, clipField(id)));
  } catch {
    return null;
  }
}

async function writeCachedClip(id: string, clip: StoredMusicClip) {
  const redis = getRedis();

  if (!redis) {
    return;
  }

  try {
    await redis.hset(MUSIC_CLIPS_KEY, {
      [clipField(id)]: clip,
    });
  } catch {
    // Keep playback working even if cache writes fail.
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function searchDeezer(name: string, artist: string) {
  const data = await fetchJson<DeezerSearchResponse>(
    `https://api.deezer.com/search?q=${encodeURIComponent(`${artist} ${name}`)}&limit=5`,
  );

  return pickPreview(
    (data?.data ?? []).flatMap((track) => {
      const title = track.title?.trim() ?? "";
      const artistName = track.artist?.name?.trim() ?? "";
      const url = track.preview?.trim() ?? "";

      return title && artistName && url
        ? [{ title, artist: artistName, previewUrl: url }]
        : [];
    }),
    name,
    artist,
  );
}

async function searchITunes(name: string, artist: string) {
  const data = await fetchJson<ITunesSearchResponse>(
    `https://itunes.apple.com/search?term=${encodeURIComponent(`${artist} ${name}`)}&entity=song&media=music&limit=5`,
  );

  return pickPreview(
    (data?.results ?? []).flatMap((track) => {
      const title = track.trackName?.trim() ?? "";
      const artistName = track.artistName?.trim() ?? "";
      const url = track.previewUrl?.trim() ?? "";

      return title && artistName && url
        ? [{ title, artist: artistName, previewUrl: url }]
        : [];
    }),
    name,
    artist,
  );
}

export async function resolveMusicClip({
  artist,
  name,
  refresh = false,
}: {
  artist: string;
  name: string;
  refresh?: boolean;
}): Promise<string | null> {
  const clippedArtist = clampQuery(artist);
  const clippedName = clampQuery(name);

  if (!clippedArtist || !clippedName) {
    return null;
  }

  const id = clipTrackId(clippedName, clippedArtist);

  if (!refresh) {
    const cached = await readCachedClip(id);

    if (cached) {
      return cached.previewUrl;
    }
  }

  const deezerUrl = await searchDeezer(clippedName, clippedArtist);

  if (deezerUrl) {
    await writeCachedClip(id, {
      previewUrl: deezerUrl,
      source: "deezer",
      resolvedAt: Date.now(),
    });
    return deezerUrl;
  }

  const itunesUrl = await searchITunes(clippedName, clippedArtist);

  await writeCachedClip(id, {
    previewUrl: itunesUrl,
    source: itunesUrl ? "itunes" : "none",
    resolvedAt: Date.now(),
  });

  return itunesUrl;
}
