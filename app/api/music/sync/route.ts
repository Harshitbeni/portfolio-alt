import { after } from "next/server";
import {
  bucketMusicTracks,
  finishMusicLibraryImport,
  getMusicPreview,
  syncMusicLibrary,
} from "@/lib/music";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET() {
  try {
    const { tracks, nowPlaying, importRemaining, throttled } =
      await syncMusicLibrary();

    if (importRemaining) {
      after(async () => {
        await finishMusicLibraryImport();
      });
    }

    if (throttled && tracks.length === 0) {
      const preview = await getMusicPreview();

      return Response.json(
        {
          sections: preview?.sections ?? [],
          nowPlaying: nowPlaying ?? preview?.nowPlaying ?? null,
          totalTracks: preview?.totalTracks ?? 0,
          partial: true,
        },
        { headers: CACHE_HEADERS },
      );
    }

    return Response.json(
      {
        sections: bucketMusicTracks(tracks),
        nowPlaying,
        partial: false,
      },
      { headers: CACHE_HEADERS },
    );
  } catch {
    return Response.json(
      {
        sections: [],
        nowPlaying: null,
        error: "Music storage is unavailable.",
      },
      { headers: CACHE_HEADERS, status: 503 },
    );
  }
}
