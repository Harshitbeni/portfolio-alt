"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AvatarPerson } from "@/components/ui/avatar";
import { ProjectExperimentalRow } from "@/components/project-experimental/project-experimental-row";
import { ProjectExperimentalVisual } from "@/components/project-experimental/project-experimental-visual";
import { useMobileStackActive } from "@/components/home-tabs/use-mobile-stack-active";
import { useIcon } from "@/lib/icon-context";
import {
  projectExperimentalRows,
  projectExperimentalSections,
  projectExperimentalTeam,
  projectExperimentalTitle,
} from "@/lib/project-experimental";

const LG_BREAKPOINT = 1024;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function highlightYFor(isMobile: boolean, visualEl: HTMLElement | null) {
  if (isMobile) {
    return visualEl?.getBoundingClientRect().bottom ?? window.innerHeight * 0.5;
  }
  return window.innerHeight * 0.25;
}

function rowIndexForHash(hash: string) {
  const byRow = projectExperimentalRows.findIndex((row) => row.id === hash);
  if (byRow >= 0) return byRow;

  const section = projectExperimentalSections.find((item) => item.id === hash);
  if (!section) return -1;

  return projectExperimentalRows.findIndex(
    (row) => row.section === section.label,
  );
}

export function ProjectExperimentalSplit() {
  const ArrowLeft = useIcon("arrow-left");
  const isMobile = useMobileStackActive(true, LG_BREAKPOINT);
  const mobileVisualRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollRowToHighlight = useCallback(
    (index: number) => {
      const row = rowRefs.current[index];
      if (!row) return;

      const highlightY = highlightYFor(isMobile, mobileVisualRef.current);
      const delta = row.getBoundingClientRect().top - highlightY + 1;
      const behavior = prefersReducedMotion() ? "instant" : "smooth";

      if (isMobile) {
        textColumnRef.current?.scrollBy({ top: delta, behavior });
      } else {
        window.scrollBy({ top: delta, behavior });
      }
    },
    [isMobile],
  );

  useEffect(() => {
    const update = () => {
      const highlightY = highlightYFor(isMobile, mobileVisualRef.current);
      let next = 0;
      rowRefs.current.forEach((el, index) => {
        if (!el) return;
        if (el.getBoundingClientRect().top <= highlightY + 1) {
          next = index;
        }
      });
      setActiveIndex(next);
    };

    update();
    const scrollTarget: HTMLElement | Window | null = isMobile
      ? textColumnRef.current
      : window;
    scrollTarget?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scrollTarget?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isMobile]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const index = rowIndexForHash(hash);
    if (index < 0) return;
    const frame = requestAnimationFrame(() => {
      scrollRowToHighlight(index);
    });
    return () => cancelAnimationFrame(frame);
  }, [isMobile, scrollRowToHighlight]);

  const displayNumber = activeIndex + 1;
  const activeRowId = projectExperimentalRows[activeIndex]?.id ?? "";

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-background lg:h-auto lg:min-h-full lg:flex-1 lg:flex-row lg:overflow-visible">
      <div
        ref={mobileVisualRef}
        className="h-1/2 shrink-0 bg-background p-4 lg:hidden"
      >
        <ProjectExperimentalVisual number={displayNumber} rowId={activeRowId} />
      </div>

      <div
        ref={textColumnRef}
        className="flex min-h-0 w-full flex-1 flex-col gap-6 overflow-y-auto p-4 lg:max-w-[600px] lg:flex-none lg:overflow-visible lg:pb-[80svh]"
      >
        <Link
          href="/?tab=work"
          className="inline-flex w-fit items-center gap-3 text-sm font-medium text-gray-10 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          <ArrowLeft size={16} />
          Home
        </Link>

        <div className="flex flex-col gap-4 pb-6">
          <h1 className="text-xl font-semibold leading-7 text-gray-12">
            {projectExperimentalTitle}
          </h1>

          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-gray-10">Team</p>
            <div className="flex flex-col gap-1">
              {projectExperimentalTeam.map((member) => (
                <AvatarPerson
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  src={member.image}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-4" />
        </div>

        {projectExperimentalRows.map((row, index) => (
          <Fragment key={row.id}>
            {row.section ? (
              <p className="text-xs font-medium text-gray-10">{row.section}</p>
            ) : null}
            <ProjectExperimentalRow
              id={row.id}
              heading={row.heading}
              body={row.body}
              icon={row.icon}
              active={index === activeIndex}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              onNavigate={(event) => {
                event.preventDefault();
                const hash = `#${row.id}`;
                if (window.location.hash !== hash) {
                  history.pushState(null, "", hash);
                }
                scrollRowToHighlight(index);
              }}
            />
          </Fragment>
        ))}

        <div
          aria-hidden
          className="min-h-[calc(50svh-8rem)] shrink-0 lg:hidden"
        />
      </div>

      <div className="sticky top-0 hidden h-svh flex-1 p-4 lg:flex">
        <ProjectExperimentalVisual number={displayNumber} rowId={activeRowId} />
      </div>
    </div>
  );
}
