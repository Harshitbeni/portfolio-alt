"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MusicRow } from "@/components/music-row";
import { useMusicCache, warmMusicLibrary, watchNowPlaying } from "@/lib/music-client-cache";
import type { MusicSection, MusicTrack } from "@/lib/music";

const MUSIC_PAGE_SIZE = 50;
const MUSIC_LOAD_AHEAD_PX = 480;
const MUSIC_PRIORITY_COVERS = 8;
const MUSIC_SKELETON_MIN_HEIGHT = 264;
const MUSIC_BULK_NEW_TRACK_THRESHOLD = 8;

let cachedVisibleCount = MUSIC_PAGE_SIZE;
const seenMusicTrackIds = new Set<string>();
let musicTracksSeeded = false;
let revealedNowPlayingId: string | null = null;

function seedSeenMusicTracks(sections: MusicSection[]) {
  for (const section of sections) {
    if (section.id === "nowplaying") continue;

    for (const track of section.tracks) {
      seenMusicTrackIds.add(track.id);
    }
  }

  musicTracksSeeded = true;
}

function enteringMusicTrackIds(sections: MusicSection[]) {
  const incoming: string[] = [];

  for (const section of sections) {
    if (section.id === "nowplaying") continue;

    for (const track of section.tracks) {
      if (!seenMusicTrackIds.has(track.id)) {
        incoming.push(track.id);
      }
    }
  }

  if (!musicTracksSeeded) {
    seedSeenMusicTracks(sections);
    return new Set<string>();
  }

  if (incoming.length > MUSIC_BULK_NEW_TRACK_THRESHOLD) {
    for (const id of incoming) {
      seenMusicTrackIds.add(id);
    }

    return new Set<string>();
  }

  return new Set(incoming);
}

function visibleMusicSections(sections: MusicSection[], visibleCount: number) {
  let remaining = visibleCount;

  return sections.flatMap((section) => {
    if (remaining <= 0) {
      return [];
    }

    const tracks = section.tracks.slice(0, remaining);
    remaining -= tracks.length;

    return tracks.length ? [{ ...section, tracks }] : [];
  });
}

function NowPlayingWaveform() {
  return (
    <span aria-hidden className="music-waveform">
      <span className="music-waveform-bar music-waveform-bar--1" />
      <span className="music-waveform-bar music-waveform-bar--2" />
      <span className="music-waveform-bar music-waveform-bar--3" />
      <span className="music-waveform-bar music-waveform-bar--4" />
    </span>
  );
}

function playStagger(block: HTMLElement | null) {
  if (!block) return;

  block.classList.remove("is-hiding");
  block.classList.remove("is-shown");
  void block.offsetHeight;
  block.classList.add("is-shown");
}

function NowPlayingSection({
  track,
  priority,
}: {
  track: MusicTrack;
  priority: boolean;
}) {
  const alreadyRevealed = revealedNowPlayingId === track.id;
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (alreadyRevealed) return;

    playStagger(rootRef.current);
    revealedNowPlayingId = track.id;
  }, [alreadyRevealed, track.id]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="music-nowplaying"
      className={`t-stagger pb-6${alreadyRevealed ? " is-shown" : ""}`}
    >
      <h2
        id="music-nowplaying"
        className="t-stagger-line t-stagger-line--1 mb-6 text-xs leading-4 font-medium text-gray-a10"
      >
        <span className="inline-flex items-center">
          <NowPlayingWaveform />
          Now playing
        </span>
      </h2>
      <div className="t-stagger-line t-stagger-line--2">
        <MusicRow
          track={track}
          priority={priority}
          spinning
        />
      </div>
    </section>
  );
}

