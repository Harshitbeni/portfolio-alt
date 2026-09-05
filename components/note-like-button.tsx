"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { filledSlotIcons } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

const STORAGE_PREFIX = "note-liked:";

function likedKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

function readLiked(slug: string) {
  try {
    return window.localStorage.getItem(likedKey(slug)) === "1";
  } catch {
    return false;
  }
}

function writeLiked(slug: string, liked: boolean) {
  try {
    if (liked) {
      window.localStorage.setItem(likedKey(slug), "1");
    } else {
      window.localStorage.removeItem(likedKey(slug));
    }
  } catch {
    // Private mode can block storage; the in-memory state still updates.
  }
}

function likeLabel(liked: boolean, count: number | null) {
  const action = liked ? "Unlike this note" : "Like this note";
  if (count == null) return action;
  const likes = count === 1 ? "1 like" : `${count} likes`;
  return `${action}, ${likes}`;
}

function NoteLikeCount({ count }: { count: number | null }) {
  const groupRef = useRef<HTMLSpanElement>(null);
  const skipReplay = useRef(true);

  useLayoutEffect(() => {
    if (count == null) return;
    if (skipReplay.current) {
      skipReplay.current = false;
      return;
    }

    const group = groupRef.current;
    if (!group) return;
    group.classList.remove("is-animating");
    void group.offsetHeight;
    group.classList.add("is-animating");
  }, [count]);

  if (count == null) {
    return (
      <span aria-hidden className="text-sm leading-5 tabular-nums text-gray-10">
        {"\u00a0"}
      </span>
    );
  }

  const chars = String(count).split("");

  return (
    <span
      ref={groupRef}
      aria-hidden
      className="t-digit-group text-sm leading-5 tabular-nums text-gray-10"
    >
      {chars.map((ch, i) => {
        const fromEnd = chars.length - 1 - i;
        const stagger = fromEnd === 1 ? "1" : fromEnd === 0 ? "2" : undefined;
        return (
          <span key={`${count}-${i}`} className="t-digit" data-stagger={stagger}>
            {ch}
          </span>
        );
      })}
    </span>
  );
}

export function NoteLikeButton({
  slug,
  liked: likedProp,
  count: countProp,
  onLikedChange,
  onCountChange,
}: {
  slug?: string;
  liked?: boolean;
  count?: number;
  onLikedChange?: (liked: boolean) => void;
  onCountChange?: (count: number) => void;
}) {
  const HeartFilled = filledSlotIcons.heart;
  const pending = useRef(false);
  const likedRef = useRef(false);
  const controlled = likedProp != null && countProp != null;
  const [likedState, setLikedState] = useState(likedProp ?? false);
  const [countState, setCountState] = useState<number | null>(countProp ?? null);

  const liked = controlled ? likedProp : likedState;
  const count = controlled ? countProp : countState;

  useLayoutEffect(() => {
    if (controlled || !slug) return;

    const locallyLiked = readLiked(slug);
    likedRef.current = locallyLiked;
    setLikedState(locallyLiked);

    let cancelled = false;

    fetch(`/api/notes/like?slug=${encodeURIComponent(slug)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { count?: unknown } | null) => {
        if (cancelled) return;
        const next = typeof data?.count === "number" ? data.count : 0;
        setCountState((current) =>
          likedRef.current && current != null ? Math.max(current, next) : next,
        );
      })
      .catch(() => {
        if (!cancelled) {
          setCountState((current) => current ?? 0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [controlled, slug]);

  async function handleClick() {
    if (pending.current) return;

    const nextLiked = !liked;

    if (controlled) {
      onLikedChange?.(nextLiked);
      onCountChange?.(Math.max(0, (countProp ?? 0) + (nextLiked ? 1 : -1)));
      return;
    }

    if (!slug) return;

    pending.current = true;
    likedRef.current = nextLiked;
    const previousCount = count ?? 0;
    setLikedState(nextLiked);
    setCountState(Math.max(0, previousCount + (nextLiked ? 1 : -1)));
    writeLiked(slug, nextLiked);

    try {
      const response = await fetch(
        nextLiked
          ? "/api/notes/like"
          : `/api/notes/like?slug=${encodeURIComponent(slug)}`,
        nextLiked
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            }
          : { method: "DELETE" },
      );
      if (!response.ok) throw new Error("Like request failed");
      const data: { count?: unknown } = await response.json();
      if (typeof data.count === "number") {
        setCountState(data.count);
      }
    } catch {
      likedRef.current = !nextLiked;
      setLikedState(!nextLiked);
      setCountState(previousCount);
      writeLiked(slug, !nextLiked);
    } finally {
      pending.current = false;
    }
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={likeLabel(liked, count)}
      onClick={handleClick}
      className={cn(
        "group inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-md px-1.5",
        "transition-[scale] duration-150 ease-out",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "active:scale-[0.96] motion-reduce:transition-none motion-reduce:active:scale-100",
      )}
    >
      <span
        aria-hidden
        className="t-icon-swap"
        data-state={liked ? "b" : "a"}
      >
        <span
          className="t-icon text-gray-8 group-hover:text-gray-10"
          data-icon="a"
        >
          <HeartFilled size={20} />
        </span>
        <span className="t-icon text-red-9" data-icon="b">
          <HeartFilled size={20} />
        </span>
      </span>
      <NoteLikeCount count={count} />
    </button>
  );
}
