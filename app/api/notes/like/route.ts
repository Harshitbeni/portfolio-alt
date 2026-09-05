import {
  decrementNoteLikeCount,
  getNoteLikeCount,
  incrementNoteLikeCount,
  isKnownNoteSlug,
} from "@/lib/note-likes";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: CACHE_HEADERS });
}

async function parseSlug(value: unknown) {
  if (typeof value !== "string") return null;
  const slug = value.trim();
  if (!slug) return null;
  if (!(await isKnownNoteSlug(slug))) return null;
  return slug;
}

export async function GET(request: Request) {
  const slug = await parseSlug(new URL(request.url).searchParams.get("slug"));

  if (!slug) {
    return json({ error: "Unknown note." }, 400);
  }

  try {
    return json({ count: await getNoteLikeCount(slug) });
  } catch {
    return json({ error: "Like count is unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const slug = await parseSlug(
    body && typeof body === "object" && "slug" in body ? body.slug : null,
  );

  if (!slug) {
    return json({ error: "Unknown note." }, 400);
  }

  try {
    return json({ count: await incrementNoteLikeCount(slug) });
  } catch {
    return json({ error: "Like count is unavailable." }, 503);
  }
}

export async function DELETE(request: Request) {
  const slug = await parseSlug(new URL(request.url).searchParams.get("slug"));

  if (!slug) {
    return json({ error: "Unknown note." }, 400);
  }

  try {
    return json({ count: await decrementNoteLikeCount(slug) });
  } catch {
    return json({ error: "Like count is unavailable." }, 503);
  }
}
