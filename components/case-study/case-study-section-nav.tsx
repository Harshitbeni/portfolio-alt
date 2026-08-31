"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Section = {
  id: string;
  label: string;
};

export function CaseStudySectionNav({
  sections,
  showDesktopList = false,
}: {
  sections: Section[];
  showDesktopList?: boolean;
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const compactNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const visibleSections = new Map<string, number>();
    const lastSectionId = sections[sections.length - 1]?.id;

    const selectLastSectionIfVisible = () => {
      const lastSection = lastSectionId
        ? document.getElementById(lastSectionId)
        : null;
      const lastSectionRect = lastSection?.getBoundingClientRect();
      const isLastSectionVisible =
        lastSectionRect &&
        lastSectionRect.top <= window.innerHeight * 0.8 &&
        lastSectionRect.bottom > 0;

      if (!isLastSectionVisible) return false;

      setActiveId(lastSectionId ?? "");
      return true;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        if (selectLastSectionIfVisible()) return;

        let bestId = sections[0]?.id ?? "";
        let bestRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        rootMargin: "-10% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener("scroll", selectLastSectionIfVisible, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", selectLastSectionIfVisible);
    };
  }, [sections]);

  useEffect(() => {
    if (!showDesktopList) return;

    const nav = compactNavRef.current;
    const activeButton = nav?.querySelector<HTMLElement>(
      `[data-section-id="${activeId}"]`,
    );

    if (!nav || !activeButton) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const centeredLeft =
      activeButton.offsetLeft - nav.clientWidth / 2 + activeButton.clientWidth / 2;

    nav.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }, [activeId, showDesktopList]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    element.scrollIntoView({
      behavior: reduceMotion ? "instant" : "smooth",
      block: "start",
    });
    setActiveId(id);
  };

  return (
    <>
      {showDesktopList ? (
        <nav
          aria-label="Case study sections"
          className="fixed start-10 top-44 z-10 hidden w-[120px] flex-col gap-2 min-[1024px]:flex"
        >
          {sections.map(({ id, label }) => {
            const isActive = activeId === id;

            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  handleClick(id);
                }}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative w-fit rounded-sm text-md leading-6 outline-none transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                  isActive
                    ? "text-gray-a10 before:absolute before:-start-4 before:top-1/2 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-gray-a8"
                    : "text-gray-a10 hover:text-gray-a12",
                )}
              >
                {label}
              </a>
            );
          })}
        </nav>
      ) : null}

      <nav
        ref={compactNavRef}
        aria-label="Case study sections"
        className={cn(
          "sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-2.5 backdrop-blur-[8px] supports-[backdrop-filter]:bg-background/80",
          showDesktopList && "hidden",
        )}
      >
        <div className={cn("flex gap-2", showDesktopList && "w-max pr-4")}>
          {sections.map(({ id, label }) => {
            const isActive = activeId === id;

            return (
              <button
                key={id}
                data-section-id={id}
                type="button"
                onClick={() => handleClick(id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "shrink-0 rounded-[24px] px-2.5 py-1 text-xxs leading-4 transition-[background-color,color,box-shadow]",
                  "shadow-[0_0_0_1px_var(--tabs-stroke)]",
                  isActive
                    ? "bg-white text-gray-12 shadow-3 dark:bg-gray-2"
                    : "bg-gray-1 text-gray-10 hover:bg-[var(--tabs-hover)] hover:text-gray-12",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
