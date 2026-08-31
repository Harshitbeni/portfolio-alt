"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { defaultIcons, mediaControlIcons } from "@/lib/icon-context";
import type { MusicTrack } from "@/lib/music";
import {
  prefetchMusicClip,
  toggleMusicTrack,
  useMusicClipStatus,
  useMusicPlayer,
} from "@/lib/music-player";
import {
  MUSIC_ROW_DEFAULT_COVER_SIZE,
  MUSIC_ROW_DEFAULT_HOLE_SIZE,
  MUSIC_ROW_DEFAULT_STROKE_TOKEN,
  type MusicRowStrokeToken,
} from "@/lib/music-row-cover";
import { cn } from "@/lib/utils";

const INNER_STROKE_WIDTH = 1;
const Play = mediaControlIcons.play;
const Pause = mediaControlIcons.pause;
const Loader = defaultIcons.loader;
const ArrowUpRight = defaultIcons["arrow-up-right"];

const hoverIconButtonClassName = cn(
  "shrink-0 text-gray-a11 active:scale-[0.96]",
  "transition-[opacity,scale] duration-150 ease-out motion-reduce:transition-none",
);

function coverMaskStyle(holeSize: number): CSSProperties | undefined {
  if (holeSize <= 0) return undefined;

  const holeRadius = holeSize / 2;

  return {
    WebkitMaskImage: `radial-gradient(circle, transparent ${holeRadius}px, #000 ${holeRadius}px)`,
    maskImage: `radial-gradient(circle, transparent ${holeRadius}px, #000 ${holeRadius}px)`,
  };
}

function innerStrokeStyle(
  holeSize: number,
  color: string,
): CSSProperties | undefined {
  if (holeSize <= 0) return undefined;

  const holeRadius = holeSize / 2;
  const inner = holeRadius - INNER_STROKE_WIDTH / 2;
  const outer = holeRadius + INNER_STROKE_WIDTH / 2;

  return {
    background: `radial-gradient(circle, transparent ${inner}px, ${color} ${inner}px, ${color} ${outer}px, transparent ${outer}px)`,
  };
}

function strokeColor(token: MusicRowStrokeToken): string {
  return `var(--${token})`;
}

function playStagger(block: HTMLElement | null) {
  if (!block) return;

  block.classList.remove("is-hiding");
  block.classList.remove("is-shown");
  void block.offsetHeight;
  block.classList.add("is-shown");
}

function PlayPauseIcon({
  playing,
  loading,
}: {
  playing: boolean;
  loading: boolean;
}) {
  const showPause = playing && !loading;
  const showPlay = !playing && !loading;

  return (
    <span className="relative inline-flex size-4 items-center justify-center">
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          "motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none",
          loading
            ? "scale-100 opacity-100 blur-0"
            : "scale-[0.25] opacity-0 blur-[4px]",
        )}
      >
        <Loader size={16} className="animate-spin" />
      </span>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          "motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none",
          showPause
            ? "scale-100 opacity-100 blur-0"
            : "scale-[0.25] opacity-0 blur-[4px]",
        )}
      >
        <Pause size={16} />
      </span>
      <span
        className={cn(
          "flex items-center justify-center",
          "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          "motion-reduce:scale-100 motion-reduce:blur-none motion-reduce:transition-none",
          showPlay
            ? "scale-100 opacity-100 blur-0"
            : "scale-[0.25] opacity-0 blur-[4px]",
        )}
      >
        <Play size={16} />
      </span>
    </span>
  );
}

function CoverArt({
  track,
  coverSize,
  holeSize,
  strokeToken,
  priority,
  spinning,
  reveal,
}: {
  track: MusicTrack;
  coverSize: number;
  holeSize: number;
  strokeToken: MusicRowStrokeToken;
  priority: boolean;
  spinning: boolean;
  reveal: boolean;
}) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const loaded = !track.image || failed || loadedSrc === track.image;
  const coverMask = coverMaskStyle(holeSize);
  const borderColor = strokeColor(strokeToken);
  const innerStroke = innerStrokeStyle(holeSize, borderColor);

  return (
    <span
      className={cn(
        "t-skel relative block shrink-0",
        loaded && "is-revealed",
        spinning && loaded && "music-vinyl-spin",
        reveal && "t-stagger-line t-stagger-line--1",
      )}
      data-state={loaded ? "loaded" : "loading"}
      style={{
        width: coverSize,
        height: coverSize,
        ["--pulse-count" as string]: "infinite",
      }}
    >
      <span className="t-skel-skeleton is-pulsing" aria-hidden>
        <span
          className="absolute inset-0 rounded-full bg-gray-3"
          style={coverMask}
        />
      </span>
      <span
        className="t-skel-content overflow-hidden rounded-full bg-gray-2"
        style={coverMask}
      >
        {track.image && !failed ? (
          <Image
            alt=""
            src={track.image}
            fill
            sizes={`${coverSize}px`}
            className="object-cover"
            unoptimized
            priority={priority}
            onLoad={() => {
              setLoadedSrc(track.image);
            }}
            onError={() => {
              setFailed(true);
            }}
          />
        ) : null}
      </span>
      {innerStroke ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] rounded-full"
          style={innerStroke}
        />
      ) : null}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[4] rounded-full border"
        style={{ borderColor }}
      />
    </span>
  );
}

