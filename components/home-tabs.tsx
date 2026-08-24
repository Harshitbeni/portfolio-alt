"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BooksPanel } from "@/components/books-panel";
import { MusicPanel } from "@/components/music-panel";
import { ObjectsPanel } from "@/components/objects-panel";
import { PlayPanel } from "@/components/play-panel";
import { StackPanel } from "@/components/stack-panel";
import { WorkRow } from "@/components/work-row";
import {
  HOME_TABS,
  HOME_TABS_TRANSITION_DURATION,
  OTHER_TABS,
  homeTabFromParam,
  isHomeTab,
  isOtherTab,
  getHomeScrollKey,
  type HomeTab,
  type OtherTab,
} from "@/components/home-tabs/constants";
import { HomeTabsHeader } from "@/components/home-tabs/home-tabs-header";
import {
  prefetchMusicLibrary,
  prefetchNowPlaying,
  seedMusicCache,
} from "@/lib/music-client-cache";
import type { MusicSection } from "@/lib/music";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { WORK_ITEMS } from "@/lib/work";

const PLAY_ROW_FADE_HEIGHT = 32;

function restoreScrollPosition(scrollY: number) {
  const applyScroll = () => {
    window.scrollTo({ top: scrollY, behavior: "instant" });
  };

  requestAnimationFrame(() => {
    applyScroll();
    requestAnimationFrame(applyScroll);
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

function tabParamForSelection(
  tab: HomeTab,
  otherTab: OtherTab,
): Exclude<HomeTab, "others"> | OtherTab | null {
  switch (tab) {
    case "work":
      return null;
    case "play":
    case "notes":
      return tab;
    case "others":
      return otherTab;
    default: {
      const exhaustive: never = tab;
      return exhaustive;
    }
  }
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
  notesPanel,
}: {
  value: HomeTab;
  otherTab: OtherTab;
  playFadeHeight: number;
  mediaActive: boolean;
  notesPanel: ReactNode;
}) {
  let content: ReactNode;

  switch (value) {
    case "work":
      content = (
        <div className="flex w-full flex-col gap-12">
          {WORK_ITEMS.map(({ id, ...item }) => (
            <WorkRow key={id} {...item} />
          ))}
        </div>
      );
      break;
    case "play":
      content = (
        <PlayPanel fadeHeight={playFadeHeight} mediaActive={mediaActive} />
      );
      break;
    case "notes":
      content = notesPanel;
      break;
    case "others":
      content = <OtherTabPanels activeTab={otherTab} />;
      break;
    default: {
      const exhaustive: never = value;
      return exhaustive;
    }
  }

  return <div className="px-4">{content}</div>;
}

export function HomeTabs({
  initialMusicSections = null,
  initialMusicTotalTracks,
  notesPanel,
  mobileStackEnabled = false,
}: {
  initialMusicSections?: MusicSection[] | null;
  initialMusicTotalTracks?: number;
  notesPanel: ReactNode;
  mobileStackEnabled?: boolean;
}) {
  if (initialMusicSections?.length) {
    seedMusicCache(initialMusicSections, initialMusicTotalTracks);
  }

  useEffect(() => {
    void prefetchNowPlaying();
    void prefetchMusicLibrary();
  }, []);

  const scrollPositionsRef = useRef<Partial<Record<string, number>>>({});
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const pendingTabParamRef = useRef<string | undefined>(undefined);
  const tabChangeGuardRef = useRef<(nextTab: HomeTab) => boolean>(() => false);
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
    isOtherTab(tabParam) ? tabParam : "books",
  );
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
      const currentScrollKey = getHomeScrollKey(tab, otherTab);

      scrollPositionsRef.current[currentScrollKey] = window.scrollY;
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
      const nextScrollKey = getHomeScrollKey(nextTab, nextOtherTab);
      const nextScrollY = scrollPositionsRef.current[nextScrollKey] ?? 0;

      restoreScrollPosition(nextScrollY);

      requestAnimationFrame(() => {
        router.replace(href, { scroll: false });
        restoreScrollPosition(nextScrollY);
      });
    },
    [otherTab, pathname, router, searchParams, tab],
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
    const scrollKey = getHomeScrollKey(tab, otherTab);
    const scrollY = scrollPositionsRef.current[scrollKey] ?? 0;

    const frame = requestAnimationFrame(() => {
      restoreScrollPosition(scrollY);
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
  }, [movePill, otherTab, tab]);

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

  useEffect(() => {
    const frame = requestAnimationFrame(() => movePill(false));
    return () => cancelAnimationFrame(frame);
  }, [movePill, tab]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const nextTab = isHomeTab(value) ? value : HOME_TABS[0].value;

        if (tabChangeGuardRef.current(nextTab)) {
          return;
        }

        selectTab(nextTab);
      }}
      className="w-full gap-12"
    >
      <HomeTabsHeader
        tab={tab}
        otherTab={otherTab}
        mobileStackEnabled={mobileStackEnabled}
        tabsListRef={tabsListRef}
        pillRef={pillRef}
        scrollPositionsRef={scrollPositionsRef}
        getScrollKey={getHomeScrollKey}
        onSelectTab={selectTab}
        tabChangeGuardRef={tabChangeGuardRef}
      />
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
                otherTab={otherTab}
                playFadeHeight={PLAY_ROW_FADE_HEIGHT}
                mediaActive={item.value !== "play" || (isFlow && visibleTabs.length === 1)}
                notesPanel={notesPanel}
              />
            </TabsContent>
          );
        })}
      </div>
    </Tabs>
  );
}
