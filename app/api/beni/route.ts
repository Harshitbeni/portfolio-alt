import { APICallError } from "ai";

import {
  BENI_FALLBACK_REPLY,
  BENI_RATE_LIMIT_REPLY,
  parseBeniChatRequest,
} from "@/lib/beni-ai/messages";
import { generateBeniReply } from "@/lib/beni-ai/reply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

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

function jsonReply(text: string, status = 200) {
  return Response.json({ text }, { status });
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return jsonReply(BENI_FALLBACK_REPLY);
  }

  if (!allowRequest(clientIp(request))) {
    return jsonReply(BENI_RATE_LIMIT_REPLY, 429);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonReply(BENI_FALLBACK_REPLY, 400);
  }

  const parsed = parseBeniChatRequest(body);

  if (!parsed) {
    return jsonReply(BENI_FALLBACK_REPLY, 400);
  }

  try {
    const text = await generateBeniReply(parsed.messages);
    return jsonReply(text);
  } catch (error) {
    if (APICallError.isInstance(error) && error.statusCode === 429) {
      return jsonReply(BENI_RATE_LIMIT_REPLY, 429);
    }

    return jsonReply(BENI_FALLBACK_REPLY);
  }
}
