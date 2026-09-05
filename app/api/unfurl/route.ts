import { unfurlUrl } from "@/lib/unfurl";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 15;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 40;
const MAX_URL_LENGTH = 2048;

type RateBucket = {
  count: number;
  resetAt: number;
};

const rateBuckets = new Map<string, RateBucket>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();

    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function allowRequest(ip: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }

  bucket.count += 1;
  return true;
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": status === 200 ? "private, max-age=300" : "no-store",
    },
  });
}

export async function GET(request: Request) {
  if (!allowRequest(clientIp(request))) {
    return json({ error: "Too many requests" }, 429);
  }

  const raw = new URL(request.url).searchParams.get("url")?.trim() ?? "";

  if (!raw || raw.length > MAX_URL_LENGTH) {
    return json({ error: "Invalid url" }, 400);
  }

  const result = await unfurlUrl(raw, new URL(request.url));

  if (!result) {
    return json({ error: "Unfurl failed" }, 502);
  }

  return json(result);
}
