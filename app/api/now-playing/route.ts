import {
  DEFAULT_LASTFM_USER,
  NOW_PLAYING_FALLBACK,
  type NowPlaying,
} from "@/lib/now-playing";

export const revalidate = 60;

const LASTFM_API_KEY_FALLBACK = "4df397f7a6125080b14e6e286429eff5";

type LastFmTrack = {
  name: string;
  artist: string | { "#text"?: string; name?: string };
  image: { size: string; "#text": string }[];
  url: string;
  "@attr"?: { nowplaying?: string };
  date?: { uts: string };
};

type LastFmResponse = {
  recenttracks?: { track: LastFmTrack | LastFmTrack[] };
  error?: number;
  message?: string;
};

function artistName(artist: LastFmTrack["artist"]) {
  if (typeof artist === "string") {
    return artist;
  }

  return artist["#text"] || artist.name || "";
}

function asTrackList(track: LastFmTrack | LastFmTrack[] | undefined) {
  if (!track) {
    return [];
  }

  return Array.isArray(track) ? track : [track];
}

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

export async function GET() {
  const apiKey = process.env.LASTFM_API_KEY || LASTFM_API_KEY_FALLBACK;
  const user = process.env.LASTFM_USER || DEFAULT_LASTFM_USER;

  try {
    const url = new URL("https://ws.audioscrobbler.com/2.0/");
    url.searchParams.set("method", "user.getrecenttracks");
    url.searchParams.set("user", user);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");

    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      throw new Error(`last.fm ${response.status}`);
    }

    const data = (await response.json()) as LastFmResponse;

    if (data.error || !data.recenttracks) {
      throw new Error(data.message || "last.fm error");
    }

    const track = asTrackList(data.recenttracks.track)[0];

    if (!track) {
      throw new Error("no recent tracks");
    }

    const artwork =
      track.image.find((image) => image.size === "extralarge") ??
      track.image.at(-1);
    const artist = artistName(track.artist);

    if (!track.name || !artist) {
      throw new Error("incomplete track");
    }

    const payload: NowPlaying = {
      name: track.name,
      artist,
      url: track.url,
      image: artwork?.["#text"] || null,
      nowPlaying:
        track["@attr"]?.nowplaying === "true" || track.date == null,
      playedAt: track.date ? Number(track.date.uts) * 1000 : null,
    };

    return Response.json(payload, { headers: CACHE_HEADERS });
  } catch {
    return Response.json(NOW_PLAYING_FALLBACK, { headers: CACHE_HEADERS });
  }
}
