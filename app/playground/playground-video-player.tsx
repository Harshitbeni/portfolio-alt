"use client";

import { VideoPlayer } from "@/components/ui/video-player";

const DEMO_SRC = "/video/showreel.mp4";

export function PlaygroundVideoPlayer({
  autoplayOnHover = false,
  caption = "",
  glow = false,
  loop = true,
  overlay = false,
  showMuteButton = false,
}: {
  autoplayOnHover?: boolean;
  caption?: string;
  glow?: boolean;
  loop?: boolean;
  overlay?: boolean;
  showMuteButton?: boolean;
}) {
  return (
    <VideoPlayer
      key={`${autoplayOnHover}-${glow}-${loop}-${overlay}-${showMuteButton}-${caption}`}
      className="w-full max-w-2xl"
      src={DEMO_SRC}
      autoplayOnHover={autoplayOnHover}
      caption={caption || undefined}
      glow={glow}
      loop={loop}
      overlay={overlay}
      showMuteButton={showMuteButton}
      aria-label="Showreel preview"
    />
  );
}
