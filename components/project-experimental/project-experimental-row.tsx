"use client";

import type { MouseEvent, Ref } from "react";
import { filledSlotIcons, type IconName } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

function RowIconBox({ name }: { name: IconName }) {
  const Icon = filledSlotIcons[name];

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[6px] border-[0.5px] border-gray-a6 bg-gray-9 text-gray-1">
      <Icon size={16} />
    </span>
  );
}

export function ProjectExperimentalRow({
  id,
  heading,
  body,
  icon,
  active,
  ref,
  onNavigate,
}: {
  id: string;
  heading: string;
  body: string;
  icon: IconName;
  active: boolean;
  ref?: Ref<HTMLAnchorElement>;
  onNavigate?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      id={id}
      href={`#${id}`}
      ref={ref}
      onClick={onNavigate}
      className={cn(
        "flex cursor-pointer flex-col gap-4 pb-6 outline-none",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "motion-safe:transition-opacity motion-safe:duration-200",
        active ? "opacity-100" : "opacity-50",
      )}
    >
      <div className="flex items-center gap-2">
        <RowIconBox name={icon} />
        <h2 className="text-md-medium text-gray-12">{heading}</h2>
      </div>
      <p className="text-md leading-6 text-gray-11">{body}</p>
      <div className="h-px bg-gray-4" />
    </a>
  );
}
