import {
  asTrackList,
  artistName,
  createLastFmUrl,
  trackArtwork,
  type LastFmRecentTracksResponse,
} from "@/lib/lastfm";
import type { NowPlaying } from "@/lib/now-playing";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
};

export async function GET() {
  try {
    const url = createLastFmUrl("user.getrecenttracks", { limit: 1 });

    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`last.fm ${response.status}`);
    }

    const data = (await response.json()) as LastFmRecentTracksResponse;

    if (data.error || !data.recenttracks) {
      throw new Error(data.message || "last.fm error");
    }

    const track = asTrackList(data.recenttracks.track)[0];

    if (!track) {
      throw new Error("no recent tracks");
    }

    const artist = artistName(track.artist);

    if (!track.name || !artist) {
      throw new Error("incomplete track");
    }

    const payload: NowPlaying = {
      name: track.name,
      artist,
      url: track.url,
      image: trackArtwork(track),
      nowPlaying: track["@attr"]?.nowplaying === "true",
      playedAt: track.date ? Number(track.date.uts) * 1000 : null,
    };

    return Response.json(payload, { headers: CACHE_HEADERS });
  } catch {
    return new Response(null, {
      status: 503,
      headers: CACHE_HEADERS,
    });
  }
}
