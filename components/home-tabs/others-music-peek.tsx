"use client";

import { MusicWaveform } from "@/components/music-waveform";
import { useMusicCache } from "@/lib/music-client-cache";

export function OthersMusicPeek({
  active,
  onSelect,
}: {
  active: boolean;
  onSelect: () => void;
}) {
  const { nowPlaying } = useMusicCache();
  const open = active && nowPlaying !== null;

  return (
    <button
      type="button"
      aria-label="Now playing, open Music"
      className="home-others-music-peek"
      data-open={open}
      inert={!open}
      onClick={onSelect}
    >
      <span className="home-others-music-peek-inner">
        <MusicWaveform className="music-waveform--flush" />
      </span>
    </button>
  );
}
