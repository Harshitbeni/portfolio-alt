import {
  asTrackList,
  artistName,
  createLastFmUrl,
  trackArtwork,
  type LastFmRecentTracksResponse,
  type LastFmTrack,
} from "@/lib/lastfm";
import { Redis } from "@upstash/redis";

const LASTFM_PAGE_SIZE = 200;
const LASTFM_PAGE_BATCH_SIZE = 4;
const MUSIC_SYNC_THROTTLE_MS = 30_000;
const MUSIC_TIME_ZONE = "America/Los_Angeles";
const MUSIC_LIBRARY_KEY = "portfolio:music-library:v1";
const MUSIC_PREVIEW_KEY = "portfolio:music-preview:v1";
export const MUSIC_PREVIEW_COUNT = 50;

export const MUSIC_SECTIONS = [
  "nowplaying",
  "today",
  "week",
  "month",
  "year",
  "decade",
] as const;

export type MusicSectionId = (typeof MUSIC_SECTIONS)[number];

export type MusicTrack = {
  id: string;
  name: string;
  artist: string;
  image: string | null;
  url: string;
  playedAt: number | null;
};

export type MusicSection = {
  id: MusicSectionId;
  label: string;
  tracks: MusicTrack[];
};

export type MusicLibrarySnapshot = {
  tracks: MusicTrack[];
  nowPlaying: MusicTrack | null;
  importRemaining: boolean;
  throttled: boolean;
};

export type MusicPreview = {
  sections: MusicSection[];
  totalTracks: number;
  nowPlaying: MusicTrack | null;
  syncedAt?: number;
  importComplete?: boolean;
};

type StoredMusicLibrary = {
  tracks: MusicTrack[];
  syncedAt: number;
  nowPlaying?: MusicTrack | null;
  importComplete?: boolean;
};

type StoredMusicPreview = MusicPreview;

const MUSIC_SECTION_LABELS: Record<MusicSectionId, string> = {
  nowplaying: "Now playing",
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  decade: "Last decade",
};

function dateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MUSIC_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    weekday: values.weekday,
  };
}

function dayKey({ year, month, day }: ReturnType<typeof dateParts>) {
  return year * 10_000 + month * 100 + day;
}

function weekStartKey(date: Date) {
  const parts = dateParts(date);
  const offset: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const shifted = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

  shifted.setUTCDate(shifted.getUTCDate() - offset[parts.weekday]);
  return (
    shifted.getUTCFullYear() * 10_000 +
    (shifted.getUTCMonth() + 1) * 100 +
    shifted.getUTCDate()
  );
}

function sectionForTrack(
  track: MusicTrack,
  now: Date,
): Exclude<MusicSectionId, "nowplaying"> | null {
  if (track.playedAt === null) {
    return "today";
  }

  const playedAt = new Date(track.playedAt);
  const current = dateParts(now);
  const played = dateParts(playedAt);

  if (dayKey(played) === dayKey(current)) return "today";
  if (weekStartKey(playedAt) === weekStartKey(now)) return "week";
  if (played.year === current.year && played.month === current.month) {
    return "month";
  }
  if (played.year === current.year) return "year";
  if (played.year >= current.year - 10) return "decade";

  return null;
}

function trackId(name: string, artist: string) {
  return `${artist}\u0000${name}`.toLocaleLowerCase();
}

function isLiveNowPlaying(track: LastFmTrack) {
  return track["@attr"]?.nowplaying === "true";
}

function toMusicTrack(track: LastFmTrack): MusicTrack | null {
  const artist = artistName(track.artist);

  if (!track.name || !artist || !track.url) {
    return null;
  }

  const playedAt = track.date ? Number(track.date.uts) * 1000 : null;

  return {
    id: trackId(track.name, artist),
    name: track.name,
    artist,
    image: trackArtwork(track),
    url: track.url,
    playedAt: Number.isFinite(playedAt) ? playedAt : null,
  };
}

function parseRecentTracks(data: LastFmRecentTracksResponse): {
  scrobbles: MusicTrack[];
  nowPlaying: MusicTrack | null;
} {
  if (data.error || !data.recenttracks) {
    throw new Error(data.message || "last.fm error");
  }

  let nowPlaying: MusicTrack | null = null;
  const scrobbles: MusicTrack[] = [];

  for (const track of asTrackList(data.recenttracks.track)) {
    const parsed = toMusicTrack(track);

    if (!parsed) {
      continue;
    }

    if (isLiveNowPlaying(track)) {
      nowPlaying = parsed;
      continue;
    }

    if (parsed.playedAt === null) {
      continue;
    }

    scrobbles.push(parsed);
  }

  return { scrobbles, nowPlaying };
}

