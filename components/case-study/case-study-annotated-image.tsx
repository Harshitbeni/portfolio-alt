"use client";

import Image from "next/image";
import type { BlockCaseStudyAnnotation } from "@/lib/case-studies/block-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CaseStudyAnnotatedImage({
  src,
  alt,
  width,
  height,
  annotations,
  className,
}: {
  src: string;
  alt?: string;
  width: number;
  height: number;
  annotations: BlockCaseStudyAnnotation[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt ?? ""}
        width={width}
        height={height}
        className="h-auto w-full rounded-sm border border-gray-a6"
        sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
      />
      {annotations.map((annotation) => (
        <Tooltip key={`${annotation.number}-${annotation.x}-${annotation.y}`} instant>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={annotation.text}
              className="absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-9 text-xs font-semibold text-white shadow-[0_6px_12px_-2px_rgba(238,30,52,0.32)] outline-none transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
              }}
            >
              {annotation.number}
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-center">
            {annotation.text}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
