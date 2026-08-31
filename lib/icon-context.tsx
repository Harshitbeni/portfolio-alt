"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ComponentType,
  type ReactNode,
} from "react";
import { CentralIcon } from "@central-icons-react/all";
import type {
  CentralIconFill,
  CentralIconName,
  CentralIconRadius,
  CentralIconStroke,
} from "@central-icons-react/all/icons";

import { cn } from "@/lib/utils";

export interface IconComponentProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export type IconComponent = ComponentType<IconComponentProps>;

export type IconName =
  | "chevron-right" | "chevron-down" | "x" | "copy" | "menu" | "dot"
  | "monitor" | "sun" | "moon" | "sunset" | "rectangle-horizontal" | "circle"
  | "square-library" | "clock" | "star" | "settings"
  | "plus" | "arrow-left" | "arrow-right" | "arrow-up" | "arrow-down" | "arrow-up-right" | "arrow-undo-up"
  | "search" | "loader"
  | "users" | "lock" | "mail" | "bell" | "shield" | "palette"
  | "lightbulb" | "rocket" | "heart" | "paintbrush" | "brain"
  | "globe" | "user"
  | "image" | "link" | "check" | "rotate-ccw"
  | "play" | "pause" | "volume" | "volume-off" | "audio" | "pipette" | "expand-45" | "minimize-45"
  | "split" | "network" | "layers" | "tree" | "compare" | "upload" | "git" | "record" | "eye"
  | "home" | "message-circle" | "inbox"
  | "raising-hand-4-finger"
  | "pencil" | "scaling" | "skip-forward" | "corner-down-right" | "corner-down-left"
  | "panel-left" | "panel-right" | "chevrons-up-down" | "more-horizontal" | "calendar" | "folder"
  | "sliders-horizontal"
  | "type"
  | "components"
  | "shadows";

const SLOT_TO_CENTRAL: Record<IconName, CentralIconName> = {
  "chevron-right": "IconChevronRight",
  "chevron-down": "IconChevronDownMedium",
  "x": "IconCrossMedium",
  "copy": "IconClipboard",
  "menu": "IconBarsThree",
  "dot": "IconCircle",
  "monitor": "IconStudioDisplay",
  "sun": "IconSun",
  "moon": "IconMoon",
  "sunset": "IconSunset",
  "rectangle-horizontal": "IconFormRectangle",
  "circle": "IconCircle",
  "square-library": "IconLibrary",
  "clock": "IconClock",
  "star": "IconStar",
  "settings": "IconSettingsGear1",
  "plus": "IconPlusMedium",
  "arrow-left": "IconArrowLeft",
  "arrow-right": "IconArrowRight",
  "arrow-up": "IconArrowUp",
  "arrow-down": "IconArrowDown",
  "arrow-up-right": "IconArrowUpRight",
  "arrow-undo-up": "IconArrowUndoUp",
  "search": "IconMagnifyingGlass",
  "loader": "IconLoader",
  "users": "IconUserGroup",
  "lock": "IconLock",
  "mail": "IconEmail1",
  "bell": "IconBell",
  "shield": "IconShield",
  "split": "IconSplit",
  "network": "IconAgentNetwork",
  "layers": "IconLayersThree",
  "tree": "IconCodeTree",
  "compare": "IconChartCompare",
  "upload": "IconCloudUpload",
  "git": "IconGit",
  "record": "IconCircleRecord",
  "eye": "IconEyeOpen",
  "palette": "IconColorPalette",
  "lightbulb": "IconLightbulbGlow",
  "rocket": "IconRocket",
  "heart": "IconHeart",
  "paintbrush": "IconPaintBrush",
  "brain": "IconBrain",
  "globe": "IconGlobe",
  "user": "IconUser",
  "image": "IconImages1",
  "link": "IconChainLink1",
  "check": "IconCheckmark1",
  "rotate-ccw": "IconArrowRotateCounterClockwise",
  "play": "IconPlay",
  "pause": "IconPause",
  "volume": "IconVolumeFull",
  "volume-off": "IconVolumeOff",
  "audio": "IconAudio",
  "expand-45": "IconExpand45",
  "minimize-45": "IconMinimize45",
  "pipette": "IconEyedropper",
  "home": "IconHome",
  "message-circle": "IconChatBubble7",
  "raising-hand-4-finger": "IconRaisingHand4Finger",
  "inbox": "IconInboxEmpty",
  "pencil": "IconPencil",
  "scaling": "IconArrowsZoom",
  "skip-forward": "IconSkip",
  "corner-down-right": "IconArrowCornerDownRight",
  "corner-down-left": "IconArrowCornerDownLeft",
  "panel-left": "IconSidebarSimpleLeftWide",
  "panel-right": "IconSidebarSimpleRightWide",
  "chevrons-up-down": "IconChevronGrabberVertical",
  "more-horizontal": "IconDotGrid1x3Horizontal",
  "calendar": "IconCalendar1",
  "folder": "IconFolder1",
  "sliders-horizontal": "IconSettingsSliderHor",
  type: "IconFontStyle",
  components: "IconComponents",
  shadows: "IconShadows",
};

