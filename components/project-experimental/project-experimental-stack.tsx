"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AvatarPerson } from "@/components/ui/avatar";
import { useMobileStackActive } from "@/components/home-tabs/use-mobile-stack-active";
import { ProjectExperimentalVisual } from "@/components/project-experimental/project-experimental-visual";
import { WorkMediaCarousel } from "@/components/work-media-carousel";
import { useIcon } from "@/lib/icon-context";
import {
  projectExperimentalHeroMedia,
  projectExperimentalRows,
  projectExperimentalSections,
  projectExperimentalTeam,
  projectExperimentalTitle,
  type ProjectExperimentalRow,
} from "@/lib/project-experimental";
import { cn } from "@/lib/utils";

const TOC_WIDTH = "w-[104px]";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function groupedRows() {
  const groups: { id: string; rows: ProjectExperimentalRow[] }[] = [];

  for (const row of projectExperimentalRows) {
    if (row.section) {
      const section = projectExperimentalSections.find(
        (item) => item.label === row.section,
      );
      groups.push({
        id: section?.id ?? row.section.toLowerCase(),
        rows: [row],
      });
      continue;
    }

    groups[groups.length - 1]?.rows.push(row);
  }

  return groups;
}

const groups = groupedRows();

function scrollToId(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  const top = window.scrollY + element.getBoundingClientRect().top - 16;
  window.scrollTo({
    top: Math.max(0, top),
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}

const tocItemClassName = cn(
  "inline-flex shrink-0 items-center gap-3 text-xs leading-[18px] text-gray-10 outline-none",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
);

function TocLinks({
  activeId,
  onSectionSelect,
  showHomeIcon,
}: {
  activeId: string;
  onSectionSelect: (id: string) => void;
  showHomeIcon: boolean;
}) {
  const ArrowUndoUp = useIcon("arrow-undo-up");

  return (
    <>
      <Link href="/?tab=work" className={cn(tocItemClassName, "pb-3")}>
        {showHomeIcon ? (
          <ArrowUndoUp size={16} />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
        Home
      </Link>
      {projectExperimentalSections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={isActive ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onSectionSelect(section.id);
            }}
            className={cn(tocItemClassName, isActive && "text-gray-12")}
          >
            <span className="size-4 shrink-0" aria-hidden />
            {section.label}
          </a>
        );
      })}
    </>
  );
}

export function ProjectExperimentalStack() {
  const isMobile = useMobileStackActive(true, 1024);
  const [activeId, setActiveId] = useState(
    projectExperimentalSections[0]?.id ?? "",
  );
  const mobileNavRef = useRef<HTMLElement>(null);

  const selectSection = useCallback((id: string) => {
    const hash = `#${id}`;
    if (window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }
    setActiveId(id);
    scrollToId(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const highlightY = isDesktop
        ? 16
        : (mobileNavRef.current?.getBoundingClientRect().bottom ?? 16);
      let next = projectExperimentalSections[0]?.id ?? "";

      for (const section of projectExperimentalSections) {
        const element = document.getElementById(section.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= highlightY + 1) {
          next = section.id;
        }
      }

      setActiveId(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      scrollToId(hash);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="bg-background px-4 pb-12 pt-4 sm:pt-[120px]">
      <nav
        ref={mobileNavRef}
        aria-label="Sections"
        className="sticky top-0 z-20 -mx-4 mb-4 flex gap-4 overflow-x-auto bg-background px-4 py-2 lg:hidden"
      >
        <TocLinks
          activeId={activeId}
          onSectionSelect={selectSection}
          showHomeIcon={isMobile}
        />
      </nav>

      <div className="mx-auto flex w-full max-w-[600px] flex-col lg:max-w-none lg:flex-row lg:justify-center lg:gap-8">
        <nav
          aria-label="Sections"
          className={cn(
            "sticky top-4 hidden shrink-0 flex-col gap-2 self-start pb-4 lg:flex",
            TOC_WIDTH,
          )}
        >
          <TocLinks
            activeId={activeId}
            onSectionSelect={selectSection}
            showHomeIcon={!isMobile}
          />
        </nav>

        <article className="flex w-full max-w-[600px] flex-col gap-6">
          <WorkMediaCarousel
            heading={projectExperimentalTitle}
            items={projectExperimentalHeroMedia}
            layout="stack"
            className="py-0"
          />

          <div className="flex flex-col gap-4">
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

          {groups.map((group) => (
            <section key={group.id} id={group.id} className="flex flex-col gap-6">
              {group.rows.map((row) => {
                const number =
                  projectExperimentalRows.findIndex((item) => item.id === row.id) +
                  1;

                return (
                  <div
                    key={row.id}
                    id={row.id === group.id ? undefined : row.id}
                    className="flex flex-col gap-4 pb-6"
                  >
                    <div className="h-[360px] w-full">
                      <ProjectExperimentalVisual
                        number={number}
                        rowId={row.id}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h2 className="text-md-medium text-gray-12">
                        {row.heading}
                      </h2>
                      <p className="text-md leading-6 text-gray-11">
                        {row.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </article>

        <div
          aria-hidden
          className={cn("hidden shrink-0 lg:block", TOC_WIDTH)}
        />
      </div>
    </div>
  );
}
