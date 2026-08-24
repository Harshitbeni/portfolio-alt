"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import {
  MUSIC_ROW_DEFAULT_COVER_SIZE,
  MUSIC_ROW_DEFAULT_HOLE_SIZE,
  MUSIC_ROW_DEFAULT_STROKE_TOKEN,
  type MusicRowStrokeToken,
} from "@/lib/music-row-cover";
import type { MusicTrack } from "@/lib/music";

const INNER_STROKE_WIDTH = 1;

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
  const rootRef = useRef<HTMLAnchorElement>(null);
  const coverMask = coverMaskStyle(holeSize);
  const borderColor = strokeColor(strokeToken);
  const innerStroke = innerStrokeStyle(holeSize, borderColor);

  useLayoutEffect(() => {
    if (!reveal) return;
    playStagger(rootRef.current);
  }, [reveal, track.id]);

  return (
    <a
      ref={rootRef}
      className={`group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring${
        reveal ? " t-stagger" : ""
      }`}
      href={track.url}
      target="_blank"
      rel="noreferrer"
    >
      <span
        className={`relative block shrink-0${spinning ? " music-vinyl-spin" : ""}${
          reveal ? " t-stagger-line t-stagger-line--1" : ""
        }`}
        style={{
          width: coverSize,
          height: coverSize,
        }}
      >
        <span
          className="absolute inset-0 z-0 overflow-hidden rounded-full bg-gray-2"
          style={coverMask}
        >
          {track.image ? (
            <Image
              alt={`Cover art for ${track.name}`}
              src={track.image}
              fill
              sizes={`${coverSize}px`}
              className="object-cover"
              unoptimized
              priority={priority}
            />
          ) : null}
        </span>
        {innerStroke ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] rounded-full"
            style={innerStroke}
          />
        ) : null}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] rounded-full border"
          style={{ borderColor }}
        />
      </span>
      <span
        className={`flex min-w-0 flex-1 flex-col gap-0.5${
          reveal ? " t-stagger-line t-stagger-line--2" : ""
        }`}
      >
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {track.name}
        </span>
        <span className="truncate text-sm leading-5 font-normal text-gray-a10">
          {track.artist}
        </span>
      </span>
    </a>
  );
}
