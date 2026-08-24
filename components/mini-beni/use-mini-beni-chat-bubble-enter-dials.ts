import type { CSSProperties } from "react";

/** Current enter slide: 100% of bubble height (from behind the input). */
export const MINI_BENI_CHAT_BUBBLE_ENTER_Y = 100;

export type MiniBeniChatBubbleEnterStyle = CSSProperties & {
  "--mini-beni-chat-bubble-enter-y": string;
  "--mini-beni-chat-bubble-enter-blur": string;
  "--mini-beni-chat-bubble-enter-scale": string;
};

const MINI_BENI_CHAT_BUBBLE_ENTER = {
  y: MINI_BENI_CHAT_BUBBLE_ENTER_Y,
  blur: 0,
  scale: 0,
} as const;

/**
 * Enter animation for Mini Beni chat bubbles.
 *
 * - y: initial `translateY` as a % of bubble height (default 100)
 * - blur: initial blur in px (default 0)
 * - scale: 0 = identity (no scale change). When > 0 (0–1), start at `1 - scale`
 *   and animate up to 1
 */
export function getMiniBeniChatBubbleEnterStyle(): MiniBeniChatBubbleEnterStyle {
  const { y, blur, scale } = MINI_BENI_CHAT_BUBBLE_ENTER;

  return {
    "--mini-beni-chat-bubble-enter-y": `${y}%`,
    "--mini-beni-chat-bubble-enter-blur": `${blur}px`,
    "--mini-beni-chat-bubble-enter-scale": String(scale > 0 ? 1 - scale : 1),
  };
}