async function fetchRecentTracksPage(page: number) {
  const response = await fetch(
    createLastFmUrl("user.getrecenttracks", {
      limit: LASTFM_PAGE_SIZE,
      page,
    }),
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`last.fm ${response.status}`);
  }

  return (await response.json()) as LastFmRecentTracksResponse;
}

function mergeMusicTracks(
  existingTracks: MusicTrack[],
  incomingTracks: MusicTrack[],
) {
  const tracksById = new Map<string, MusicTrack>();

  for (const track of [...existingTracks, ...incomingTracks]) {
    const existing = tracksById.get(track.id);

    if (
      !existing ||
      (track.playedAt ?? Number.NEGATIVE_INFINITY) >
        (existing.playedAt ?? Number.NEGATIVE_INFINITY)
    ) {
      tracksById.set(track.id, track);
    }
  }

  return [...tracksById.values()];
}

async function fetchNewMusicTracks(since: number) {
  const scrobbles: MusicTrack[] = [];
  let nowPlaying: MusicTrack | null = null;
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetchRecentTracksPage(page);
    const parsed = parseRecentTracks(response);

    if (page === 1) {
      nowPlaying = parsed.nowPlaying;
    }

    scrobbles.push(...parsed.scrobbles);
    totalPages = Number(response.recenttracks?.["@attr"]?.totalPages) || 1;

    if (
      parsed.scrobbles.some(
        (track) => track.playedAt !== null && track.playedAt <= since,
      )
    ) {
      break;
    }

    page++;
  } while (page <= totalPages);

  return { scrobbles, nowPlaying };
}

function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error("Missing Upstash Redis credentials");
  }

  return new Redis({ url, token });
}

function isImportComplete(stored: StoredMusicLibrary) {
  if (stored.importComplete === true) return true;
  if (stored.importComplete === false) return false;
  return stored.tracks.length > 0;
}

export function sliceMusicSections(
  sections: MusicSection[],
  count: number,
): MusicSection[] {
  let remaining = count;

  return sections.flatMap((section) => {
    if (remaining <= 0) {
      return [];
    }

    const tracks = section.tracks.slice(0, remaining);
    remaining -= tracks.length;

    return tracks.length ? [{ ...section, tracks }] : [];
  });
}

function previewFromLibrary(library: StoredMusicLibrary): StoredMusicPreview {
  const sections = bucketMusicTracks(library.tracks);

  return {
    sections: sliceMusicSections(sections, MUSIC_PREVIEW_COUNT),
    totalTracks: library.tracks.length,
    nowPlaying: library.nowPlaying ?? null,
    syncedAt: library.syncedAt,
    importComplete: isImportComplete(library),
  };
}

async function writeLibrary(
  redis: Redis,
  library: StoredMusicLibrary,
) {
  await Promise.all([
    redis.set(MUSIC_LIBRARY_KEY, library),
    redis.set(MUSIC_PREVIEW_KEY, previewFromLibrary(library)),
  ]);
}

export async function getMusicLibrary(): Promise<MusicTrack[]> {
  try {
    const redis = getRedis();
    const stored = await redis.get<StoredMusicLibrary>(MUSIC_LIBRARY_KEY);
    return stored?.tracks ?? [];
  } catch {
    return [];
  }
}

export async function getMusicPreview(): Promise<MusicPreview | null> {
  try {
    const redis = getRedis();
    const stored = await redis.get<StoredMusicLibrary>(MUSIC_LIBRARY_KEY);

    if (!stored?.tracks.length) {
      return null;
    }

    const nextPreview = previewFromLibrary(stored);
    await redis.set(MUSIC_PREVIEW_KEY, nextPreview);
    return nextPreview;
  } catch {
    return null;
  }
}

