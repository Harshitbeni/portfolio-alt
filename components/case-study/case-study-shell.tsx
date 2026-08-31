import type { ReactNode } from "react";
import { CaseStudyHomeButton } from "@/components/case-study-home-button";
import type { CaseStudy } from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

export function CaseStudySectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-wide text-gray-a10 uppercase">
      {children}
    </p>
  );
}

export function CaseStudyShell({
  study,
  children,
}: {
  study: CaseStudy;
  children: ReactNode;
}) {
  return (
    <article className="w-full max-w-[600px] px-4">
      <header className="mb-10 flex flex-col gap-4">
        <CaseStudyHomeButton />
        <div className="flex flex-col gap-2">
          <h1 className="text-md-semibold text-gray-a12">{study.title}</h1>
          <p className="text-pretty text-md leading-6 text-gray-a11">
            {study.subtitle}
          </p>
        </div>
      </header>
      <div className="flex flex-col gap-14">{children}</div>
    </article>
  );
}

export function CaseStudySection({
  label,
  title,
  children,
  className,
}: {
  label?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      {label ? <CaseStudySectionLabel>{label}</CaseStudySectionLabel> : null}
      {title ? (
        <h2 className="text-md-medium text-gray-a12">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

export const caseStudyLinkClassName =
  "text-gray-a12 underline decoration-gray-a8 [text-decoration-skip-ink:none] [text-decoration-thickness:10%] outline-none transition-[text-decoration-color] duration-200 ease-out hover:decoration-purple-a6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

export const caseStudyBodyClassName =
  "text-pretty text-md leading-6 text-gray-a11";

export const caseStudyMutedClassName = "text-sm leading-5 text-gray-a10";
