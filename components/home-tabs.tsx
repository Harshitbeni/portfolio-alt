"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BooksPanel } from "@/components/books-panel";
import { MusicPanel } from "@/components/music-panel";
import { ObjectsPanel } from "@/components/objects-panel";
import { PlayPanel } from "@/components/play-panel";
import { StackPanel } from "@/components/stack-panel";
import { WorkRow } from "@/components/work-row";
import {
  prefetchMusicLibrary,
  prefetchNowPlaying,
  seedMusicCache,
} from "@/lib/music-client-cache";
import type { MusicSection } from "@/lib/music";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { WORK_ITEMS } from "@/lib/work";

const HOME_TABS_TRANSITION_DURATION = 160;
const PLAY_ROW_FADE_HEIGHT = 32;

const HOME_TABS = [
  { value: "work", label: "Work" },
  { value: "play", label: "Play" },
  { value: "apps", label: "Apps" },
  { value: "others", label: "Others" },
] as const;

type HomeTab = (typeof HOME_TABS)[number]["value"];

const OTHER_TABS = [
  { value: "books", label: "Books" },
  { value: "music", label: "Music" },
  { value: "stack", label: "Stack" },
  { value: "objects", label: "Objects" },
] as const;

type OtherTab = (typeof OTHER_TABS)[number]["value"];

function isHomeTab(value: string | null): value is HomeTab {
  return HOME_TABS.some((item) => item.value === value);
}

function isOtherTab(value: string | null): value is OtherTab {
  return OTHER_TABS.some((item) => item.value === value);
}

function homeTabFromParam(value: string | null): HomeTab {
  if (isOtherTab(value)) return "others";
  if (isHomeTab(value) && value !== "others") return value;
  return HOME_TABS[0].value;
}

function tabParamForSelection(
  tab: HomeTab,
  otherTab: OtherTab,
): Exclude<HomeTab, "others"> | OtherTab | null {
  switch (tab) {
    case "work":
      return null;
    case "play":
    case "apps":
      return tab;
    case "others":
      return otherTab;
    default: {
      const exhaustive: never = tab;
      return exhaustive;
    }
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollPageToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}

function pageSlideDurationMs(
  slider: HTMLElement | null,
  fallback: number,
) {
  if (prefersReducedMotion()) return 0;
  if (!slider) return fallback;

  const raw = getComputedStyle(slider).getPropertyValue("--page-slide-dur").trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function OtherTabPanelContent({ tab }: { tab: OtherTab }) {
  switch (tab) {
    case "books":
      return <BooksPanel />;
    case "music":
      return <MusicPanel />;
    case "stack":
      return <StackPanel />;
    case "objects":
      return <ObjectsPanel />;
    default: {
      const exhaustive: never = tab;
      return exhaustive;
    }
  }
}

function OtherTabPanels({ activeTab }: { activeTab: OtherTab }) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<OtherTab[]>([activeTab]);
  const [renderedTab, setRenderedTab] = useState<OtherTab>(activeTab);
  const [flowTab, setFlowTab] = useState<OtherTab>(activeTab);
  const [exitEnabled, setExitEnabled] = useState(false);
  const renderedIndex = OTHER_TABS.findIndex((item) => item.value === renderedTab);
  const renderedPage = String(renderedIndex + 1);

  if (!visibleTabs.includes(activeTab)) {
    setVisibleTabs([...visibleTabs, activeTab]);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => setExitEnabled(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!visibleTabs.includes(activeTab) || renderedTab === activeTab) return;

    const frame = requestAnimationFrame(() => {
      setRenderedTab(activeTab);
      setFlowTab(activeTab);
    });

    return () => cancelAnimationFrame(frame);
  }, [activeTab, renderedTab, visibleTabs]);

  useEffect(() => {
    if (renderedTab !== activeTab) return;
    if (visibleTabs.length === 1 && visibleTabs[0] === activeTab) {
      setFlowTab(activeTab);
      return;
    }

    const timeout = window.setTimeout(() => {
      setVisibleTabs([activeTab]);
      setFlowTab(activeTab);
    }, pageSlideDurationMs(slideRef.current, HOME_TABS_TRANSITION_DURATION));

    return () => window.clearTimeout(timeout);
  }, [activeTab, renderedTab, visibleTabs]);

  return (
    <div
      className={`t-page-slide w-full${visibleTabs.length > 1 ? " is-sliding" : ""}`}
      data-page={renderedPage}
      ref={slideRef}
      style={
        {
          "--page-slide-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
          "--page-fade-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
          "--page-exit-enabled": exitEnabled ? "1" : "0",
        } as CSSProperties
      }
    >
      {OTHER_TABS.map((item, index) => {
        if (!visibleTabs.includes(item.value)) return null;

        const isRendered = item.value === renderedTab;
        const isFlow = item.value === flowTab;
        const side =
          index < renderedIndex
            ? "before"
            : index > renderedIndex
              ? "after"
              : undefined;

        return (
          <section
            key={item.value}
            aria-hidden={!isRendered}
            className="t-page flex-none p-0"
            data-active={isRendered ? "true" : undefined}
            data-flow={isFlow ? "true" : undefined}
            data-page-id={String(index + 1)}
            data-side={side}
            inert={isRendered ? undefined : true}
          >
            <OtherTabPanelContent tab={item.value} />
          </section>
        );
      })}
    </div>
  );
}

