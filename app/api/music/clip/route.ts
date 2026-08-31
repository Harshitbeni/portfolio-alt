import { resolveMusicClip } from "@/lib/music-clip";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const artist = params.get("artist")?.trim() ?? "";
  const name = params.get("name")?.trim() ?? "";
  const refresh = params.get("refresh") === "1";

  if (!artist || !name) {
    return Response.json(
      { previewUrl: null },
      { status: 400, headers: CACHE_HEADERS },
    );
  }

  try {
    const previewUrl = await resolveMusicClip({ artist, name, refresh });

    return Response.json({ previewUrl }, { headers: CACHE_HEADERS });
  } catch {
    return Response.json(
      { previewUrl: null },
      { status: 503, headers: CACHE_HEADERS },
    );
  }
}
