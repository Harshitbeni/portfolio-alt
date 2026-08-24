"use client";

import { useEffect, useState, type CSSProperties } from "react";

import "./mini-beni.css";

const ATLAS_COLUMNS = 8;
const CELL_WIDTH = 192;
const CELL_HEIGHT = 208;
const IDLE_FRAME_COUNT = 6;
const IDLE_FRAME_DURATION = 360;
const NAV_AVATAR_HEIGHT = 48;
const NAV_AVATAR_OFFSET_X = 0;
const NAV_AVATAR_OFFSET_Y = 12;
const SPRITE_SRC = "/mini-beni/spritesheet.webp";

type MiniBeniNavAvatarStyle = CSSProperties & {
  "--mini-beni-nav-width": string;
  "--mini-beni-nav-height": string;
  "--mini-beni-nav-offset-x": string;
  "--mini-beni-nav-offset-y": string;
  "--mini-beni-frame-x": string;
  "--mini-beni-frame-y": string;
  "--mini-beni-sprite": string;
};

function useReducedMotion(): boolean {
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

function useIdleFrame(reducedMotion: boolean): number {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setFrame(0);
      return;
    }

    const interval = window.setInterval(() => {
      setFrame((current) => (current + 1) % IDLE_FRAME_COUNT);
    }, IDLE_FRAME_DURATION);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return reducedMotion ? 0 : frame;
}

export function MiniBeniNavAvatar() {
  const reducedMotion = useReducedMotion();
  const frame = useIdleFrame(reducedMotion);
  const height = NAV_AVATAR_HEIGHT;
  const width = (height * CELL_WIDTH) / CELL_HEIGHT;
  const style: MiniBeniNavAvatarStyle = {
    "--mini-beni-nav-width": `${width}px`,
    "--mini-beni-nav-height": `${height}px`,
    "--mini-beni-nav-offset-x": `${NAV_AVATAR_OFFSET_X}px`,
    "--mini-beni-nav-offset-y": `${NAV_AVATAR_OFFSET_Y}px`,
    "--mini-beni-frame-x": `${(frame / (ATLAS_COLUMNS - 1)) * 100}%`,
    "--mini-beni-frame-y": "0%",
    "--mini-beni-sprite": `url("${SPRITE_SRC}")`,
  };

  return (
    <span aria-hidden="true" className="mini-beni-nav-avatar" style={style} />
  );
}
