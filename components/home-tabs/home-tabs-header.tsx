"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type RefObject,
} from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TabsList, TabsTrigger, tabsTriggerStyles } from "@/components/ui/tabs";
import {
  HOME_OTHER_TABS_SPACING_LEFT,
  HOME_TABS,
  HOME_TABS_MOBILE_BREAKPOINT,
  HOME_TABS_STACK_DURATION,
  HOME_TABS_STACK_OVERLAP,
  HOME_TABS_STACK_STAGGER,
  HOME_TABS_TRANSITION_DURATION,
  OTHER_TABS,
  type HomeTab,
  type OtherTab,
} from "@/components/home-tabs/constants";
import { OthersMusicPeek } from "@/components/home-tabs/others-music-peek";
import { useMobileStackActive } from "@/components/home-tabs/use-mobile-stack-active";
import { useIcon } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollPageToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "instant" : "smooth",
  });
}

export type HomeTabsHeaderProps = {
  tab: HomeTab;
  otherTab: OtherTab;
  mobileStackEnabled?: boolean;
  mobileBreakpoint?: number;
  tabsListRef: RefObject<HTMLDivElement | null>;
  pillRef: RefObject<HTMLSpanElement | null>;
  tabsBarRef?: RefObject<HTMLDivElement | null>;
  onSelectTab: (nextTab: HomeTab, nextOtherTab?: OtherTab) => void;
  tabChangeGuardRef?: MutableRefObject<(nextTab: HomeTab) => boolean>;
};

