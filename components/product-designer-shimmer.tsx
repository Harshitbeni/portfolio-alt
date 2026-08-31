"use client";

import { useDialKit } from "dialkit";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";

const TEXT = "⌘ Product Designer";
const KEYFRAMES_NAME = "product-designer-shimmer-sweep";
const INITIAL_SHIMMER_DELAY_MS = 500;

export function ProductDesignerShimmer() {
  const ref = useRef<HTMLElement>(null);

  const params = useDialKit(
    "Product Designer Shimmer",
    {
      speed: [500, 100, 8000, 50],
      gap: [2000, 0, 10000, 50],
      loadAndHoverOnly: true,
      band: [400, 200, 800, 10],
      timing: {
        type: "select",
        options: [
          { value: "linear", label: "Linear" },
          { value: "ease-in-out", label: "Ease in-out" },
          { value: "ease-in", label: "Ease in" },
          { value: "ease-out", label: "Ease out" },
          {
            value: "cubic-bezier(0.22, 1, 0.36, 1)",
            label: "Smooth",
          },
          {
            value: "cubic-bezier(0.34, 1.45, 0.64, 1)",
            label: "Bouncy",
          },
        ],
        default: "linear",
      },
      colors: {
        color1: { type: "color", default: "#e5484d" },
        color2: { type: "color", default: "#6e56cf" },
        color3: { type: "color", default: "#0090ff" },
      },
    },
    {
      id: "product-designer-shimmer",
      persist: true,
    },
  );

  const sweepMs = params.speed;
  const gapMs = params.gap;
  const totalMs = params.loadAndHoverOnly ? sweepMs : sweepMs + gapMs;
  const sweepPercent = params.loadAndHoverOnly
    ? 100
    : (sweepMs / totalMs) * 100;

  const keyframesCss = useMemo(
    () =>
      `@keyframes ${KEYFRAMES_NAME} {
        0% { background-position: 100% 0; }
        ${sweepPercent}% { background-position: 0% 0; }
        100% { background-position: 0% 0; }
      }`,
    [sweepPercent],
  );

  const replayShimmer = useCallback(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.classList.remove("is-shimmer-replay");
    void el.offsetWidth;
    el.classList.add("is-shimmer-replay");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    if (params.loadAndHoverOnly) {
      el.removeAttribute("data-shimmer-continuous");
      const timer = window.setTimeout(replayShimmer, INITIAL_SHIMMER_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    el.classList.remove("is-shimmer-replay");
    el.setAttribute("data-shimmer-continuous", "");
  }, [params.loadAndHoverOnly, replayShimmer]);

  const style = {
    "--shimmer-band": `${params.band}%`,
    "--shimmer-ease": params.timing,
    "--shimmer-base": "var(--gray-12)",
    "--shimmer-color-1": params.colors.color1,
    "--shimmer-color-2": params.colors.color2,
    "--shimmer-color-3": params.colors.color3,
    "--shimmer-sweep-dur": `${sweepMs}ms`,
    "--shimmer-cycle-dur": `${totalMs}ms`,
    "--shimmer-gap": `${gapMs}ms`,
    "--shimmer-keyframes": KEYFRAMES_NAME,
  } as CSSProperties;

  return (
    <>
      <style>{keyframesCss}</style>
      <strong
        ref={ref}
        className="t-shimmer t-shimmer-product-designer font-normal"
        data-text={TEXT}
        data-shimmer-continuous={params.loadAndHoverOnly ? undefined : ""}
        onMouseEnter={params.loadAndHoverOnly ? replayShimmer : undefined}
        style={style}
      >
        {TEXT}
      </strong>
    </>
  );
}