function hoverRevealClassName(visible: boolean) {
  if (visible) {
    return "opacity-100";
  }

  return cn(
    "opacity-0",
    "pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100",
    "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
    "focus-visible:pointer-events-auto focus-visible:opacity-100",
    "[@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100",
  );
}

export function MusicRow({
  track,
  coverSize = MUSIC_ROW_DEFAULT_COVER_SIZE,
  holeSize = MUSIC_ROW_DEFAULT_HOLE_SIZE,
  strokeToken = MUSIC_ROW_DEFAULT_STROKE_TOKEN,
  priority = false,
  spinning = false,
  reveal = false,
}: {
  track: MusicTrack;
  coverSize?: number;
  holeSize?: number;
  strokeToken?: MusicRowStrokeToken;
  priority?: boolean;
  spinning?: boolean;
  reveal?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { playingId, loadingId } = useMusicPlayer();
  const clipStatus = useMusicClipStatus(track.id);
  const isPlaying = playingId === track.id;
  const isLoading = loadingId === track.id;
  const hasPreview = clipStatus !== "none" || isPlaying || isLoading;
  const vinylSpinning = isPlaying || (spinning && playingId === null);

  useLayoutEffect(() => {
    if (!reveal) return;
    playStagger(rootRef.current);
  }, [reveal, track.id]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "group flex w-full min-w-0 items-center gap-3",
        reveal && "t-stagger",
      )}
      onPointerEnter={() => {
        prefetchMusicClip(track);
      }}
      onFocusCapture={() => {
        prefetchMusicClip(track);
      }}
    >
      <button
        type="button"
        className={cn(
          "flex min-w-0 flex-1 items-center gap-3 rounded-md border-0 bg-transparent p-0 text-left font-[inherit] outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          isLoading ? "cursor-progress" : "cursor-pointer",
        )}
        aria-label={
          isLoading
            ? `Loading ${track.name}`
            : isPlaying
              ? `Pause ${track.name}`
              : `Play ${track.name}`
        }
        aria-pressed={isPlaying}
        aria-busy={isLoading || undefined}
        onClick={() => {
          void toggleMusicTrack(track);
        }}
      >
        <CoverArt
          key={track.image ?? "none"}
          track={track}
          coverSize={coverSize}
          holeSize={holeSize}
          strokeToken={strokeToken}
          priority={priority}
          spinning={vinylSpinning}
          reveal={reveal}
        />
        <span
          className={cn(
            "min-w-0 flex-1",
            reveal && "t-stagger-line t-stagger-line--2",
          )}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm leading-5 font-medium text-gray-a12">
              {track.name}
            </span>
            <span className="truncate text-sm leading-5 font-normal text-gray-a10">
              {track.artist}
            </span>
          </span>
        </span>
      </button>
      <span className="flex shrink-0 items-center">
        {hasPreview ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={
              isLoading
                ? `Loading ${track.name}`
                : isPlaying
                  ? `Pause ${track.name}`
                  : `Play ${track.name}`
            }
            aria-pressed={isPlaying}
            aria-busy={isLoading || undefined}
            className={cn(
              hoverIconButtonClassName,
              isLoading && "cursor-progress",
              hoverRevealClassName(isPlaying || isLoading),
            )}
            onClick={() => {
              void toggleMusicTrack(track);
            }}
          >
            <PlayPauseIcon playing={isPlaying} loading={isLoading} />
          </Button>
        ) : null}
        <Button
          variant="ghost"
          size="icon-sm"
          asChild
          className={cn(hoverIconButtonClassName, hoverRevealClassName(false))}
        >
          <a
            href={track.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${track.name} on Last.fm`}
          >
            <ArrowUpRight size={16} />
          </a>
        </Button>
      </span>
    </div>
  );
}