export function HomeTabsHeader({
  tab,
  otherTab,
  mobileStackEnabled = false,
  mobileBreakpoint = HOME_TABS_MOBILE_BREAKPOINT,
  tabsListRef,
  pillRef,
  tabsBarRef: tabsBarRefProp,
  onSelectTab,
  tabChangeGuardRef,
}: HomeTabsHeaderProps) {
  const ChevronDown = useIcon("chevron-down");
  const internalTabsBarRef = useRef<HTMLDivElement>(null);
  const tabsBarRef = tabsBarRefProp ?? internalTabsBarRef;
  const isMobileViewport = useMobileStackActive(true, mobileBreakpoint);
  const isMobileStackActive = useMobileStackActive(
    mobileStackEnabled,
    mobileBreakpoint,
  );
  const isMobileOthersDropdown = isMobileViewport && !mobileStackEnabled;
  const [mainTabsRevealed, setMainTabsRevealed] = useState(false);
  const [othersMenuOpen, setOthersMenuOpen] = useState(false);
  const isMainTabsStacked =
    isMobileStackActive && tab === "others" && !mainTabsRevealed;
  const tabsStackMode = isMainTabsStacked ? "collapsed" : "off";
  const mainTabsState =
    isMobileStackActive && tab === "others"
      ? mainTabsRevealed
        ? "revealed"
        : "stacked"
      : "idle";
  const showInlineOtherSubtabs =
    tab === "others" &&
    !isMobileOthersDropdown &&
    (!isMobileStackActive || !mainTabsRevealed);

  const collapseOthersStack = useCallback(() => {
    setMainTabsRevealed(false);
  }, []);

  const revealMainTabs = useCallback(() => {
    setMainTabsRevealed(true);
  }, []);

  useEffect(() => {
    if (!isMobileStackActive || tab !== "others") {
      setMainTabsRevealed(false);
    }
  }, [isMobileStackActive, tab]);

  useEffect(() => {
    if (!isMobileOthersDropdown) {
      setOthersMenuOpen(false);
    }
  }, [isMobileOthersDropdown]);

  useEffect(() => {
    if (!isMobileStackActive || tab !== "others" || !mainTabsRevealed) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (tabsBarRef.current?.contains(target)) {
        return;
      }

      collapseOthersStack();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [collapseOthersStack, isMobileStackActive, mainTabsRevealed, tab, tabsBarRef]);

  useEffect(() => {
    if (!tabChangeGuardRef) return;

    if (!mobileStackEnabled) {
      tabChangeGuardRef.current = () => false;
      return;
    }

    tabChangeGuardRef.current = (nextTab) => {
      if (tab === "others" && !mainTabsRevealed && nextTab !== "others") {
        revealMainTabs();
        return true;
      }

      return false;
    };
  }, [
    mainTabsRevealed,
    mobileStackEnabled,
    revealMainTabs,
    tab,
    tabChangeGuardRef,
  ]);

  const handleOtherSubtabSelect = (value: OtherTab) => {
    if (tab === "others" && otherTab === value) {
      scrollPageToTop();
      setOthersMenuOpen(false);
      return;
    }

    onSelectTab("others", value);
    setOthersMenuOpen(false);
  };

  const othersTriggerClassName =
    tab === "others"
      ? "relative z-10 !bg-gray-1 !text-gray-10 !shadow-[0_0_0_1px_var(--tabs-stroke)] dark:!bg-gray-1 dark:!text-gray-10"
      : "";

  const mainTabTriggers = HOME_TABS.filter((item) => item.value !== "others").map(
    (item, index) => (
      <TabsTrigger
        key={item.value}
        value={item.value}
        className={`t-tab home-tabs-main-tab ${
          item.value === tab ? "!bg-transparent" : ""
        }`}
        style={isMainTabsStacked ? { zIndex: index + 1 } : undefined}
        onPointerDown={(event) => {
          if (isMobileStackActive && tab === "others" && !mainTabsRevealed) {
            event.preventDefault();
            revealMainTabs();
          }
        }}
        onClick={() => {
          if (item.value === tab) {
            scrollPageToTop();
          }
        }}
      >
        {item.label}
      </TabsTrigger>
    ),
  );

  const tabsPill = tab !== "others" && (
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
  );

  const tabsListStyle =
    mobileStackEnabled
      ? ({
          "--home-tabs-stack-overlap": `${HOME_TABS_STACK_OVERLAP}px`,
          "--home-tabs-stack-dur": `${HOME_TABS_STACK_DURATION}ms`,
          "--home-tabs-stack-stagger": `${HOME_TABS_STACK_STAGGER}ms`,
        } as CSSProperties)
      : undefined;

  const handleOthersMenuOpenChange = (open: boolean) => {
    setOthersMenuOpen(open);
  };

  const othersDropdownLabel =
    tab === "others"
      ? (OTHER_TABS.find((item) => item.value === otherTab)?.label ?? "Others")
      : "Others";

  const othersDropdownTrigger = (
    <div
      className="home-tabs-others-group inline-flex shrink-0 items-center"
      data-others-open={tab === "others" ? "true" : undefined}
    >
      <div className="home-tabs-others-trigger relative inline-flex shrink-0 overflow-visible">
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-active={tab === "others" ? "true" : undefined}
            aria-label={
              tab === "others" ? `Others: ${othersDropdownLabel}` : "Others"
            }
            className={cn(
              tabsTriggerStyles,
              "t-tab !flex-none shrink-0",
            )}
          >
            <span>{othersDropdownLabel}</span>
            <ChevronDown
              size={14}
              className={cn(
                "shrink-0 text-current transition-transform duration-200 ease-out",
                othersMenuOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
        </DropdownMenuTrigger>
      </div>
      <OthersMusicPeek
        active={tab !== "others"}
        onSelect={() => handleOtherSubtabSelect("music")}
      />
    </div>
  );

  const othersInlineGroup = (
    <div
      className="home-tabs-others-group inline-flex shrink-0 items-center"
      data-others-open={tab === "others" ? "true" : undefined}
    >
      <div className="home-tabs-others-trigger relative inline-flex shrink-0 overflow-visible">
        <TabsTrigger
          value="others"
          className={`t-tab ${othersTriggerClassName}`}
          onClick={() => {
            if (isMobileStackActive && tab === "others" && mainTabsRevealed) {
              collapseOthersStack();
              return;
            }

            if (tab === "others") {
              scrollPageToTop();
            }
          }}
        >
          Others
        </TabsTrigger>
      </div>
      <OthersMusicPeek
        active={tab !== "others"}
        onSelect={() => handleOtherSubtabSelect("music")}
      />
      <div
        aria-label="Other sections"
        className="t-resize home-other-tabs -ml-[30px]"
        data-open={showInlineOtherSubtabs}
        inert={!showInlineOtherSubtabs}
        role="group"
        style={
          {
            "--resize-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
          } as CSSProperties
        }
      >
        <div
          className="home-other-tabs-inner"
          style={{ paddingLeft: `${HOME_OTHER_TABS_SPACING_LEFT}px` }}
        >
          {OTHER_TABS.map((item, index) => (
            <button
              key={item.value}
              aria-pressed={otherTab === item.value}
              className={`home-other-tab ${index > 0 ? "-ml-6" : ""}`}
              onClick={() => handleOtherSubtabSelect(item.value)}
              style={{ zIndex: OTHER_TABS.length - index }}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={tabsBarRef}
      className="sticky top-0 z-10 w-full overflow-visible bg-background/95 px-4 py-2 backdrop-blur-[8px] supports-[backdrop-filter]:bg-background/80"
      style={
        {
          "--tabs-dur": `${HOME_TABS_TRANSITION_DURATION}ms`,
          "--home-tabs-stack-dur": `${HOME_TABS_STACK_DURATION}ms`,
          "--home-tabs-stack-stagger": `${HOME_TABS_STACK_STAGGER}ms`,
        } as CSSProperties
      }
    >
      {isMobileOthersDropdown ? (
        <DropdownMenu
          modal={false}
          open={othersMenuOpen}
          onOpenChange={handleOthersMenuOpenChange}
        >
          <div
            className="group/tabs-list inline-flex w-full flex-wrap items-start gap-3"
            data-variant="pills"
          >
            <TabsList
              variant="pills"
              aria-label="Home sections"
              className="t-tabs z-10 w-fit justify-start overflow-visible"
              data-main-tabs-state={mainTabsState}
              data-mobile-others-dropdown="true"
              data-stack-mode={tabsStackMode}
              ref={tabsListRef}
              style={tabsListStyle}
            >
              {tabsPill}
              {mainTabTriggers}
            </TabsList>
            {othersDropdownTrigger}
          </div>
          <DropdownMenuContent align="start" className="z-[60] min-w-32">
            {OTHER_TABS.map((item) => (
              <DropdownMenuItem
                key={item.value}
                data-selected={tab === "others" && otherTab === item.value}
                className={cn(
                  tab === "others" &&
                    otherTab === item.value &&
                    "bg-accent text-accent-foreground",
                )}
                onSelect={() => handleOtherSubtabSelect(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <TabsList
          variant="pills"
          aria-label="Home sections"
          className="t-tabs z-10 w-full justify-start overflow-visible"
          data-main-tabs-state={mainTabsState}
          data-stack-mode={tabsStackMode}
          ref={tabsListRef}
          style={tabsListStyle}
        >
          {tabsPill}
          {mainTabTriggers}
          {othersInlineGroup}
        </TabsList>
      )}
    </div>
  );
}
