"use client";

import { useEffect, useRef, useState } from "react";
import { PlayRow } from "@/components/play-row";
import { PLAY_ITEMS } from "@/lib/play";

const PLAY_PAGE_SIZE = 5;
const PLAY_LOAD_AHEAD_PX = 240;

export function PlayPanel({
  mediaActive,
}: {
  mediaActive: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PLAY_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const items = PLAY_ITEMS.slice(0, visibleCount);
  const hasMore = mediaActive && visibleCount < PLAY_ITEMS.length;

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const loadMoreIfNeeded = () => {
      const { top } = sentinel.getBoundingClientRect();
      if (top > window.innerHeight + PLAY_LOAD_AHEAD_PX) return;

      setVisibleCount((count) =>
        Math.min(count + PLAY_PAGE_SIZE, PLAY_ITEMS.length),
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMoreIfNeeded();
      },
      { rootMargin: `${PLAY_LOAD_AHEAD_PX}px 0px` },
    );

    observer.observe(sentinel);
    window.addEventListener("scroll", loadMoreIfNeeded, { passive: true });
    loadMoreIfNeeded();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", loadMoreIfNeeded);
    };
  }, [hasMore, visibleCount]);

  return (
    <div className="flex w-full flex-col gap-12">
      {items.map(({ id, ...item }) => (
        <PlayRow
          key={id}
          {...item}
          autoPlay={mediaActive}
        />
      ))}
      {hasMore ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
      <p className="sr-only" role="status">
        Showing {items.length} of {PLAY_ITEMS.length} posts
      </p>
    </div>
  );
}
