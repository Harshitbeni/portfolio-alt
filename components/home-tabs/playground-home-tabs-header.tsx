"use client";

import { useRef, useState, type MutableRefObject } from "react";
import { HomeTabsHeader } from "@/components/home-tabs/home-tabs-header";
import {
  HOME_TABS,
  OTHER_TABS,
  type HomeTab,
  type OtherTab,
} from "@/components/home-tabs/constants";
import { Tabs } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function PlaygroundHomeTabsHeader() {
  const [tab, setTab] = useState<HomeTab>("work");
  const [otherTab, setOtherTab] = useState<OtherTab>("books");
  const [mobileStackEnabled, setMobileStackEnabled] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const tabChangeGuardRef = useRef<(nextTab: HomeTab) => boolean>(() => false);

  const activeLabel =
    tab === "others"
      ? `Others / ${OTHER_TABS.find((item) => item.value === otherTab)?.label ?? otherTab}`
      : HOME_TABS.find((item) => item.value === tab)?.label ?? tab;

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <Checkbox
          checked={mobileStackEnabled}
          onCheckedChange={(checked) => setMobileStackEnabled(checked === true)}
        />
        Mobile stack experiment (hidden prop)
      </label>
      <div className="overflow-hidden rounded-lg border border-border bg-background">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            const nextTab = (HOME_TABS.find((item) => item.value === value)?.value ??
              "work") as HomeTab;

            if (tabChangeGuardRef.current(nextTab)) {
              return;
            }

            setTab(nextTab);
          }}
          className="w-full gap-4"
        >
          <HomeTabsHeader
            tab={tab}
            otherTab={otherTab}
            mobileStackEnabled={mobileStackEnabled}
            tabsListRef={tabsListRef}
            pillRef={pillRef}
            onSelectTab={(nextTab, nextOtherTab = otherTab) => {
              setTab(nextTab);
              setOtherTab(nextOtherTab);
            }}
            tabChangeGuardRef={
              tabChangeGuardRef as MutableRefObject<(nextTab: HomeTab) => boolean>
            }
          />
        </Tabs>
        <div className="border-t border-border px-4 py-6 text-sm text-muted-foreground">
          Active: <span className="text-foreground">{activeLabel}</span>
        </div>
      </div>
      <p className={cn("text-xs text-muted-foreground")}>
        Below 640px, Others becomes a dropdown with a chevron. Resize the window
        or use devtools device mode to preview.
      </p>
    </div>
  );
}
