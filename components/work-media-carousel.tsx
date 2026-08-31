"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { defaultIcons } from "@/lib/icon-context";
import { cn } from "@/lib/utils";
import type { WorkCaptionPart, WorkMediaItem } from "@/lib/work";

export const WORK_MEDIA_TILE_WIDTH = 480;
export const WORK_MEDIA_TILE_HEIGHT = 320;
export const WORK_MEDIA_TILE_GAP = 12;

const TILE_SCROLL_BY = WORK_MEDIA_TILE_WIDTH + WORK_MEDIA_TILE_GAP;
const WORK_MEDIA_MIN_HEIGHT = 240;
const WORK_MEDIA_MIN_WIDTH = 0;
const WORK_MEDIA_GAP = 6;
const WORK_MEDIA_SINGLE_IMAGE_FULL_WIDTH = true;
const ArrowRight = defaultIcons["arrow-right"];

const tileClassName =
  "overflow-hidden rounded-[6px] bg-gray-a2 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[6px] after:border after:border-black/10 after:content-[''] dark:after:border-white/10";

const fixedTileClassName = "h-[320px] w-[480px] shrink-0";

export type WorkMediaFit = "fixed" | "content";
export type WorkMediaObjectFit = "contain" | "cover";
export type WorkMediaLayout = "carousel" | "stack" | "row";

function isStackedLayout(layout: WorkMediaLayout) {
  return layout === "stack" || layout === "row";
}