export async function syncMusicLibrary(): Promise<MusicLibrarySnapshot> {
  const redis = getRedis();
  const preview = await redis.get<StoredMusicPreview>(MUSIC_PREVIEW_KEY);

  if (
    preview &&
    preview.importComplete !== false &&
    typeof preview.syncedAt === "number" &&
    Date.now() - preview.syncedAt < MUSIC_SYNC_THROTTLE_MS
  ) {
    return {
      tracks: [],
      nowPlaying: preview.nowPlaying ?? null,
      importRemaining: false,
      throttled: true,
    };
  }

  const stored = await redis.get<StoredMusicLibrary>(MUSIC_LIBRARY_KEY);

  if (
    stored &&
    isImportComplete(stored) &&
    Date.now() - stored.syncedAt < MUSIC_SYNC_THROTTLE_MS
  ) {
    return {
      tracks: stored.tracks,
      nowPlaying: stored.nowPlaying ?? null,
      importRemaining: false,
      throttled: true,
    };
  }

  if (!stored || !isImportComplete(stored)) {
    const firstPage = await fetchRecentTracksPage(1);
    const parsed = parseRecentTracks(firstPage);
    const tracks = mergeMusicTracks(stored?.tracks ?? [], parsed.scrobbles);
    const totalPages =
      Number(firstPage.recenttracks?.["@attr"]?.totalPages) || 1;

    await writeLibrary(redis, {
      tracks,
      syncedAt: Date.now(),
      nowPlaying: parsed.nowPlaying,
      importComplete: totalPages <= 1,
    });

    return {
      tracks,
      nowPlaying: parsed.nowPlaying,
      importRemaining: totalPages > 1,
      throttled: false,
    };
  }

  try {
    const { scrobbles, nowPlaying } = await fetchNewMusicTracks(stored.syncedAt);
    const tracks = mergeMusicTracks(stored.tracks, scrobbles);

    await writeLibrary(redis, {
      tracks,
      syncedAt: Date.now(),
      nowPlaying,
      importComplete: true,
    });

    return { tracks, nowPlaying, importRemaining: false, throttled: false };
  } catch {
    return {
      tracks: stored.tracks,
      nowPlaying: stored.nowPlaying ?? null,
      importRemaining: false,
      throttled: false,
    };
  }
}

export async function finishMusicLibraryImport() {
  const redis = getRedis();
  const stored = await redis.get<StoredMusicLibrary>(MUSIC_LIBRARY_KEY);

  if (!stored || isImportComplete(stored)) {
    return;
  }

  const firstPage = await fetchRecentTracksPage(1);
  const totalPages =
    Number(firstPage.recenttracks?.["@attr"]?.totalPages) || 1;
  const tracks = [
    ...stored.tracks,
    ...parseRecentTracks(firstPage).scrobbles,
  ];
  const pages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);

  for (let index = 0; index < pages.length; index += LASTFM_PAGE_BATCH_SIZE) {
    const pageBatch = pages.slice(index, index + LASTFM_PAGE_BATCH_SIZE);
    const responses = await Promise.all(pageBatch.map(fetchRecentTracksPage));

    for (const response of responses) {
      tracks.push(...parseRecentTracks(response).scrobbles);
    }
  }

  await writeLibrary(redis, {
    tracks: mergeMusicTracks([], tracks),
    syncedAt: Date.now(),
    nowPlaying: stored.nowPlaying ?? null,
    importComplete: true,
  });
}

export function withNowPlayingSection(
  sections: MusicSection[],
  nowPlaying: MusicTrack | null,
): MusicSection[] {
  const withoutNowPlaying = nowPlaying
    ? sections
        .filter((section) => section.id !== "nowplaying")
        .map((section) => ({
          ...section,
          tracks: section.tracks.filter((track) => track.id !== nowPlaying.id),
        }))
        .filter((section) => section.tracks.length > 0)
    : sections.filter((section) => section.id !== "nowplaying");

  if (!nowPlaying) {
    return withoutNowPlaying;
  }

  return [
    {
      id: "nowplaying",
      label: MUSIC_SECTION_LABELS.nowplaying,
      tracks: [nowPlaying],
    },
    ...withoutNowPlaying,
  ];
}

export function bucketMusicTracks(
  tracks: MusicTrack[],
  now = new Date(),
): MusicSection[] {
  const tracksBySection = new Map<
    Exclude<MusicSectionId, "nowplaying">,
    MusicTrack[]
  >([
    ["today", []],
    ["week", []],
    ["month", []],
    ["year", []],
    ["decade", []],
  ]);

  for (const track of tracks) {
    const section = sectionForTrack(track, now);

    if (section) {
      tracksBySection.get(section)?.push(track);
    }
  }

  return MUSIC_SECTIONS.flatMap((id) => {
    if (id === "nowplaying") {
      return [];
    }

    const sectionTracks = tracksBySection.get(id) ?? [];

    if (!sectionTracks.length) {
      return [];
    }

    sectionTracks.sort(
      (first, second) =>
        (second.playedAt ?? Number.NEGATIVE_INFINITY) -
        (first.playedAt ?? Number.NEGATIVE_INFINITY),
    );

    return [{ id, label: MUSIC_SECTION_LABELS[id], tracks: sectionTracks }];
  });
}
