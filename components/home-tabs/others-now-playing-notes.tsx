"use client";

import { useDialKit } from "dialkit";
import {
  useEffect,
  useState,
  type AnimationEvent,
  type CSSProperties,
} from "react";
import { filledSlotIcons } from "@/lib/icon-context";
import { useMusicCache } from "@/lib/music-client-cache";

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function randomNoteOrigin() {
  return {
    x: (Math.random() - 0.5) * 16,
    y: (Math.random() - 0.5) * 14,
  };
}

function OthersNowPlayingNote({
  index,
  size,
}: {
  index: number;
  size: number;
}) {
  const NoteIcon = filledSlotIcons.audio;
  const [origin, setOrigin] = useState(randomNoteOrigin);
  const direction = index % 2 === 0 ? -1 : 1;

  const rerollOrigin = (event: AnimationEvent<HTMLSpanElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    setOrigin(randomNoteOrigin());
  };

  return (
    <span
      className="others-now-playing-note"
      onAnimationIteration={rerollOrigin}
      style={
        {
          "--note-dir": String(direction),
          "--note-jitter-x": `${origin.x}px`,
          "--note-jitter-y": `${origin.y}px`,
          animationDelay: `calc(var(--note-stagger) * ${index})`,
        } as CSSProperties
      }
    >
      <span className="others-now-playing-note-icon">
        <NoteIcon size={size} />
      </span>
    </span>
  );
}

export function OthersNowPlayingNotes({ active }: { active: boolean }) {
  const params = useDialKit(
    "Others Music Notes",
    {
      preview: false,
      count: [3, 1, 8, 1],
      durationMs: [1600, 600, 4000, 50],
      staggerMs: [450, 100, 1500, 50],
      rise: [28, 8, 80, 1],
      originY: [0, 0, 48, 1],
      drift: [16, 0, 48, 1],
      rotate: [18, 0, 45, 1],
      scale: [1.15, 0.5, 2, 0.05],
      size: [12, 8, 24, 1],
      startOpacity: [0.85, 0, 1, 0.01],
      squiggle: false,
      squiggleWidth: [16, 4, 48, 1],
      squiggleAmount: [2, 1, 4, 1],
      color: { type: "color", default: "#0000009b" },
    },
    {
      id: "others-music-notes",
      persist: true,
    },
  );
  const { nowPlaying } = useMusicCache();
  const reducedMotion = usePrefersReducedMotion();
  const show =
    !reducedMotion && (params.preview || (active && nowPlaying !== null));

  if (!show) {
    return null;
  }

  const count = Math.max(1, Math.min(8, Math.round(params.count)));
  const size = params.size;
  const squiggles = Math.max(1, Math.min(4, Math.round(params.squiggleAmount)));

  return (
    <span
      aria-hidden
      className="others-now-playing-notes"
      data-path={params.squiggle ? "squiggle" : "straight"}
      data-squiggles={String(squiggles)}
      style={
        {
          "--note-dur": `${params.durationMs}ms`,
          "--note-stagger": `${params.staggerMs}ms`,
          "--note-rise": `${params.rise}px`,
          "--note-origin-y": `${params.originY}px`,
          "--note-drift": `${params.drift}px`,
          "--note-wave": `${params.squiggleWidth}px`,
          "--note-rotate": `${params.rotate}deg`,
          "--note-scale-start": "0.85",
          "--note-scale-end": String(params.scale),
          "--note-size": `${size}px`,
          "--note-start-opacity": String(params.startOpacity),
          color: params.color,
        } as CSSProperties
      }
    >
      {Array.from({ length: count }, (_, index) => (
        <OthersNowPlayingNote index={index} key={index} size={size} />
      ))}
    </span>
  );
}