function MusicList({
  sections,
  visibleCount,
  enteringIds,
}: {
  sections: MusicSection[];
  visibleCount: number;
  enteringIds: Set<string>;
}) {
  const visibleSections = visibleMusicSections(sections, visibleCount);
  let coverIndex = 0;

  useLayoutEffect(() => {
    for (const id of enteringIds) {
      seenMusicTrackIds.add(id);
    }
  }, [enteringIds]);

  return (
    <div className="flex w-full flex-col gap-6">
      {visibleSections.map((section) => {
        if (section.id === "nowplaying") {
          const track = section.tracks[0];

          if (!track) {
            return null;
          }

          const priority = coverIndex < MUSIC_PRIORITY_COVERS;
          coverIndex += 1;

          return (
            <NowPlayingSection
              key={section.id}
              track={track}
              priority={priority}
            />
          );
        }

        return (
          <section
            key={section.id}
            aria-labelledby={`music-${section.id}`}
            className="pb-6"
          >
            <h2
              id={`music-${section.id}`}
              className="mb-6 text-xs leading-4 font-medium text-gray-a10"
            >
              {section.label}
            </h2>
            <div className="flex flex-col gap-6">
              {section.tracks.map((track) => {
                const priority = coverIndex < MUSIC_PRIORITY_COVERS;
                coverIndex += 1;
                const reveal = enteringIds.has(track.id);

                return (
                  <MusicRow
                    key={track.id}
                    track={track}
                    priority={priority}
                    reveal={reveal}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function MusicPanelLoading() {
  return (
    <div className="flex w-full flex-col gap-6">
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="size-14 shrink-0 rounded-full bg-gray-3" />
          <span className="flex flex-1 flex-col gap-1.5">
            <span className="h-4 w-2/5 bg-gray-3" />
            <span className="h-4 w-1/4 bg-gray-3" />
          </span>
        </div>
      ))}
    </div>
  );
}

export function MusicPanel() {
  const { sections, totalTracks: cachedTotalTracks, partial } = useMusicCache();
  const [visibleCount, setVisibleCount] = useState(() => cachedVisibleCount);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const countedTracks =
    sections?.reduce((count, section) => count + section.tracks.length, 0) ?? 0;
  const totalTracks = Math.max(cachedTotalTracks, countedTracks);
  const visibleTracks = Math.min(visibleCount, countedTracks);
  const canShowMore = countedTracks > visibleCount;
  const waitingForMore = partial && countedTracks < totalTracks;
  const hasMore = sections !== null && (canShowMore || waitingForMore);

  useEffect(() => {
    watchNowPlaying();
    warmMusicLibrary();
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const loadMoreIfNeeded = () => {
      if (
        sentinel.getBoundingClientRect().top >
        window.innerHeight + MUSIC_LOAD_AHEAD_PX
      ) {
        return;
      }

      setVisibleCount((count) => {
        if (count >= countedTracks) {
          return count;
        }

        const nextCount = Math.min(count + MUSIC_PAGE_SIZE, countedTracks);
        cachedVisibleCount = nextCount;
        return nextCount;
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          loadMoreIfNeeded();
        }
      },
      { rootMargin: `${MUSIC_LOAD_AHEAD_PX}px 0px` },
    );

    observer.observe(sentinel);
    window.addEventListener("scroll", loadMoreIfNeeded, { passive: true });
    loadMoreIfNeeded();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", loadMoreIfNeeded);
    };
  }, [countedTracks, hasMore, visibleCount]);

  if (sections === null) {
    return (
      <div
        aria-busy
        className="t-skel"
        data-state="loading"
        style={{ minHeight: MUSIC_SKELETON_MIN_HEIGHT }}
      >
        <div className="t-skel-skeleton is-pulsing">
          <MusicPanelLoading />
        </div>
      </div>
    );
  }

  if (!sections.length) {
    return (
      <p className="text-sm leading-5 text-gray-a10">
        Music is unavailable right now.
      </p>
    );
  }

  return (
    <>
      <MusicList
        sections={sections}
        visibleCount={visibleCount}
        enteringIds={enteringMusicTrackIds(sections)}
      />
      {hasMore ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
      <p className="sr-only" role="status">
        Showing {visibleTracks} of {totalTracks} tracks
      </p>
    </>
  );
}
