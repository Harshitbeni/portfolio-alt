export const DEFAULT_LASTFM_USER = "harshitbeni";

export type NowPlaying = {
  name: string;
  artist: string;
  url: string;
  image: string | null;
  nowPlaying: boolean;
  playedAt: number | null;
};

export const NOW_PLAYING_FALLBACK: NowPlaying = {
  name: "Heartless",
  artist: "Kanye West",
  url: "https://www.last.fm/music/Kanye+West/_/Heartless",
  image:
    "https://lastfm.freetls.fastly.net/i/u/300x300/a10a67180b666ce93a3bb79c49faca0b.jpg",
  nowPlaying: false,
  playedAt: null,
};

export function isNowPlaying(value: unknown): value is NowPlaying {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Record<string, unknown>;

  return (
    typeof data.name === "string" &&
    typeof data.artist === "string" &&
    typeof data.url === "string" &&
    (data.image === null || typeof data.image === "string") &&
    typeof data.nowPlaying === "boolean" &&
    (data.playedAt === null || typeof data.playedAt === "number")
  );
}
