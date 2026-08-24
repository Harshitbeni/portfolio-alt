"use client";

import type { CSSProperties } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BOOK_RATING_DEFAULT_DOT_SIZE = 8;
const BOOK_RATING_DEFAULT_HOVER_GRAY = "9";

type RatingCircle = "full" | "half";

type BookRatingStyle = CSSProperties & {
  "--book-rating-dot-size": string;
  "--book-rating-hover-color": string;
};

function ratingCircles(value: number): RatingCircle[] {
  const normalized = Math.min(Math.max(value, 0), 5);
  const fullCount = Math.floor(normalized);
  const hasHalf = normalized % 1 >= 0.5;

  const circles: RatingCircle[] = Array.from({ length: fullCount }, () => "full");
  if (hasHalf) circles.push("half");
  return circles;
}

function formatBookRatingLabel(value: number): string {
  const normalized = Math.min(Math.max(value, 0), 5);
  return `Rating: ${normalized}/5`;
}

function HalfRatingCircle({ dotSize }: { dotSize: number }) {
  return (
    <svg
      aria-hidden
      className="shrink-0 text-gray-7 transition-colors group-hover:text-[var(--book-rating-hover-color)]"
      width={dotSize}
      height={dotSize}
      viewBox="0 0 10 10"
      fill="none"
    >
      <path
        d="M5 10C3.67392 10 2.40215 9.47322 1.46447 8.53553C0.526784 7.59785 -3.68891e-08 6.32608 0 5C3.68891e-08 3.67392 0.526784 2.40215 1.46447 1.46447C2.40215 0.526784 3.67392 -1.58134e-08 5 0L5 5L5 10Z"
        fill="currentColor"
      />
      <rect
        x="0.25"
        y="0.25"
        width="9.5"
        height="9.5"
        rx="4.75"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
}

export function BookRating({
  value,
  dotSize = BOOK_RATING_DEFAULT_DOT_SIZE,
  hoverGray = BOOK_RATING_DEFAULT_HOVER_GRAY,
}: {
  value: number;
  dotSize?: number;
  hoverGray?: string;
}) {
  const circles = ratingCircles(value);
  const ratingLabel = formatBookRatingLabel(value);

  if (circles.length === 0) return null;

  const style: BookRatingStyle = {
    "--book-rating-dot-size": `${dotSize}px`,
    "--book-rating-hover-color": `var(--gray-${hoverGray})`,
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-label={ratingLabel}
          className="flex shrink-0 items-center gap-1"
          role="img"
          style={style}
        >
          {circles.map((kind, index) =>
            kind === "full" ? (
              <span
                key={index}
                aria-hidden
                className="size-[var(--book-rating-dot-size)] shrink-0 rounded-full bg-gray-7 transition-colors group-hover:bg-[var(--book-rating-hover-color)]"
              />
            ) : (
              <HalfRatingCircle key={index} dotSize={dotSize} />
            ),
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>{ratingLabel}</TooltipContent>
    </Tooltip>
  );
}