export function WorkMediaCarousel({
  heading,
  items,
  fit = "content",
  assetHeight,
  objectFit = "cover",
  showMuteButton = false,
  layout = "carousel",
  showViewProject = false,
  autoPlay = true,
  className,
}: {
  heading: string;
  items: WorkMediaItem[];
  fit?: WorkMediaFit;
  assetHeight?: number;
  objectFit?: WorkMediaObjectFit;
  showMuteButton?: boolean;
  layout?: WorkMediaLayout;
  showViewProject?: boolean;
  autoPlay?: boolean;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const scrollByTile = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      scroller.scrollBy({
        left:
          direction *
          (fit === "content" ? scroller.clientWidth : TILE_SCROLL_BY),
        behavior: reducedMotion ? "instant" : "smooth",
      });
    },
    [fit, reducedMotion],
  );

  if (items.length === 0) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByTile(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByTile(-1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      scrollerRef.current?.scrollTo({
        left: 0,
        behavior: reducedMotion ? "instant" : "smooth",
      });
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollTo({
        left: scroller.scrollWidth,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  };

  const slides = items.map((item) => (
    <WorkMediaSlide
      key={item.id}
      item={item}
      heading={heading}
      fit={fit}
      minHeight={assetHeight ?? WORK_MEDIA_MIN_HEIGHT}
      minWidth={WORK_MEDIA_MIN_WIDTH}
      fullWidth={
        assetHeight == null &&
        WORK_MEDIA_SINGLE_IMAGE_FULL_WIDTH &&
        items.length === 1 &&
        item.kind === "image"
      }
      objectFit={objectFit}
      showMuteButton={showMuteButton}
      layout={layout}
      showViewProject={showViewProject}
      autoPlay={autoPlay}
    />
  ));

  if (isStackedLayout(layout)) {
    return (
      <div className={cn("flex w-full flex-col gap-3 py-3", className)}>
        {slides}
      </div>
    );
  }

  return (
    <div
      ref={scrollerRef}
      role="region"
      tabIndex={0}
      aria-label={`${heading} media`}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden outline-none overscroll-x-contain [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring [&::-webkit-scrollbar]:hidden",
        assetHeight == null && "py-3",
      )}
      style={{ gap: WORK_MEDIA_GAP, height: assetHeight }}
    >
      {slides}
    </div>
  );
}

function WorkMediaSlide({
  item,
  heading,
  fit,
  minHeight,
  minWidth,
  fullWidth,
  objectFit,
  showMuteButton,
  layout,
  showViewProject,
  autoPlay,
}: {
  item: WorkMediaItem;
  heading: string;
  fit: WorkMediaFit;
  minHeight: number;
  minWidth: number;
  fullWidth: boolean;
  objectFit: WorkMediaObjectFit;
  showMuteButton: boolean;
  layout: WorkMediaLayout;
  showViewProject: boolean;
  autoPlay: boolean;
}) {
  const caption = captionText(item.caption);
  const label = caption || `${heading} media`;
  const effectiveMinHeight = fullWidth ? 0 : minHeight;
  const effectiveMinWidth = fullWidth ? 0 : minWidth;
  const isStack = isStackedLayout(layout);
  const isCaptionRow = layout === "row";
  const media = (
    <WorkMediaTile
      item={item}
      label={label}
      fit={fit}
      minHeight={effectiveMinHeight}
      objectFit={objectFit}
      showMuteButton={showMuteButton}
      autoPlay={autoPlay}
    />
  );

  return (
    <figure
      className={cn(
        "flex snap-start",
        isStack
          ? "w-full flex-col pb-6"
          : fit === "content"
            ? fullWidth
              ? "w-full basis-full shrink-0 flex-col"
              : "shrink-0 flex-col"
            : "w-[480px] shrink-0 flex-col",
        (item.caption.length > 0 || (showViewProject && item.href)) &&
          (isStack ? "gap-3" : "gap-1.5"),
      )}
      style={mediaSlideStyle(
        item,
        fit,
        effectiveMinHeight,
        effectiveMinWidth,
        fullWidth,
        layout,
      )}
    >
      {item.href ? (
        <Link
          href={item.href}
          aria-label={`View ${label}`}
          className="block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          {media}
        </Link>
      ) : (
        media
      )}
      {item.caption.length > 0 || (showViewProject && item.href) ? (
        <figcaption
          className={cn(
            "m-0 text-pretty",
            isCaptionRow
              ? "flex w-full flex-row flex-nowrap items-center gap-3"
              : isStack
                ? "flex w-full flex-col gap-1.5"
                : item.captionSize === "xs"
                  ? "w-full text-xs leading-[18px] text-gray-a11"
                  : "w-full text-xxs leading-4 text-gray-a10",
          )}
        >
          {item.caption.length > 0 ? (
            <p
              className={
                isStack
                  ? cn(
                      "m-0 min-w-0 w-full text-sm leading-5 text-gray-a12",
                      isCaptionRow && "flex-1",
                    )
                  : undefined
              }
            >
              <WorkMediaCaption parts={item.caption} />
            </p>
          ) : null}
          {showViewProject && item.href ? (
            <Button
              variant="secondary"
              size="sm"
              asChild
              className="w-fit shrink-0"
            >
              <Link href={item.href}>
                View Project
                <ArrowRight />
              </Link>
            </Button>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function mediaSlideStyle(
  item: WorkMediaItem,
  fit: WorkMediaFit,
  minHeight: number,
  minWidth: number,
  fullWidth: boolean,
  layout: WorkMediaLayout,
) {
  if (isStackedLayout(layout)) return undefined;
  if (fit !== "content") return undefined;
  if (fullWidth) return undefined;

  return mediaContentWidthStyle(item, minHeight, minWidth);
}

function mediaContentWidthStyle(
  item: WorkMediaItem,
  minHeight: number,
  minWidth: number,
) {
  const width = item.width ?? WORK_MEDIA_TILE_WIDTH;
  const height = item.height ?? WORK_MEDIA_TILE_HEIGHT;
  const minimumWidth = Math.max(
    minWidth,
    Math.ceil((width / height) * minHeight),
  );

  return { width: `${minimumWidth}px` };
}

function tileFrameClassName(fit: WorkMediaFit) {
  return cn(
    tileClassName,
    "relative",
    fit === "content" ? "w-full" : fixedTileClassName,
  );
}

function tileFrameStyle(
  item: WorkMediaItem,
  fit: WorkMediaFit,
  minHeight: number,
) {
  if (fit !== "content") return { minHeight };

  const width = item.width ?? WORK_MEDIA_TILE_WIDTH;
  const height = item.height ?? WORK_MEDIA_TILE_HEIGHT;
  return { aspectRatio: `${width} / ${height}`, minHeight };
}

function WorkMediaTile({
  item,
  label,
  fit,
  minHeight,
  objectFit,
  showMuteButton,
  autoPlay,
}: {
  item: WorkMediaItem;
  label: string;
  fit: WorkMediaFit;
  minHeight: number;
  objectFit: WorkMediaObjectFit;
  showMuteButton: boolean;
  autoPlay: boolean;
}) {
  if (item.kind === "video" && item.src) {
    return (
    <WorkMediaVideo
      src={item.src}
      label={label}
      item={item}
      fit={fit}
      minHeight={minHeight}
      objectFit={objectFit}
      showMuteButton={showMuteButton}
      autoPlay={autoPlay}
    />
    );
  }

  return (
    <div
      className={tileFrameClassName(fit)}
      style={tileFrameStyle(item, fit, minHeight)}
    >
      {item.kind === "image" && item.src ? (
        <Image
          src={item.src}
          alt={label}
          fill
          sizes={fit === "content" ? "568px" : "480px"}
          className={objectFit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

function WorkMediaVideo({
  src,
  label,
  item,
  fit,
  minHeight,
  objectFit,
  showMuteButton,
  autoPlay,
}: {
  src: string;
  label: string;
  item: WorkMediaItem;
  fit: WorkMediaFit;
  minHeight: number;
  objectFit: WorkMediaObjectFit;
  showMuteButton: boolean;
  autoPlay: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!autoPlay) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          video.preload = "auto";
          void video.play().catch(() => {});
          return;
        }

        video.pause();
      },
      { rootMargin: "100px 0px" },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [autoPlay, src]);

  return (
    <VideoPlayer
      ref={videoRef}
      src={src}
      aria-label={label}
      glow={false}
      overlay
      autoplay={false}
      loop
      playsInline
      preload="metadata"
      showMuteButton={showMuteButton}
      objectFit={objectFit}
      className={cn(
        "relative overflow-hidden rounded-[var(--radius)] bg-gray-a2",
        fit === "content" ? "w-full" : fixedTileClassName,
      )}
      frameClassName="absolute inset-0 size-full aspect-auto"
      style={tileFrameStyle(item, fit, minHeight)}
    />
  );
}

function WorkMediaCaption({ parts }: { parts: WorkCaptionPart[] }) {
  return (
    <span className="block w-full min-w-0">
      {parts.map((part, index) =>
        part.dotted ? (
          <span
            key={`${part.text}-${index}`}
            className="underline decoration-gray-a8 decoration-dotted [text-decoration-skip-ink:none] [text-decoration-thickness:10%] [text-underline-position:from-font]"
          >
            {part.text}
          </span>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </span>
  );
}

function captionText(parts: WorkCaptionPart[]) {
  return parts.map((part) => part.text).join("");
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}