function HomeTabPanel({
  value,
  otherTab,
  playFadeHeight,
  mediaActive,
}: {
  value: HomeTab;
  otherTab: OtherTab;
  playFadeHeight: number;
  mediaActive: boolean;
}) {
  switch (value) {
    case "work":
      return (
        <div className="flex w-full flex-col gap-12">
          {WORK_ITEMS.map(({ id, ...item }) => (
            <WorkRow key={id} {...item} />
          ))}
        </div>
      );
    case "play":
      return (
        <PlayPanel fadeHeight={playFadeHeight} mediaActive={mediaActive} />
      );
    case "apps":
      return null;
    case "others":
      return <OtherTabPanels activeTab={otherTab} />;
    default: {
      const exhaustive: never = value;
      return exhaustive;
    }
  }
}

export function HomeTabs({
  initialMusicSections = null,
  initialMusicTotalTracks,
}: {
  initialMusicSections?: MusicSection[] | null;
  initialMusicTotalTracks?: number;
}) {
  if (initialMusicSections?.length) {
    seedMusicCache(initialMusicSections, initialMusicTotalTracks);
  }

  useEffect(() => {
    void prefetchNowPlaying();
    void prefetchMusicLibrary();
  }, []);

  const scrollYRef = useRef(0);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const pendingTabParamRef = useRef<string | undefined>(undefined);
  const [tab, setTab] = useState<HomeTab>(() => homeTabFromParam(tabParam));
  const [visibleTabs, setVisibleTabs] = useState<HomeTab[]>(() => [
    homeTabFromParam(tabParam),
  ]);
  const [renderedTab, setRenderedTab] = useState<HomeTab>(() =>
    homeTabFromParam(tabParam),
  );
  const [flowTab, setFlowTab] = useState<HomeTab>(() =>
    homeTabFromParam(tabParam),
  );
  const [exitEnabled, setExitEnabled] = useState(false);
  const [otherTab, setOtherTab] = useState<OtherTab>(
    isOtherTab(tabParam) ? tabParam : OTHER_TABS[0].value,
  );
  const activeOtherTab = otherTab;
  const tabsListRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);
  const isFirstPaintRef = useRef(true);
  const renderedIndex = HOME_TABS.findIndex((item) => item.value === renderedTab);
  const renderedPage = String(renderedIndex + 1);

  const selectTab = useCallback(
    (nextTab: HomeTab, nextOtherTab: OtherTab = otherTab) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextTabParam = tabParamForSelection(nextTab, nextOtherTab);

      scrollYRef.current = window.scrollY;
      setTab(nextTab);
      setOtherTab(nextOtherTab);
      pendingTabParamRef.current = nextTabParam ?? "";

      if (nextTabParam === null) {
        params.delete("tab");
      } else {
        params.set("tab", nextTabParam);
      }

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      requestAnimationFrame(() => {
        router.replace(href, { scroll: false });
      });
    },
    [otherTab, pathname, router, searchParams],
  );

  useEffect(() => {
    const currentParam = tabParam ?? "";

    if (pendingTabParamRef.current !== undefined) {
      if (pendingTabParamRef.current === currentParam) {
        pendingTabParamRef.current = undefined;
      }
      return;
    }

    setTab(homeTabFromParam(tabParam));
    if (isOtherTab(tabParam)) {
      setOtherTab(tabParam);
    }
  }, [tabParam]);

  const movePill = useCallback((animate: boolean) => {
    const tabsList = tabsListRef.current;
    const pill = pillRef.current;
    const activeTab = tabsList?.querySelector<HTMLElement>(
      '[data-state="active"]',
    );
    if (!tabsList || !pill || !activeTab) return;

    if (!animate) {
      const previousTransition = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${activeTab.offsetLeft}px)`;
      pill.style.width = `${activeTab.offsetWidth}px`;
      void pill.offsetWidth;
      pill.style.transition = previousTransition;
      return;
    }

    pill.style.transform = `translateX(${activeTab.offsetLeft}px)`;
    pill.style.width = `${activeTab.offsetWidth}px`;
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
      movePill(hasMountedRef.current);
      hasMountedRef.current = true;
      setExitEnabled(true);
    });
    const handleResize = () => movePill(false);

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
    };
  }, [movePill, tab]);

  useEffect(() => {
    if (isFirstPaintRef.current) {
      isFirstPaintRef.current = false;
      return;
    }

    setVisibleTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]));
  }, [tab]);

  useEffect(() => {
    if (!visibleTabs.includes(tab) || renderedTab === tab) return;

    const frame = requestAnimationFrame(() => {
      setRenderedTab(tab);
      if (tab !== "play") {
        setFlowTab(tab);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [renderedTab, tab, visibleTabs]);

  useEffect(() => {
    if (renderedTab !== tab) return;
    if (visibleTabs.length === 1 && visibleTabs[0] === tab) {
      setFlowTab(tab);
      return;
    }

    const timeout = window.setTimeout(() => {
      setVisibleTabs([tab]);
      setFlowTab(tab);
    }, pageSlideDurationMs(slideRef.current, HOME_TABS_TRANSITION_DURATION));

    return () => window.clearTimeout(timeout);
  }, [renderedTab, tab, visibleTabs]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const nextTab = isHomeTab(value) ? value : HOME_TABS[0].value;
        selectTab(nextTab);
      }}
      className="w-full gap-12"
    >
      <div className="sticky top-0 z-10 w-full overflow-visible bg-background/95 py-2 backdrop-blur-[24px] supports-[backdrop-filter]:bg-background/80">
        <div className="flex w-full flex-wrap items-center gap-3">
          <TabsList
            variant="pills"
            aria-label="Home sections"
            className="t-tabs z-10"
            ref={tabsListRef}
          >
            {tab !== "others" && (
              <span
                aria-hidden
                className="t-tabs-pill"
                ref={pillRef}
                style={
                  {
                    "--tabs-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
                  } as CSSProperties
                }
              />
            )}
            {HOME_TABS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={`t-tab ${
                  item.value === "others" && tab === "others"
                    ? "relative z-10 mr-[-6px] !bg-gray-1 !text-gray-10 !shadow-[0_0_0_1px_var(--tabs-stroke)] dark:!bg-gray-1 dark:!text-gray-10"
                    : item.value === tab
                      ? "!bg-transparent"
                      : "!bg-transparent hover:!bg-[var(--tabs-hover)]"
                }`}
                onClick={() => {
                  if (item.value === tab) {
                    scrollPageToTop();
                  }
                }}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div
            aria-label="Other sections"
            className="t-resize home-other-tabs -ml-[30px] max-sm:ml-0"
            data-open={tab === "others"}
            inert={tab !== "others"}
            role="group"
            style={
              {
                "--resize-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
              } as CSSProperties
            }
          >
            <div className="home-other-tabs-inner">
              {OTHER_TABS.map((item, index) => (
                <button
                  key={item.value}
                  aria-pressed={activeOtherTab === item.value}
                  className={`home-other-tab ${
                    index > 0 ? "-ml-6" : ""
                  }`}
                  onClick={() => {
                    if (tab === "others" && activeOtherTab === item.value) {
                      scrollPageToTop();
                      return;
                    }

                    setOtherTab(item.value);
                    selectTab("others", item.value);
                  }}
                  style={{ zIndex: OTHER_TABS.length - index }}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`t-page-slide w-full${visibleTabs.length > 1 ? " is-sliding" : ""}`}
        data-page={renderedPage}
        ref={slideRef}
        style={
          {
            "--page-slide-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
            "--page-fade-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
            "--page-exit-enabled": exitEnabled ? "1" : "0",
          } as CSSProperties
        }
      >
        {HOME_TABS.map((item, index) => {
          if (!visibleTabs.includes(item.value)) return null;

          const isRendered = item.value === renderedTab;
          const isFlow = item.value === flowTab;
          const side =
            index < renderedIndex
              ? "before"
              : index > renderedIndex
                ? "after"
                : undefined;

          return (
            <TabsContent
              key={item.value}
              value={item.value}
              forceMount
              inert={isRendered ? undefined : true}
              data-page-id={String(index + 1)}
              data-side={side}
              data-active={isRendered ? "true" : undefined}
              data-flow={isFlow ? "true" : undefined}
              className="t-page flex-none p-0"
              style={
                item.value === "play"
                  ? ({ "--page-blur": "0px" } as CSSProperties)
                  : undefined
              }
            >
              <HomeTabPanel
                value={item.value}
                otherTab={activeOtherTab}
                playFadeHeight={PLAY_ROW_FADE_HEIGHT}
                mediaActive={item.value !== "play" || (isFlow && visibleTabs.length === 1)}
              />
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
