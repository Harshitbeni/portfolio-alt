"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type Ref,
  type SyntheticEvent,
} from "react";
import { mediaControlIcons } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

export const VIDEO_PLAYER_GLOW_DEFAULTS = {
  offsetY: 24,
  blur: 24,
  opacity: 0.24,
} as const;

export type VideoPlayerGlowStyle = {
  offsetY: number;
  blur: number;
  opacity: number;
};

export type VideoPlayerPlayButtonStyle = {
  size: number;
  offsetX: number;
  offsetY: number;
  iconSize: number;
  bgBlur: number;
  ringThickness: number;
};

export const VIDEO_PLAYER_PLAY_BUTTON_DEFAULTS: VideoPlayerPlayButtonStyle = {
  size: 24,
  offsetX: 12,
  offsetY: 12,
  iconSize: 12,
  bgBlur: 8,
  ringThickness: 1.5,
};

export type VideoPlayerProps = Omit<
  ComponentProps<"video">,
  "autoPlay" | "controls" | "muted"
> & {
  autoplay?: boolean;
  autoplayOnHover?: boolean;
  glow?: boolean;
  overlay?: boolean;
  glowStyle?: VideoPlayerGlowStyle;
  playButtonStyle?: VideoPlayerPlayButtonStyle;
  caption?: string;
  showMuteButton?: boolean;
  ref?: Ref<HTMLVideoElement>;
};

function playVideo(video: HTMLVideoElement | null) {
  if (!video) return;
  void video.play().catch(() => {});
}

function pauseVideo(video: HTMLVideoElement | null, reset = false) {
  if (!video) return;
  video.pause();
  if (reset) video.currentTime = 0;
}

function syncGlowTime(
  glow: HTMLVideoElement | null,
  main: HTMLVideoElement | null,
) {
  if (!glow || !main) return;
  if (Math.abs(glow.currentTime - main.currentTime) > 0.05) {
    glow.currentTime = main.currentTime;
  }
}

function getVideoProgress(video: HTMLVideoElement) {
  if (!video.duration || !Number.isFinite(video.duration)) return 0;
  return video.currentTime / video.duration;
}

function getPlayButtonRingMetrics(
  size: number,
  ringThickness: number,
) {
  const strokePadding = ringThickness;
  const outerSize = size + strokePadding * 2;
  const radius = size / 2 + strokePadding / 2;
  const circumference = 2 * Math.PI * radius;

  return {
    strokePadding,
    outerSize,
    radius,
    circumference,
    center: outerSize / 2,
  };
}

