"use client";

import { useEffect, useRef } from "react";
import { Image } from "@/components/ui/image";
import { VideoPlayer } from "@/components/ui/video-player";
import { cn } from "@/lib/utils";
import type { WorkMediaItem, WorkMediaKind } from "@/lib/work";

export type PlayMediaKind = "all" | Extract<WorkMediaKind, "video" | "image">;

const PLAY_MEDIA_MAX = 4;
const PLAY_ASPECT_EPSILON = 0.01;
const PLAY_MEDIA_FALLBACK_WIDTH = 16;
const PLAY_MEDIA_FALLBACK_HEIGHT = 9;

export type PlayRowProps = {
  href: string;
  date: string;
  text: string;
  media?: WorkMediaItem[];
  mediaKind?: PlayMediaKind;
  mediaCount?: number;
  autoPlay?: boolean;
  className?: string;
};

export function PlayRow({
  href,
  text,
  media = [],
  mediaKind = "all",
  mediaCount,
  autoPlay = true,
  className,
}: PlayRowProps) {
  const openPost = () => {
    window.location.assign(href);
  };
  const visibleMedia = media
    .filter((item) => mediaKind === "all" || item.kind === mediaKind)
    .slice(
      0,
      mediaCount === undefined
        ? PLAY_MEDIA_MAX
        : Math.min(mediaCount, PLAY_MEDIA_MAX),
    );

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
      <PlayMediaGrid items={visibleMedia} autoPlay={autoPlay} />
      <p className="m-0 w-full whitespace-pre-wrap text-pretty text-sm leading-5 text-gray-12">
        {text}
      </p>
    </article>
  );
}

type TileLayout = {
  aspectRatio: number;
  objectFit: "contain" | "cover";
};

function PlayMediaGrid({
  items,
  autoPlay,
}: {
  items: WorkMediaItem[];
  autoPlay: boolean;
}) {
  if (items.length === 0) return null;

  const layouts = tileLayouts(items);

  return (
    <div
      className={cn(
        "w-full overflow-hidden",
        items.length > 1 && "grid grid-cols-2 gap-1.5",
      )}
    >
      {items.map((item, index) => {
        const layout = layouts[index];
        if (!layout) return null;

        return (
          <PlayMediaTile
            key={item.id}
            item={item}
            aspectRatio={layout.aspectRatio}
            objectFit={layout.objectFit}
            autoPlay={autoPlay}
            sizes={
              items.length === 1 ? "568px" : "calc((568px - 6px) / 2)"
            }
          />
        );
      })}
    </div>
  );
}

function PlayMediaTile({
  item,
  aspectRatio,
  objectFit,
  autoPlay,
  sizes,
}: {
  item: WorkMediaItem;
  aspectRatio: number;
  objectFit: "contain" | "cover";
  autoPlay: boolean;
  sizes: string;
}) {
  const label = mediaLabel(item);

  if (item.kind === "video" && item.src) {
    return (
      <PlayMediaVideo
        src={item.src}
        label={label}
        aspectRatio={aspectRatio}
        objectFit={objectFit}
        autoPlay={autoPlay}
      />
    );
  }

  return (
    <div
      className="relative w-full min-w-0 overflow-hidden rounded-md bg-gray-a2"
      style={{ aspectRatio }}
    >
      {item.kind === "image" && item.src ? (
        <Image
          src={item.src}
          alt={label}
          fill
          overlay
          objectFit={objectFit}
          sizes={sizes}
        />
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

function PlayMediaVideo({
  src,
  label,
  aspectRatio,
  objectFit,
  autoPlay,
}: {
  src: string;
  label: string;
  aspectRatio: number;
  objectFit: "contain" | "cover";
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
      objectFit={objectFit}
      className="relative w-full min-w-0 overflow-hidden rounded-[6px] bg-gray-a2"
      frameClassName="absolute inset-0 size-full aspect-auto"
      style={{ aspectRatio }}
    />
  );
}

function tileLayouts(items: WorkMediaItem[]): TileLayout[] {
  const first = items[0];
  if (items.length === 1 && first) {
    return [{ aspectRatio: nativeAspectRatio(first), objectFit: "cover" }];
  }

  const layouts: TileLayout[] = [];

  for (let index = 0; index < items.length; index += 2) {
    const left = items[index];
    const right = items[index + 1];
    if (!left) continue;

    if (right) {
      layouts.push(...pairLayouts(left, right));
      continue;
    }

    layouts.push({
      aspectRatio: cappedAspectRatio(left),
      objectFit: "cover",
    });
  }

  return layouts;
}

function pairLayouts(
  left: WorkMediaItem,
  right: WorkMediaItem,
): [TileLayout, TileLayout] {
  const leftNative = nativeAspectRatio(left);
  const rightNative = nativeAspectRatio(right);

  if (aspectsEqual(leftNative, rightNative)) {
    const aspectRatio = cappedAspectRatio(left);
    return [
      { aspectRatio, objectFit: "cover" },
      { aspectRatio, objectFit: "cover" },
    ];
  }

  return [
    { aspectRatio: 1, objectFit: "contain" },
    { aspectRatio: 1, objectFit: "contain" },
  ];
}

function nativeAspectRatio(item: WorkMediaItem) {
  const width = item.width ?? PLAY_MEDIA_FALLBACK_WIDTH;
  const height = item.height ?? PLAY_MEDIA_FALLBACK_HEIGHT;
  if (width <= 0 || height <= 0) {
    return PLAY_MEDIA_FALLBACK_WIDTH / PLAY_MEDIA_FALLBACK_HEIGHT;
  }
  return width / height;
}

function cappedAspectRatio(item: WorkMediaItem) {
  return Math.max(1, nativeAspectRatio(item));
}

function aspectsEqual(left: number, right: number) {
  return Math.abs(left - right) < PLAY_ASPECT_EPSILON;
}

function mediaLabel(item: WorkMediaItem) {
  const caption = item.caption.map((part) => part.text).join("");
  return caption || "Post media";
}
