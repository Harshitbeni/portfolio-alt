import {
  DEFAULT_NOMADS_LOCATION,
  fetchNomadsLocation,
} from "@/lib/nomads-location";

export const revalidate = 3600;

export async function GET() {
  try {
    const location = await fetchNomadsLocation();

    return Response.json(location, {
      headers: {
        "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json(DEFAULT_NOMADS_LOCATION, {
      headers: {
        "cache-control": "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  }
}
