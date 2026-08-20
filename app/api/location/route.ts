import {
  DEFAULT_NOMADS_LOCATION,
  DEFAULT_NOMADS_USER,
  parseNomadsProfileHtml,
} from "@/lib/nomads-location";

export const revalidate = 3600;

const NOMADS_URL = `https://nomads.com/@${DEFAULT_NOMADS_USER}`;

async function fetchNomadsHtml(): Promise<string> {
  const response = await fetch(NOMADS_URL, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      accept: "text/html",
    },
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`nomads.com responded ${response.status}`);
  }

  return response.text();
}

export async function GET() {
  try {
    const location = parseNomadsProfileHtml(
      await fetchNomadsHtml(),
      DEFAULT_NOMADS_LOCATION
    );

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
