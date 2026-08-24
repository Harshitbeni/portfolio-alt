import type { CSSProperties } from "react";

export const MINI_BENI_TYPING_REPLY_DELAY_MS = 2000;

export type MiniBeniTypingIndicatorStyle = CSSProperties & {
  "--mini-beni-typing-bubble-height": string;
  "--mini-beni-typing-padding-x": string;
  "--mini-beni-typing-dot-size": string;
  "--mini-beni-typing-dot-gap": string;
  "--mini-beni-typing-dot-active-scale": string;
  "--mini-beni-typing-dot-inactive-opacity": string;
  "--mini-beni-typing-cycle-duration": string;
  "--mini-beni-typing-dot-stagger-overlap": string;
  "--mini-beni-typing-tail-large-size": string;
  "--mini-beni-typing-tail-small-size": string;
  "--mini-beni-typing-tail-gap": string;
  "--mini-beni-typing-tail-offset-x": string;
  "--mini-beni-typing-tail-offset-y": string;
  "--mini-beni-typing-breath-min-scale": string;
  "--mini-beni-typing-breath-max-scale": string;
  "--mini-beni-typing-breath-duration": string;
};

const MINI_BENI_TYPING_INDICATOR = {
  bubbleHeight: 28,
  paddingX: 12,
  dotSize: 6,
  dotGap: 4,
  dotActiveScale: 1,
  dotInactiveOpacity: 0.45,
  cycleDurationMs: 2000,
  dotStaggerOverlap: 0.6,
  tailLargeSize: 10,
  tailSmallSize: 6,
  tailGap: 0,
  tailOffsetX: 0,
  tailOffsetY: 8,
  breathMinScale: 1,
  breathMaxScale: 1.05,
  breathDurationMs: 2000,
} as const;

/**
 * Layout and animation values for the Mini Beni typing indicator.
 *
 * `MINI_BENI_TYPING_REPLY_DELAY_MS` is the minimum time the indicator stays
 * visible while awaiting a Beni reply.
 */
export function getMiniBeniTypingIndicatorStyle(): MiniBeniTypingIndicatorStyle {
  return {
    "--mini-beni-typing-bubble-height": `${MINI_BENI_TYPING_INDICATOR.bubbleHeight}px`,
    "--mini-beni-typing-padding-x": `${MINI_BENI_TYPING_INDICATOR.paddingX}px`,
    "--mini-beni-typing-dot-size": `${MINI_BENI_TYPING_INDICATOR.dotSize}px`,
    "--mini-beni-typing-dot-gap": `${MINI_BENI_TYPING_INDICATOR.dotGap}px`,
    "--mini-beni-typing-dot-active-scale": String(
      MINI_BENI_TYPING_INDICATOR.dotActiveScale,
    ),
    "--mini-beni-typing-dot-inactive-opacity": String(
      MINI_BENI_TYPING_INDICATOR.dotInactiveOpacity,
    ),
    "--mini-beni-typing-cycle-duration": `${MINI_BENI_TYPING_INDICATOR.cycleDurationMs}ms`,
    "--mini-beni-typing-dot-stagger-overlap": String(
      MINI_BENI_TYPING_INDICATOR.dotStaggerOverlap,
    ),
    "--mini-beni-typing-tail-large-size": `${MINI_BENI_TYPING_INDICATOR.tailLargeSize}px`,
    "--mini-beni-typing-tail-small-size": `${MINI_BENI_TYPING_INDICATOR.tailSmallSize}px`,
    "--mini-beni-typing-tail-gap": `${MINI_BENI_TYPING_INDICATOR.tailGap}px`,
    "--mini-beni-typing-tail-offset-x": `${MINI_BENI_TYPING_INDICATOR.tailOffsetX}px`,
    "--mini-beni-typing-tail-offset-y": `${MINI_BENI_TYPING_INDICATOR.tailOffsetY}px`,
    "--mini-beni-typing-breath-min-scale": String(
      MINI_BENI_TYPING_INDICATOR.breathMinScale,
    ),
    "--mini-beni-typing-breath-max-scale": String(
      MINI_BENI_TYPING_INDICATOR.breathMaxScale,
    ),
    "--mini-beni-typing-breath-duration": `${MINI_BENI_TYPING_INDICATOR.breathDurationMs}ms`,
  };
}
