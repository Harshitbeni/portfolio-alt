import type { ComponentType } from "react";
import { CurrentExperienceIllustration } from "@/components/project-experimental/illustrations/current-experience";
import { WhatIsPrivadoIllustration } from "@/components/project-experimental/illustrations/what-is-privado";
import { WhatsTheGapIllustration } from "@/components/project-experimental/illustrations/whats-the-gap";
import { WhosTheUserIllustration } from "@/components/project-experimental/illustrations/whos-the-user";
import { projectExperimentalIllustrationAlts } from "@/lib/project-experimental";
import { cn } from "@/lib/utils";

const illustrations: Record<
  string,
  ComponentType<{ label: string }>
> = {
  "what-is-privado": WhatIsPrivadoIllustration,
  "whats-the-gap": WhatsTheGapIllustration,
  "whos-the-user": WhosTheUserIllustration,
  "current-experience": CurrentExperienceIllustration,
};

export function ProjectExperimentalVisual({
  number,
  rowId,
  className,
}: {
  number: number;
  rowId: string;
  className?: string;
}) {
  const Illustration = illustrations[rowId];
  const label = projectExperimentalIllustrationAlts[rowId];

  return (
    <div
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden rounded-[12px] bg-gray-3",
        className,
      )}
    >
      {Illustration && label ? (
        <Illustration label={label} />
      ) : (
        <p aria-live="polite" className="text-xl tabular-nums text-gray-11">
          {number}
        </p>
      )}
    </div>
  );
}
