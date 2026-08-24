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
import { defaultIcons, mediaControlIcons } from "@/lib/icon-context";
import { cn } from "@/lib/utils";
import type { WorkCaptionPart, WorkMediaItem } from "@/lib/work";

export const WORK_MEDIA_TILE_WIDTH = 480;
export const WORK_MEDIA_TILE_HEIGHT = 320;
export const WORK_MEDIA_TILE_GAP = 12;

const TILE_SCROLL_BY = WORK_MEDIA_TILE_WIDTH + WORK_MEDIA_TILE_GAP;
const VIDEO_PROGRESS_RING_RADIUS = 10;
const VIDEO_PROGRESS_RING_CIRCUMFERENCE =
  2 * Math.PI * VIDEO_PROGRESS_RING_RADIUS;
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
export type WorkMediaLayout = "carousel" | "stack";

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

  if (layout === "stack") {
    return <div className="flex w-full flex-col gap-3 py-3">{slides}</div>;
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

  return (
    <figure
      className={cn(
        "flex snap-start flex-col",
        layout === "stack"
          ? "w-full pb-6"
          : fit === "content"
          ? fullWidth
            ? "w-full basis-full shrink-0"
            : "shrink-0"
          : "w-[480px] shrink-0",
        (item.caption.length > 0 || showViewProject) &&
          (layout === "stack" ? "gap-3" : "gap-1.5"),
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
          <WorkMediaTile
            item={item}
            label={label}
            fit={fit}
            minHeight={effectiveMinHeight}
            objectFit={objectFit}
            showMuteButton={showMuteButton}
            autoPlay={autoPlay}
          />
        </Link>
      ) : (
        <WorkMediaTile
          item={item}
          label={label}
          fit={fit}
          minHeight={effectiveMinHeight}
          objectFit={objectFit}
          showMuteButton={showMuteButton}
          autoPlay={autoPlay}
        />
      )}
      {item.caption.length > 0 || showViewProject ? (
        <figcaption
          className={cn(
            "m-0 w-full text-pretty",
            layout === "stack"
              ? "flex flex-col gap-1.5"
              : item.captionSize === "xs"
              ? "text-xs leading-[18px] text-gray-a11"
              : "text-xxs leading-4 text-gray-a10",
          )}
        >
          {item.caption.length > 0 ? (
            <p
              className={
                layout === "stack"
                  ? "m-0 text-sm leading-5 text-gray-a12"
                  : undefined
              }
            >
              <WorkMediaCaption parts={item.caption} />
            </p>
          ) : null}
          {showViewProject ? (
            item.href ? (
              <Link
                href={item.href}
                className="inline-flex w-fit items-center gap-1 text-xs font-medium leading-[18px] text-gray-a10 outline-none transition-colors duration-200 ease-out hover:text-gray-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                <span>View Project</span>
                <ArrowRight size={12} />
              </Link>
            ) : (
              <p className="flex w-fit items-center gap-1 text-xs font-medium leading-[18px] text-gray-a10 transition-colors duration-200 ease-out hover:text-gray-12">
                <span>View Project</span>
                <ArrowRight size={12} />
              </p>
            )
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
  if (layout === "stack") return undefined;
  if (fit !== "content") return undefined;
  if (fullWidth) return undefined;

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
  const Play = mediaControlIcons.play;
  const Pause = mediaControlIcons.pause;
  const Volume = mediaControlIcons.volume;
  const VolumeOff = mediaControlIcons.volumeOff;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

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

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().catch(() => {});
      return;
    }

    video.pause();
  };

  const toggleMuted = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <div
      className={tileFrameClassName(fit)}
      style={tileFrameStyle(item, fit, minHeight)}
    >
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 size-full",
          objectFit === "contain" ? "object-contain" : "object-cover",
        )}
        src={src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          const { currentTime, duration } = event.currentTarget;
          setProgress(
            Number.isFinite(duration) && duration > 0
              ? currentTime / duration
              : 0,
          );
        }}
      />
      <div className="absolute bottom-[11px] left-[11px] z-20 flex items-center gap-1.5 text-gray-1">
        <button
          type="button"
          className="relative flex size-6 items-center justify-center rounded-full bg-gray-a10 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          onClick={togglePlayback}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="-rotate-90 pointer-events-none absolute inset-0 size-full"
          >
            <circle
              cx="12"
              cy="12"
              r={VIDEO_PROGRESS_RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.28"
            />
            <circle
              cx="12"
              cy="12"
              r={VIDEO_PROGRESS_RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={VIDEO_PROGRESS_RING_CIRCUMFERENCE}
              strokeDashoffset={VIDEO_PROGRESS_RING_CIRCUMFERENCE * (1 - progress)}
            />
          </svg>
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
        {showMuteButton ? (
          <button
            type="button"
            className={cn(
              "flex size-6 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
              muted ? "bg-gray-a10 text-gray-1" : "bg-gray-1 text-gray-a10",
            )}
            aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}
            onClick={toggleMuted}
          >
            {muted ? <VolumeOff size={12} /> : <Volume size={12} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function WorkMediaCaption({ parts }: { parts: WorkCaptionPart[] }) {
  return (
    <>
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
    </>
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
