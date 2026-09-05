"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import { MusicRow } from "@/components/music-row";
import { MusicWaveform } from "@/components/music-waveform";
import { useMusicCache, warmMusicLibrary, watchNowPlaying } from "@/lib/music-client-cache";
import type { MusicSection, MusicTrack } from "@/lib/music";

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 * Now-playing identity change (not first paint):
 *
 *    0ms   previous now-playing row fades out in place
 *    0ms   same track fades in at the top of Today
 *    0ms   Today rows shift down to make room
 *    0ms   new now-playing row staggers in (blur + 12px rise)
 *  150ms   previous now-playing fade settles
 *  280ms   Today row shift settles
 *  600ms   new now-playing stagger completes
 * ───────────────────────────────────────────────────────── */

const MUSIC_PAGE_SIZE = 50;
const MUSIC_LOAD_AHEAD_PX = 480;
const MUSIC_PRIORITY_COVERS = 8;
const MUSIC_SKELETON_MIN_HEIGHT = 264;
const MUSIC_BULK_NEW_TRACK_THRESHOLD = 8;

const ROW_LAYOUT = {
  layout: {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

const ROW_FADE = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

const ROW_EXIT = {
  opacity: 0,
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
};

const ROW_EXIT_TRANSITION = {
  duration: 0.15,
  ease: [0.4, 0, 1, 1] as const,
};

let cachedVisibleCount = MUSIC_PAGE_SIZE;
const seenMusicTrackIds = new Set<string>();
let musicTracksSeeded = false;
let revealedNowPlayingId: string | null = null;
let nowPlayingHeadingRevealed = false;
let previousNowPlayingId: string | null = null;
let lastDepartedNowPlayingId: string | null = null;
const revealedLibraryTrackIds = new Map<string, string[]>();

function trackIds(tracks: MusicTrack[]) {
  return tracks.map((track) => track.id);
}

function isTrackListAppend(previousIds: string[] | undefined, nextIds: string[]) {
  if (!previousIds?.length) return false;
  if (nextIds.length <= previousIds.length) return false;
  return previousIds.every((id, index) => nextIds[index] === id);
}

function isTrackListPrepend(
  previousIds: string[] | undefined,
  nextIds: string[],
) {
  if (!previousIds?.length) return false;
  if (nextIds.length <= previousIds.length) return false;

  const offset = nextIds.length - previousIds.length;
  return previousIds.every((id, index) => nextIds[index + offset] === id);
}

function isTrackListRemoval(
  previousIds: string[] | undefined,
  nextIds: string[],
) {
  if (!previousIds?.length || !nextIds.length) return false;
  if (nextIds.length >= previousIds.length) return false;

  let index = 0;

  for (const id of previousIds) {
    if (id === nextIds[index]) {
      index += 1;
      if (index === nextIds.length) return true;
    }
  }

  return false;
}

function rememberNowPlayingChange(nowPlayingId: string | null) {
  if (previousNowPlayingId === nowPlayingId) {
    return;
  }

  if (previousNowPlayingId) {
    lastDepartedNowPlayingId = previousNowPlayingId;
    seenMusicTrackIds.add(previousNowPlayingId);
  }

  previousNowPlayingId = nowPlayingId;
}

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

function playStagger(block: HTMLElement | null) {
  if (!block) return;

  block.classList.remove("is-hiding");
  block.classList.remove("is-shown");
  void block.offsetHeight;
  block.classList.add("is-shown");
}

function TrackRow({
  track,
  priority,
  spinning = false,
  reveal = false,
  fadeIn = false,
  shareLayout = true,
  reduceMotion,
}: {
  track: MusicTrack;
  priority: boolean;
  spinning?: boolean;
  reveal?: boolean;
  fadeIn?: boolean;
  shareLayout?: boolean;
  reduceMotion: boolean;
}) {
  const layoutEnabled = !reduceMotion && shareLayout && !reveal && !fadeIn;

  return (
    <motion.div
      layout={layoutEnabled ? "position" : false}
      initial={fadeIn && !reduceMotion ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : ROW_EXIT}
      transition={
        reduceMotion
          ? { duration: 0 }
          : fadeIn
            ? ROW_FADE
            : shareLayout
              ? ROW_LAYOUT
              : ROW_EXIT_TRANSITION
      }
      className="relative w-full min-w-0"
    >
      <MusicRow
        track={track}
        priority={priority}
        spinning={spinning}
        reveal={reveal}
      />
    </motion.div>
  );
}

function NowPlayingSection({
  track,
  priority,
  reduceMotion,
}: {
  track: MusicTrack;
  priority: boolean;
  reduceMotion: boolean;
}) {
  const headingRevealed = nowPlayingHeadingRevealed;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const revealIncoming = revealedNowPlayingId !== track.id;

  useLayoutEffect(() => {
    if (!headingRevealed) {
      playStagger(headingRef.current);
      nowPlayingHeadingRevealed = true;
    }

    revealedNowPlayingId = track.id;
  }, [headingRevealed, track.id]);

  return (
    <section aria-labelledby="music-nowplaying" className="pb-6">
      <h2
        ref={headingRef}
        id="music-nowplaying"
        className={`t-stagger mb-6 text-xs leading-4 font-medium text-gray-a10${
          headingRevealed ? " is-shown" : ""
        }`}
      >
        <span className="t-stagger-line t-stagger-line--1">
          <span className="inline-flex items-center">
            <MusicWaveform />
            Now playing
          </span>
        </span>
      </h2>
      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          <TrackRow
            key={track.id}
            track={track}
            priority={priority}
            spinning
            shareLayout={false}
            reveal={revealIncoming}
            reduceMotion={reduceMotion}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}

function LibrarySection({
  section,
  enteringIds,
  tracks,
  reduceMotion,
  shareLayout = true,
}: {
  section: MusicSection;
  enteringIds: Set<string>;
  tracks: Array<{ track: MusicTrack; priority: boolean }>;
  reduceMotion: boolean;
  shareLayout?: boolean;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextIds = trackIds(tracks.map(({ track }) => track));
  const nextKey = nextIds.join("\0");
  const previousIds = revealedLibraryTrackIds.get(section.id);
  const pagination = isTrackListAppend(previousIds, nextIds);
  const arrivingFromNowPlaying =
    lastDepartedNowPlayingId !== null &&
    nextIds[0] === lastDepartedNowPlayingId;
  const alreadyRevealed =
    previousIds !== undefined
      ? previousIds.join("\0") === nextKey ||
        pagination ||
        isTrackListPrepend(previousIds, nextIds) ||
        isTrackListRemoval(previousIds, nextIds)
      : arrivingFromNowPlaying;

  useLayoutEffect(() => {
    revealedLibraryTrackIds.set(section.id, nextIds);

    if (pagination || alreadyRevealed) return;

    playStagger(headingRef.current);
  }, [alreadyRevealed, nextIds, nextKey, pagination, section.id]);

  return (
    <section aria-labelledby={`music-${section.id}`} className="pb-6">
      <motion.h2
        layout={!reduceMotion && shareLayout ? "position" : false}
        transition={ROW_LAYOUT}
        ref={headingRef}
        id={`music-${section.id}`}
        className={`t-stagger mb-6 text-xs leading-4 font-medium text-gray-a10${
          alreadyRevealed ? " is-shown" : ""
        }`}
      >
        <span className="t-stagger-line t-stagger-line--1">
          {section.label}
        </span>
      </motion.h2>
      <div className="flex flex-col gap-6">
        {tracks.map(({ track, priority }) => (
          <TrackRow
            key={track.id}
            track={track}
            priority={priority}
            shareLayout={shareLayout}
            reveal={
              pagination
                ? enteringIds.has(track.id)
                : !alreadyRevealed
            }
            fadeIn={
              track.id === lastDepartedNowPlayingId &&
              !previousIds?.includes(track.id)
            }
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </section>
  );
}

function MusicList({
  sections,
  visibleCount,
  enteringIds,
  shareLayout = true,
}: {
  sections: MusicSection[];
  visibleCount: number;
  enteringIds: Set<string>;
  shareLayout?: boolean;
}) {
  const reduceMotion = Boolean(useReducedMotion());
  const visibleSections = visibleMusicSections(sections, visibleCount);
  let coverIndex = 0;

  useLayoutEffect(() => {
    for (const id of enteringIds) {
      seenMusicTrackIds.add(id);
    }
  }, [enteringIds]);

  return (
    <LayoutGroup id="music-tracks">
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
                reduceMotion={reduceMotion}
              />
            );
          }

          const tracks = section.tracks.map((track) => {
            const priority = coverIndex < MUSIC_PRIORITY_COVERS;
            coverIndex += 1;
            return { track, priority };
          });

          return (
            <LibrarySection
              key={section.id}
              section={section}
              enteringIds={enteringIds}
              tracks={tracks}
              reduceMotion={reduceMotion}
              shareLayout={shareLayout}
            />
          );
        })}
      </div>
    </LayoutGroup>
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

export function MusicPanel({
  shareLayout = true,
}: {
  shareLayout?: boolean;
}) {
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

  const nowPlayingId =
    sections.find((section) => section.id === "nowplaying")?.tracks[0]?.id ??
    null;
  rememberNowPlayingChange(nowPlayingId);

  return (
    <>
      <MusicList
        sections={sections}
        visibleCount={visibleCount}
        enteringIds={enteringMusicTrackIds(sections)}
        shareLayout={shareLayout}
      />
      {hasMore ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
      <p className="sr-only" role="status">
        Showing {visibleTracks} of {totalTracks} tracks
      </p>
    </>
  );
}
