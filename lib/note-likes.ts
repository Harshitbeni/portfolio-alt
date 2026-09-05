import "server-only";

import { Redis } from "@upstash/redis";
import { noteLikeSeed } from "@/lib/note-like-seeds";
import { getNoteSlugs } from "@/lib/notes";

const NOTE_LIKES_KEY = "note-likes";

const memoryCounts = new Map<string, number>();

function getRedis() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function toCount(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.floor(n);
}

export async function isKnownNoteSlug(slug: string) {
  const slugs = await getNoteSlugs();
  return slugs.includes(slug);
}

async function ensureSeedFloor(redis: Redis, slug: string) {
  const seed = noteLikeSeed(slug);
  if (seed <= 0) return seed;

  const stored = await redis.hget(NOTE_LIKES_KEY, slug);
  const count = stored == null ? 0 : toCount(stored);
  if (count >= seed) return count;

  // Raise missing or below-seed fields to the Bear floor. Never lower a
  // count that has already grown past the seed in this app.
  if (stored == null) {
    await redis.hsetnx(NOTE_LIKES_KEY, slug, seed);
  } else {
    await redis.hset(NOTE_LIKES_KEY, { [slug]: seed });
  }
  return seed;
}

export async function getNoteLikeCount(slug: string) {
  const redis = getRedis();
  const seed = noteLikeSeed(slug);

  if (!redis) {
    const stored = memoryCounts.get(slug);
    return stored != null && stored > seed ? stored : seed;
  }

  try {
    return await ensureSeedFloor(redis, slug);
  } catch {
    const stored = memoryCounts.get(slug);
    return stored != null && stored > seed ? stored : seed;
  }
}

export async function incrementNoteLikeCount(slug: string) {
  const redis = getRedis();
  const seed = noteLikeSeed(slug);

  if (!redis) {
    const next = Math.max(memoryCounts.get(slug) ?? 0, seed) + 1;
    memoryCounts.set(slug, next);
    return next;
  }

  try {
    await ensureSeedFloor(redis, slug);
    const next = toCount(await redis.hincrby(NOTE_LIKES_KEY, slug, 1));
    memoryCounts.set(slug, next);
    return next;
  } catch {
    const next = Math.max(memoryCounts.get(slug) ?? 0, seed) + 1;
    memoryCounts.set(slug, next);
    return next;
  }
}

export async function decrementNoteLikeCount(slug: string) {
  const redis = getRedis();
  const seed = noteLikeSeed(slug);

  if (!redis) {
    const current = Math.max(memoryCounts.get(slug) ?? 0, seed);
    const next = current <= seed ? seed : current - 1;
    memoryCounts.set(slug, next);
    return next;
  }

  try {
    const current = await ensureSeedFloor(redis, slug);
    if (current <= seed) return seed;

    const next = toCount(await redis.hincrby(NOTE_LIKES_KEY, slug, -1));
    if (next < seed) {
      await redis.hset(NOTE_LIKES_KEY, { [slug]: seed });
      memoryCounts.set(slug, seed);
      return seed;
    }

    memoryCounts.set(slug, next);
    return next;
  } catch {
    const current = Math.max(memoryCounts.get(slug) ?? 0, seed);
    const next = current <= seed ? seed : current - 1;
    memoryCounts.set(slug, next);
    return next;
  }
}