function strokeFromWidth(strokeWidth?: number): CentralIconStroke {
  if (strokeWidth == null) return "1.5";
  if (strokeWidth >= 1.9) return "2";
  if (strokeWidth >= 1.25) return "1.5";
  return "1";
}

function centralIcon(
  name: CentralIconName,
  fill: CentralIconFill = "outlined",
  radius: CentralIconRadius = "1"
): IconComponent {
  function Icon({ size = 16, strokeWidth, className }: IconComponentProps) {
    return (
      <CentralIcon
        name={name}
        join="round"
        fill={fill}
        radius={radius}
        stroke={strokeFromWidth(strokeWidth)}
        size={size}
        color="currentColor"
        className={cn(
          // Mask glyphs must stay white; parent `**:text-*` would darken them in light mode.
          "text-current [&_mask]:![color:#fff] [&_mask_*]:![color:#fff]",
          className
        )}
      />
    );
  }
  Icon.displayName = fill === "filled" ? `${name}Filled` : name;
  return Icon;
}

export const defaultIcons: Record<IconName, IconComponent> = Object.fromEntries(
  (Object.keys(SLOT_TO_CENTRAL) as IconName[]).map((slot) => [
    slot,
    centralIcon(SLOT_TO_CENTRAL[slot]),
  ])
) as Record<IconName, IconComponent>;

/** Filled variants for section headers and other selected chrome. */
export const filledIcons = {
  type: centralIcon("IconFontStyle", "filled"),
  palette: centralIcon("IconColorPalette", "filled"),
  shadows: centralIcon("IconShadows", "filled"),
  components: centralIcon("IconComponents", "filled"),
} as const satisfies Record<
  "type" | "palette" | "shadows" | "components",
  IconComponent
>;

/** Filled slot glyphs. `defaultIcons` stay outlined. */
export const filledSlotIcons = Object.fromEntries(
  (Object.keys(SLOT_TO_CENTRAL) as IconName[]).map((slot) => [
    slot,
    centralIcon(SLOT_TO_CENTRAL[slot], "filled"),
  ])
) as Record<IconName, IconComponent>;

/** Outline/fill pair for the homepage time-mode toggle. */
export const timeModeIcons = {
  sunset: centralIcon("IconSunset"),
  sunsetFilled: centralIcon("IconSunset", "filled"),
} as const;

/** Filled play/pause and volume for media controls. */
export const mediaControlIcons = {
  play: centralIcon("IconPlay", "filled"),
  pause: centralIcon("IconPause", "filled"),
  volume: centralIcon("IconVolumeFull", "filled"),
  volumeOff: centralIcon("IconVolumeOff", "filled"),
} as const;

/** Radius-2 glyphs for the expandable nav card. */
export const navCardIcons = {
  expand: centralIcon("IconExpandSimple", "outlined", "2"),
  chevronDown: centralIcon("IconChevronDownSmall", "outlined", "2"),
  footsteps: centralIcon("IconFootsteps", "filled", "2"),
  sleep: centralIcon("IconPillowZz", "filled", "2"),
  sun: centralIcon("IconSun", "filled", "2"),
} as const;

const IconContext = createContext<Record<IconName, IconComponent> | null>(null);

function useIcon(name: IconName): IconComponent {
  const icons = useContext(IconContext);
  return (icons ?? defaultIcons)[name];
}

function useIcons(): Record<IconName, IconComponent> {
  const icons = useContext(IconContext);
  return icons ?? defaultIcons;
}

function IconProvider({
  children,
  icons,
}: {
  children: ReactNode;
  icons?: Partial<Record<IconName, IconComponent>>;
}) {
  const value = useMemo(() => ({ ...defaultIcons, ...icons }), [icons]);
  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

export { IconProvider, useIcon, useIcons };
