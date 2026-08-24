"use client";

import { useEffect, useRef, useState } from "react";
import { WorkMediaCarousel } from "@/components/work-media-carousel";
import { defaultIcons } from "@/lib/icon-context";
import { cn } from "@/lib/utils";
import type { WorkMediaItem, WorkMediaKind } from "@/lib/work";

export type PlayMediaKind = "all" | Extract<WorkMediaKind, "video" | "image">;

const PLAY_ASSET_HEIGHT = 280;
const PLAY_TEXT_LINE_HEIGHT = 20;
const PLAY_VISIBLE_TEXT_HEIGHT = PLAY_TEXT_LINE_HEIGHT * 3;
const ChevronDown = defaultIcons["chevron-down"];

export type PlayRowProps = {
  href: string;
  date: string;
  text: string;
  media?: WorkMediaItem[];
  mediaKind?: PlayMediaKind;
  mediaCount?: number;
  fadeHeight?: number;
  autoPlay?: boolean;
  className?: string;
};

export function PlayRow({
  href,
  text,
  media = [],
  mediaKind = "all",
  mediaCount,
  fadeHeight,
  autoPlay = true,
  className,
}: PlayRowProps) {
  const openPost = () => {
    window.location.assign(href);
  };
  const visibleMedia = media
    .filter((item) => mediaKind === "all" || item.kind === mediaKind)
    .slice(0, mediaCount);

  return (
    <article
      className={cn(
        "flex w-full cursor-pointer flex-col gap-1.5 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring",
        className,
      )}
      role="link"
      tabIndex={0}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("button, a")) {
          return;
        }
        openPost();
      }}
      onKeyDown={(event) => {
        if (event.target instanceof Element && event.target.closest("button, a")) {
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          openPost();
        }
      }}
    >
      <WorkMediaCarousel
        heading="Post"
        items={visibleMedia}
        fit="content"
        assetHeight={PLAY_ASSET_HEIGHT}
        objectFit="contain"
        autoPlay={autoPlay}
      />
      <PlayPostText text={text} fadeHeight={fadeHeight} />
    </article>
  );
}

function PlayPostText({
  text,
  fadeHeight = 40,
}: {
  text: string;
  fadeHeight?: number;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [canExpand, setCanExpand] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const updateCanExpand = () => {
      setCanExpand(
        textElement.scrollHeight > PLAY_TEXT_LINE_HEIGHT * 2 + 1,
      );
    };
    const observer = new ResizeObserver(updateCanExpand);
    const animationFrame = window.requestAnimationFrame(updateCanExpand);

    observer.observe(textElement);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      <p
        ref={textRef}
        className={cn(
          "m-0 whitespace-pre-wrap text-pretty text-sm leading-5 text-gray-12",
          !expanded && "max-h-[60px] overflow-hidden",
        )}
        style={!expanded ? { maxHeight: PLAY_VISIBLE_TEXT_HEIGHT } : undefined}
      >
        {text}
      </p>
      {!expanded && canExpand ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 w-full bg-linear-to-b from-transparent to-background to-[50%]"
            style={{ height: fadeHeight }}
          />
          <button
            type="button"
            className="absolute bottom-0 left-0 flex h-8 items-center gap-1 px-0 text-sm font-medium text-gray-10 outline-none transition-colors hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            onClick={() => setExpanded(true)}
          >
            See more
            <ChevronDown size={14} />
          </button>
        </>
      ) : null}
    </div>
  );
}