const MUTE_BUTTON_CLASS_NAME =
  "flex shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function VideoPlayer({
  autoplay = true,
  autoplayOnHover = false,
  glow = false,
  overlay = false,
  glowStyle,
  playButtonStyle,
  caption,
  showMuteButton = false,
  loop = false,
  playsInline = true,
  preload = "metadata",
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTimeUpdate,
  ref,
  src,
  ...props
}: VideoPlayerProps) {
  const Play = mediaControlIcons.play;
  const Pause = mediaControlIcons.pause;
  const Volume = mediaControlIcons.volume;
  const VolumeOff = mediaControlIcons.volumeOff;
  const internalRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLVideoElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const setRefs = (node: HTMLVideoElement | null) => {
    internalRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const shouldAutoplayOnLoad = autoplay && !autoplayOnHover;
  const resolvedGlow = glowStyle ?? VIDEO_PLAYER_GLOW_DEFAULTS;
  const resolvedPlayButton =
    playButtonStyle ?? VIDEO_PLAYER_PLAY_BUTTON_DEFAULTS;
  const ringMetrics = getPlayButtonRingMetrics(
    resolvedPlayButton.size,
    resolvedPlayButton.ringThickness,
  );

  const glowLayerStyle = {
    transform: `translateY(${resolvedGlow.offsetY}px)`,
    filter: `blur(${resolvedGlow.blur}px)`,
    opacity: resolvedGlow.opacity,
  } satisfies CSSProperties;

  const playButtonLayerStyle = {
    height: ringMetrics.outerSize,
    left: resolvedPlayButton.offsetX - ringMetrics.strokePadding,
    bottom: resolvedPlayButton.offsetY - ringMetrics.strokePadding,
  } satisfies CSSProperties;

  const playButtonClusterStyle = {
    width: ringMetrics.outerSize,
    height: ringMetrics.outerSize,
  } satisfies CSSProperties;

  const controlSurfaceStyle = {
    width: resolvedPlayButton.size,
    height: resolvedPlayButton.size,
    backdropFilter: `blur(${resolvedPlayButton.bgBlur}px)`,
    WebkitBackdropFilter: `blur(${resolvedPlayButton.bgBlur}px)`,
  } satisfies CSSProperties;

  const playButtonSurfaceStyle = {
    ...controlSurfaceStyle,
    left: ringMetrics.strokePadding,
    top: ringMetrics.strokePadding,
  } satisfies CSSProperties;

  const updateProgressRing = useCallback(() => {
    const video = internalRef.current;
    const circle = progressRingRef.current;
    if (!video || !circle) return;

    const metrics = getPlayButtonRingMetrics(
      resolvedPlayButton.size,
      resolvedPlayButton.ringThickness,
    );
    const progress = getVideoProgress(video);

    circle.setAttribute("r", String(metrics.radius));
    circle.setAttribute("cx", String(metrics.center));
    circle.setAttribute("cy", String(metrics.center));
    circle.setAttribute("stroke-width", String(resolvedPlayButton.ringThickness));
    circle.style.strokeDasharray = String(metrics.circumference);
    circle.style.strokeDashoffset = String(
      metrics.circumference * (1 - progress),
    );
  }, [resolvedPlayButton.ringThickness, resolvedPlayButton.size]);

  useEffect(() => {
    const video = internalRef.current;
    if (!video) return;

    let rafId = 0;

    const syncPlaying = () => setIsPlaying(!video.paused);

    const tick = () => {
      updateProgressRing();
      if (!video.paused && !video.ended) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const startProgressLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    const stopProgressLoop = () => {
      cancelAnimationFrame(rafId);
      updateProgressRing();
    };

    syncPlaying();
    updateProgressRing();

    video.addEventListener("play", syncPlaying);
    video.addEventListener("pause", syncPlaying);
    video.addEventListener("ended", syncPlaying);
    video.addEventListener("play", startProgressLoop);
    video.addEventListener("pause", stopProgressLoop);
    video.addEventListener("ended", stopProgressLoop);
    video.addEventListener("seeked", updateProgressRing);
    video.addEventListener("loadedmetadata", updateProgressRing);

    if (!video.paused && !video.ended) {
      startProgressLoop();
    }

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("play", syncPlaying);
      video.removeEventListener("pause", syncPlaying);
      video.removeEventListener("ended", syncPlaying);
      video.removeEventListener("play", startProgressLoop);
      video.removeEventListener("pause", stopProgressLoop);
      video.removeEventListener("ended", stopProgressLoop);
      video.removeEventListener("seeked", updateProgressRing);
      video.removeEventListener("loadedmetadata", updateProgressRing);
    };
  }, [src, updateProgressRing]);

  useEffect(() => {
    updateProgressRing();
  }, [updateProgressRing]);

  useEffect(() => {
    if (!shouldAutoplayOnLoad) return;
    playVideo(internalRef.current);
    if (glow) playVideo(glowRef.current);
  }, [glow, shouldAutoplayOnLoad, src]);

  const handleActivate = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!autoplayOnHover) return;
    playVideo(event.currentTarget);
    if (glow) playVideo(glowRef.current);
  };

  const handleDeactivate = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (!autoplayOnHover) return;
    pauseVideo(event.currentTarget, true);
    if (glow) pauseVideo(glowRef.current, true);
    updateProgressRing();
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    onTimeUpdate?.(event);
    if (glow) syncGlowTime(glowRef.current, event.currentTarget);
  };

  const handleTogglePlay = () => {
    const video = internalRef.current;
    if (!video) return;

    if (video.paused) {
      playVideo(video);
      if (glow) playVideo(glowRef.current);
      return;
    }

    pauseVideo(video);
    if (glow) pauseVideo(glowRef.current);
  };

  const handleToggleMute = () => {
    const video = internalRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (glowRef.current) glowRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div
      className={cn(
        "w-full",
        caption && "flex flex-col items-start gap-1.5",
        className,
      )}
    >
      <div className="relative isolate aspect-video w-full rounded-[var(--radius)]">
      {glow && src ? (
        <video
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 block size-full object-cover"
          style={glowLayerStyle}
          src={src}
          muted
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          autoPlay={shouldAutoplayOnLoad}
          tabIndex={-1}
        />
      ) : null}

      <div
        className="relative z-10 size-full overflow-hidden rounded-[inherit]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          ref={setRefs}
          data-slot="video-player"
          className="block size-full object-cover"
          controls={false}
          muted={isMuted}
          loop={loop}
          playsInline={playsInline}
          preload={preload}
          autoPlay={shouldAutoplayOnLoad}
          tabIndex={autoplayOnHover ? 0 : undefined}
          onMouseEnter={(event) => {
            onMouseEnter?.(event);
            handleActivate(event);
          }}
          onMouseLeave={(event) => {
            onMouseLeave?.(event);
            handleDeactivate(event);
          }}
          onFocus={(event) => {
            onFocus?.(event);
            handleActivate(event);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            handleDeactivate(event);
          }}
          onTimeUpdate={handleTimeUpdate}
          src={src}
          {...props}
        />

        {overlay ? (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 z-20 bg-gray-a3 transition-opacity duration-200 ease-out",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          />
        ) : null}

        <div
          className="absolute z-30 flex items-center gap-1.5 text-gray-1"
          style={playButtonLayerStyle}
        >
          <div className="relative shrink-0" style={playButtonClusterStyle}>
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full overflow-visible"
              viewBox={`0 0 ${ringMetrics.outerSize} ${ringMetrics.outerSize}`}
            >
              <circle
                ref={progressRingRef}
                cx={ringMetrics.center}
                cy={ringMetrics.center}
                r={ringMetrics.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={resolvedPlayButton.ringThickness}
                strokeLinecap="round"
                strokeDasharray={ringMetrics.circumference}
                strokeDashoffset={ringMetrics.circumference}
                transform={`rotate(-90 ${ringMetrics.center} ${ringMetrics.center})`}
              />
            </svg>

            <button
              type="button"
              data-slot="video-player-play-button"
              className="absolute flex items-center justify-center rounded-full bg-gray-a10 outline-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={playButtonSurfaceStyle}
              onClick={handleTogglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <Pause size={resolvedPlayButton.iconSize} />
              ) : (
                <Play size={resolvedPlayButton.iconSize} />
              )}
            </button>
          </div>

          {showMuteButton ? (
            <button
              type="button"
              data-slot="video-player-mute-button"
              className={cn(
                MUTE_BUTTON_CLASS_NAME,
                isMuted ? "bg-gray-a10 text-gray-1" : "bg-gray-1 text-gray-a10",
              )}
              style={controlSurfaceStyle}
              onClick={handleToggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <VolumeOff size={resolvedPlayButton.iconSize} />
              ) : (
                <Volume size={resolvedPlayButton.iconSize} />
              )}
            </button>
          ) : null}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--gray-a4)]"
        />
      </div>
      </div>

      {caption ? (
        <p
          data-slot="video-player-caption"
          className="m-0 w-full text-left text-xxs leading-4 text-gray-a10"
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}
