"use client";

import { cn } from "@/lib/utils";

export type ProjectExperimentalLayout = "split" | "stack";

function SplitGlyph({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="5" y="4" width="5" height="16" rx="1" fill="currentColor" />
        <rect x="14" y="4" width="5" height="16" rx="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5.75"
        y="4.75"
        width="4.5"
        height="14.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="13.75"
        y="4.75"
        width="4.5"
        height="14.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function StackGlyph({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
        <rect x="4" y="5" width="16" height="5" rx="1" fill="currentColor" />
        <rect x="4" y="14" width="16" height="5" rx="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.75"
        y="5.75"
        width="14.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="4.75"
        y="13.75"
        width="14.5"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const radioClassName =
  "flex size-6 shrink-0 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export function ProjectExperimentalLayoutSwitcher({
  layout,
  onLayoutChange,
}: {
  layout: ProjectExperimentalLayout;
  onLayoutChange: (layout: ProjectExperimentalLayout) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Layout"
      className="fixed bottom-4 left-4 z-40 flex gap-2 rounded-[40px] bg-gray-1 p-2 shadow-2"
    >
      <button
        type="button"
        role="radio"
        aria-checked={layout === "split"}
        aria-label="Split"
        className={cn(
          radioClassName,
          layout === "split" ? "text-gray-12" : "text-gray-8",
        )}
        onClick={() => onLayoutChange("split")}
      >
        <SplitGlyph filled={layout === "split"} />
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={layout === "stack"}
        aria-label="Stack"
        className={cn(
          radioClassName,
          layout === "stack" ? "text-gray-12" : "text-gray-8",
        )}
        onClick={() => onLayoutChange("stack")}
      >
        <StackGlyph filled={layout === "stack"} />
      </button>
    </div>
  );
}
