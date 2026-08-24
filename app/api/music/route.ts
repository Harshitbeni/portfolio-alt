import { getMusicLibrary, getMusicPreview, bucketMusicTracks } from "@/lib/music";

export const dynamic = "force-dynamic";

const PREVIEW_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
};

const FULL_CACHE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  try {
    const full = new URL(request.url).searchParams.get("full") === "1";

    if (full) {
      const tracks = await getMusicLibrary();

      return Response.json(
        { sections: bucketMusicTracks(tracks), partial: false },
        { headers: FULL_CACHE_HEADERS },
      );
    }

    const preview = await getMusicPreview();

    return Response.json(
      {
        sections: preview?.sections ?? [],
        nowPlaying: preview?.nowPlaying ?? null,
        totalTracks: preview?.totalTracks ?? 0,
        partial: true,
      },
      { headers: PREVIEW_CACHE_HEADERS },
    );
  } catch {
    return Response.json(
      { sections: [], error: "Music storage is unavailable." },
      { headers: FULL_CACHE_HEADERS, status: 503 },
    );
  }
}
