"use client";

import type { ComponentType } from "react";
import { navCardIcons, type IconComponentProps } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

const STEPS_GOAL = 10_000;
const SLEEP_GOAL_MINUTES = 8 * 60;
const SUNSHINE_GOAL_MINUTES = 32;

const MOCK_STEPS = 7_458;
const MOCK_SLEEP_MINUTES = 7 * 60 + 23;
const MOCK_SUNSHINE_MINUTES = 32;

const FootstepsIcon = navCardIcons.footsteps;
const SleepIcon = navCardIcons.sleep;
const SunIcon = navCardIcons.sun;

const focusRingClassName =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

function clampProgress(value: number, goal: number) {
  if (goal <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, value / goal));
}

function formatSleep(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function StatRow({
  icon: Icon,
  value,
  label,
  progress,
}: {
  icon: ComponentType<IconComponentProps>;
  value: string;
  label: string;
  progress: number;
}) {
  const pct = clampProgress(progress, 1);

  return (
    <div className="relative flex w-full items-center gap-[14px] overflow-hidden rounded border border-gray-a2 bg-gray-2 px-2 py-1">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 bg-gray-a3"
        style={{ width: `${(pct * 100).toFixed(2)}%` }}
      />
      <Icon
        size={16}
        className="relative size-4 shrink-0 text-gray-9"
      />
      <div className="relative flex items-baseline gap-1 text-xxs leading-4">
        <p className="m-0 whitespace-nowrap text-foreground">{value}</p>
        <p className="m-0 whitespace-nowrap text-gray-10">{label}</p>
      </div>
    </div>
  );
}

function MeetMiniBeniButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center bg-primary p-2 text-xs font-medium leading-[18px] text-primary-foreground",
        "shadow-[inset_0_-2px_0_0_color-mix(in_oklch,var(--primary),black_35%)]",
        "transition-[scale] duration-150 ease-out active:scale-[0.96]",
        focusRingClassName
      )}
      style={{
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
      }}
    >
      Meet mini-beni™
    </button>
  );
}

export function NavCardExpandPanel({
  expanded,
  panelId,
  onMeet,
}: {
  expanded: boolean;
  panelId: string;
  onMeet: () => void;
}) {
  return (
    <div
      id={panelId}
      data-nav-card-panel=""
      className="w-full shrink-0"
      inert={!expanded || undefined}
      aria-hidden={!expanded}
    >
      <div className="flex w-full flex-col gap-1">
        <StatRow
          icon={FootstepsIcon}
          value={MOCK_STEPS.toLocaleString("en-US")}
          label="Steps"
          progress={clampProgress(MOCK_STEPS, STEPS_GOAL)}
        />
        <StatRow
          icon={SleepIcon}
          value={formatSleep(MOCK_SLEEP_MINUTES)}
          label="Sleep"
          progress={clampProgress(MOCK_SLEEP_MINUTES, SLEEP_GOAL_MINUTES)}
        />
        <StatRow
          icon={SunIcon}
          value={`${MOCK_SUNSHINE_MINUTES}m`}
          label="Sunshine"
          progress={clampProgress(
            MOCK_SUNSHINE_MINUTES,
            SUNSHINE_GOAL_MINUTES
          )}
        />
        <MeetMiniBeniButton onClick={onMeet} />
      </div>
    </div>
  );
}
