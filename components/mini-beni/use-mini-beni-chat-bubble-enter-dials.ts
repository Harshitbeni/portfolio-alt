"use client";

import { useDialKit } from "dialkit";
import type { CSSProperties } from "react";

/** Current enter slide: 100% of bubble height (from behind the input). */
export const MINI_BENI_CHAT_BUBBLE_ENTER_Y = 100;

export type MiniBeniChatBubbleEnterStyle = CSSProperties & {
  "--mini-beni-chat-bubble-enter-y": string;
  "--mini-beni-chat-bubble-enter-blur": string;
  "--mini-beni-chat-bubble-enter-scale": string;
};

/**
 * DialKit knobs for Mini Beni chat bubble enter.
 *
 * - y: initial `translateY` as a % of bubble height (default 100)
 * - blur: initial blur in px (default 0)
 * - scale: 0 = identity (no scale change). When > 0 (0–1), start at `1 - scale`
 *   and animate up to 1
 */
export function useMiniBeniChatBubbleEnterDials() {
  return useDialKit(
    "Mini Beni Chat Bubble Enter",
    {
      y: [MINI_BENI_CHAT_BUBBLE_ENTER_Y, 0, 200, 1],
      blur: [0, 0, 100, 1],
      scale: [0, 0, 1, 0.01],
    },
    { id: "mini-beni-chat-bubble-enter" },
  );
}

export function getMiniBeniChatBubbleEnterStyle(enter: {
  y: number;
  blur: number;
  scale: number;
}): MiniBeniChatBubbleEnterStyle {
  return {
    "--mini-beni-chat-bubble-enter-y": `${enter.y}%`,
    "--mini-beni-chat-bubble-enter-blur": `${enter.blur}px`,
    "--mini-beni-chat-bubble-enter-scale": String(
      enter.scale > 0 ? 1 - enter.scale : 1,
    ),
  };
}
