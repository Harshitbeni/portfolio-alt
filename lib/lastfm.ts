export const DEFAULT_LASTFM_USER = "harshitbeni";

const LASTFM_API_KEY_FALLBACK = "4df397f7a6125080b14e6e286429eff5";

export type LastFmTrack = {
  name: string;
  artist: string | { "#text"?: string; name?: string };
  image?: { size: string; "#text": string }[];
  url: string;
  "@attr"?: { nowplaying?: string };
  date?: { uts: string };
};

export type LastFmRecentTracks = {
  track: LastFmTrack | LastFmTrack[];
  "@attr"?: { page?: string; totalPages?: string };
};

export type LastFmRecentTracksResponse = {
  recenttracks?: LastFmRecentTracks;
  error?: number;
  message?: string;
};

export function getLastFmCredentials() {
  return {
    apiKey: process.env.LASTFM_API_KEY || LASTFM_API_KEY_FALLBACK,
    user: process.env.LASTFM_USER || DEFAULT_LASTFM_USER,
  };
}

export function artistName(artist: LastFmTrack["artist"]) {
  if (typeof artist === "string") {
    return artist;
  }

  return artist["#text"] || artist.name || "";
}

export function asTrackList(
  track: LastFmTrack | LastFmTrack[] | undefined,
) {
  if (!track) {
    return [];
  }

  return Array.isArray(track) ? track : [track];
}

export function trackArtwork(track: LastFmTrack) {
  const artwork =
    track.image?.find((image) => image.size === "extralarge") ??
    track.image?.at(-1);

  return artwork?.["#text"] || null;
}

export function createLastFmUrl(
  method: string,
  parameters: Record<string, string | number>,
) {
  const { apiKey, user } = getLastFmCredentials();
  const url = new URL("https://ws.audioscrobbler.com/2.0/");

  url.searchParams.set("method", method);
  url.searchParams.set("user", user);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");

  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, String(value));
  }

  return url;
}
