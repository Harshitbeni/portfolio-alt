"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { NavCard, type NavCardVariant } from "@/components/nav-card";
import {
  Bubble,
  BubbleContent,
} from "@/components/ui/bubble";
import { AvatarPerson } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenuItemWithIcon } from "@/components/ui/dropdown-menu-item-icon";
import { fontWeights } from "@/lib/font-weight";
import { defaultIcons, filledIcons, type IconComponent, type IconName } from "@/lib/icon-context";
import { useTheme, type Theme } from "@/lib/theme";
import {
  COLOR_FAMILIES,
  FAMILY_TOKENS,
  PALETTE_TOKENS,
  defaultPaletteHex,
  isAlphaToken,
  type ColorFamily,
  type PaletteToken,
} from "@/lib/tokens";
import {
  TYPE_STYLE_WEIGHTS,
  TYPE_TOKEN_NAMES,
  TYPE_TOKENS,
  TYPE_WEIGHTS as TYPE_TOKEN_WEIGHTS,
  typeTokenStyles,
  type TypeTokenName,
} from "@/lib/type-tokens";
import {
  SHADOW_TOKEN_NAMES,
  SHADOW_TOKEN_ROLES,
  type ShadowTokenName,
} from "@/lib/shadow-tokens";
import { cn } from "@/lib/utils";
import { BookRow } from "@/components/book-row";
import { MusicRow } from "@/components/music-row";
import { NoteLikeButton } from "@/components/note-like-button";
import { ObjectRow } from "@/components/object-row";
import { PlayRow } from "@/components/play-row";
import { StackRow } from "@/components/stack-row";
import { WorkRow } from "@/components/work-row";
import { BOOKS } from "@/lib/books";
import type { MusicTrack } from "@/lib/music";
import { OBJECT_ITEMS } from "@/lib/objects";
import { PLAY_ITEMS } from "@/lib/play";
import { STACK_ITEMS } from "@/lib/stack";
import { WORK_ITEMS, type WorkIconName } from "@/lib/work";
import { PlaygroundHomeTabsHeader } from "@/components/home-tabs/playground-home-tabs-header";
import { PlaygroundMiniBeniTypingIndicator } from "./playground-mini-beni-typing-indicator";
import { PlaygroundVideoPlayer } from "./playground-video-player";

const inspectorRowClassName =
  "flex h-8 shrink-0 items-center justify-between gap-3 text-sm text-muted-foreground";

const TYPE_TOKEN_LABELS: Record<TypeTokenName, string> = {
  xl: "XL",
  lg: "LG",
  md: "MD",
  sm: "SM",
  xs: "XS",
  xxs: "XXS",
};

const TYPE_PREVIEW_SENTENCE = "Harshit Beniwal is an Interface Designer.";

function typePreviewLineHeight(token: TypeTokenName) {
  if (token === "xl") return "2rem";
  if (token === "lg" || token === "md") return "1.5rem";
  return undefined;
}

const Plus = defaultIcons.plus;
const ChevronDown = defaultIcons["chevron-down"];

type Selection =
  | "color"
  | "typography"
  | "shadow"
  | "button"
  | "dropdown"
  | "tooltip"
  | "checkbox"
  | "input"
  | "nav-card"
  | "bubble"
  | "avatar"
  | "tabs"
  | "home-tabs-header"
  | "book-row"
  | "music-row"
  | "stack-row"
  | "object-row"
  | "work-row"
  | "play-row"
  | "video-player"
  | "image"
  | "note-like"
  | "mini-beni-typing";

const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "inline",
  "link",
] as const;
const BUTTON_SIZES = ["default", "sm", "lg", "icon"] as const;
const TYPE_WEIGHTS = ["normal", "medium", "semibold"] as const;
const INPUT_TYPES = [
  "text",
  "email",
  "password",
  "search",
  "url",
  "tel",
  "number",
] as const;
const INPUT_SIZES = ["default", "sm"] as const;
const BUBBLE_VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
  "blue",
] as const;
const BUBBLE_SIZES = ["xs", "sm", "default", "lg"] as const;
const BUBBLE_ALIGNS = ["start", "end"] as const;
const AVATAR_SIZES = ["xs", "sm", "default", "lg"] as const;
const PLAYGROUND_AVATAR_MEMBERS: Array<{
  name: string;
  role: string;
  src?: string;
}> = [
  {
    name: "Harshit Beniwal",
    role: "Product Designer",
    src: "/work/privado-mobile-app-scan/portrait-black-and-white.png",
  },
  {
    name: "Nitin Garg",
    role: "Head of Design",
    src: "/work/privado-mobile-app-scan/privado-team-photo.jpg",
  },
  {
    name: "Vaibhav Antil",
    role: "CEO",
  },
];
const NAV_CARD_VARIANTS = ["full", "compact"] as const;
const TABS_VARIANTS = ["default", "line", "pills"] as const;
const TABS_ORIENTATIONS = ["horizontal", "vertical"] as const;
const PLAY_MEDIA_KINDS = ["video", "image"] as const;
const TABS_ITEMS = [
  { value: "one", label: "One", content: "First panel" },
  { value: "two", label: "Two", content: "Second panel" },
  { value: "three", label: "Three", content: "Third panel" },
] as const;
const WORK_COMPANY_NAMES = WORK_ITEMS.map((item) => item.company.name);
const STACK_ITEM_NAMES = STACK_ITEMS.map((item) => item.name);
const OBJECT_ITEM_NAMES = OBJECT_ITEMS.map((item) => item.name);
const PLAYGROUND_BOOK = BOOKS[0];
const PLAYGROUND_STACK_ITEM = STACK_ITEMS[0];
const PLAYGROUND_OBJECT_ITEM = OBJECT_ITEMS[0];
const PLAYGROUND_MUSIC_TRACK = {
  id: "kali-uchis\u0000after-the-storm",
  name: "After the Storm (feat. Tyler, the Creator & Bootsy Collins)",
  artist: "Kali Uchis",
  image:
    "https://lastfm.freetls.fastly.net/i/u/300x300/a10a67180b666ce93a3bb79c49faca0b.jpg",
  url: "https://www.last.fm/music/Kali+Uchis/_/After+the+Storm+(feat.+Tyler,+the+Creator+&+Bootsy+Collins)",
  playedAt: null,
} satisfies MusicTrack;
const DROPDOWN_ITEMS = ["One", "Two", "Three"] as const;
const DROPDOWN_ITEM_ICONS = {
  One: "home",
  Two: "inbox",
  Three: "settings",
} as const satisfies Record<(typeof DROPDOWN_ITEMS)[number], IconName>;
/** Unchecked: 6px (same as `--radius` on `:root`). Checked: pill. */
const PREVIEW_RADIUS = 6;
const PREVIEW_RADIUS_PILL = 9999;

type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
type ButtonSize = (typeof BUTTON_SIZES)[number];
type InputType = (typeof INPUT_TYPES)[number];
type InputSize = (typeof INPUT_SIZES)[number];
type BubbleVariant = (typeof BUBBLE_VARIANTS)[number];
type BubbleSize = (typeof BUBBLE_SIZES)[number];
type BubbleAlign = (typeof BUBBLE_ALIGNS)[number];
type AvatarSize = (typeof AVATAR_SIZES)[number];
type TabsVariant = (typeof TABS_VARIANTS)[number];
type TabsOrientation = (typeof TABS_ORIENTATIONS)[number];
type TypeWeight = (typeof TYPE_WEIGHTS)[number];
type PlayMediaSelection = (typeof PLAY_MEDIA_KINDS)[number];
type PlaygroundTheme = Theme | "system";

export function Playground() {
  const { theme: systemTheme } = useTheme();
  const [playgroundTheme, setPlaygroundTheme] =
    useState<PlaygroundTheme>("system");
  const [selection, setSelection] = useState<Selection>("color");
  const [colorFamily, setColorFamily] = useState<ColorFamily | "all">("all");
  const [inspectedColor, setInspectedColor] = useState<PaletteToken>("gray-1");
  const [colorOverrides, setColorOverrides] = useState<
    Partial<Record<PaletteToken, string>>
  >({});
  const [typeToken, setTypeToken] = useState<TypeTokenName>("sm");
  const [typeSizes, setTypeSizes] = useState<Record<TypeTokenName, number>>(
    () => ({ ...TYPE_TOKENS })
  );
  const [typeWeight, setTypeWeight] = useState<TypeWeight>("normal");
  const [shadowToken, setShadowToken] = useState<ShadowTokenName>("2");
  const [button, setButton] = useState({
    variant: "default" as ButtonVariant,
    size: "default" as ButtonSize,
    label: "Button",
    loading: false,
    disabled: false,
    leading: false,
    rounded: false,
  });
  const [dropdown, setDropdown] = useState({
    icon: false,
    chevron: true,
    disabled: false,
  });
  const [tooltip, setTooltip] = useState({
    content: "Rating: 4/5",
    arrow: false,
    instant: true,
    delay: false,
  });
  const [checkbox, setCheckbox] = useState({
    label: "Label",
    checked: true,
    disabled: false,
  });
  const [input, setInput] = useState({
    placeholder: "Placeholder",
    type: "text" as InputType,
    size: "default" as InputSize,
    disabled: false,
    rounded: true,
    pill: false,
    button: false,
    buttonVariant: "default" as ButtonVariant,
  });
  const [navCard, setNavCard] = useState({
    liveLocation: true,
    variant: "full" as NavCardVariant,
    expandable: false,
  });
  const [bubble, setBubble] = useState({
    content: "Hello",
    variant: "default" as BubbleVariant,
    size: "default" as BubbleSize,
    align: "start" as BubbleAlign,
    pill: false,
  });
  const [avatar, setAvatar] = useState<{
    name: string;
    role: string;
    src: string;
    size: AvatarSize;
    showImage: boolean;
  }>({
    name: PLAYGROUND_AVATAR_MEMBERS[0].name,
    role: PLAYGROUND_AVATAR_MEMBERS[0].role,
    src: PLAYGROUND_AVATAR_MEMBERS[0].src ?? "",
    size: "xs",
    showImage: true,
  });
  const [tabs, setTabs] = useState({
    variant: "default" as TabsVariant,
    orientation: "horizontal" as TabsOrientation,
  });
  const [workRow, setWorkRow] = useState({
    icon: "bland" as WorkIconName,
    role: "Product Designer",
    company: "Bland AI",
    via: "",
    dates: "2023-2025",
    description: "Voice agents for enterprises",
  });
  const [playRow, setPlayRow] = useState({
    text: PLAY_ITEMS[0].text,
    date: PLAY_ITEMS[0].date,
    mediaKind: "video" as PlayMediaSelection,
    mediaCount: 1,
  });
  const [stackRow, setStackRow] = useState(PLAYGROUND_STACK_ITEM.id);
  const [objectRow, setObjectRow] = useState(PLAYGROUND_OBJECT_ITEM.id);
  const [videoPlayer, setVideoPlayer] = useState({
    autoplayOnHover: false,
    caption: "Showreel",
    glow: true,
    loop: true,
    overlay: false,
    showMuteButton: false,
  });
  const [image, setImage] = useState({
    caption: "Sunset",
    captionAlign: "center" as "start" | "center",
    glow: false,
    overlay: false,
    radius: 6,
    stroke: true,
  });
  const [noteLike, setNoteLike] = useState({
    liked: false,
    count: 10,
  });
  const previewStyle = useMemo(() => {
    const style: Record<string, string> = {};
    for (const name of TYPE_TOKEN_NAMES) {
      style[`--type-${name}`] = `${typeSizes[name]}px`;
    }
    for (const [token, value] of Object.entries(colorOverrides)) {
      if (value) style[`--${token}`] = value;
    }
    return style as CSSProperties;
  }, [colorOverrides, typeSizes]);

  const isIconSize = button.size === "icon";
  const previewRadius = button.rounded ? PREVIEW_RADIUS_PILL : PREVIEW_RADIUS;
  const workPreview = WORK_ITEMS.find((item) => item.icon === workRow.icon);
  const stackPreview =
    STACK_ITEMS.find((item) => item.id === stackRow) ?? PLAYGROUND_STACK_ITEM;
  const objectPreview =
    OBJECT_ITEMS.find((item) => item.id === objectRow) ?? PLAYGROUND_OBJECT_ITEM;
  const visibleTokens =
    colorFamily === "all" ? PALETTE_TOKENS : FAMILY_TOKENS[colorFamily];

  const selectColorFamily = (family: ColorFamily | "all") => {
    setSelection("color");
    setColorFamily(family);
    const tokens = family === "all" ? PALETTE_TOKENS : FAMILY_TOKENS[family];
    if (!tokens.includes(inspectedColor)) {
      setInspectedColor(tokens[0]);
    }
  };

  const selectPlaygroundTheme = (nextTheme: PlaygroundTheme) => {
    const resolvedTheme = nextTheme === "system" ? systemTheme : nextTheme;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    setPlaygroundTheme(nextTheme);
  };

  return (
    <div
      style={previewStyle}
      className="grid h-dvh grid-cols-[12.5rem_minmax(0,1fr)_14rem] bg-background text-foreground"
    >
      <nav className="flex flex-col text-sm shadow-[inset_-0.5px_0_0_0_var(--gray-5)]">
        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-5">
          <NavSection
            label="Typography"
            icon={filledIcons.type}
            defaultOpen={false}
          >
            {TYPE_TOKEN_NAMES.map((name) => (
              <NavItem
                key={name}
                label={TYPE_TOKEN_LABELS[name]}
                current={selection === "typography" && typeToken === name}
                nested
                onClick={() => {
                  setSelection("typography");
                  setTypeToken(name);
                }}
              />
            ))}
          </NavSection>
          <NavSection
            label="Color"
            icon={filledIcons.palette}
            defaultOpen={false}
            className="mt-3"
          >
            <NavItem
              label="All"
              current={selection === "color" && colorFamily === "all"}
              nested
              onClick={() => selectColorFamily("all")}
            />
            {COLOR_FAMILIES.map((family) => (
              <NavItem
                key={family}
                label={family[0].toUpperCase() + family.slice(1)}
                current={selection === "color" && colorFamily === family}
                nested
                onClick={() => selectColorFamily(family)}
              />
            ))}
          </NavSection>
          <NavSection
            label="Shadows"
            icon={filledIcons.shadows}
            defaultOpen={false}
            className="mt-3"
          >
            {SHADOW_TOKEN_NAMES.map((name) => (
              <NavItem
                key={name}
                label={name}
                current={selection === "shadow" && shadowToken === name}
                nested
                onClick={() => {
                  setSelection("shadow");
                  setShadowToken(name);
                }}
              />
            ))}
          </NavSection>
          <NavSection
            label="Components"
            icon={filledIcons.components}
            defaultOpen
            className="mt-3"
          >
            <NavItem
              label="Button"
              current={selection === "button"}
              nested
              onClick={() => setSelection("button")}
            />
            <NavItem
              label="Dropdown"
              current={selection === "dropdown"}
              nested
              onClick={() => setSelection("dropdown")}
            />
            <NavItem
              label="Tooltip"
              current={selection === "tooltip"}
              nested
              onClick={() => setSelection("tooltip")}
            />
            <NavItem
              label="Checkbox"
              current={selection === "checkbox"}
              nested
              onClick={() => setSelection("checkbox")}
            />
            <NavItem
              label="Input"
              current={selection === "input"}
              nested
              onClick={() => setSelection("input")}
            />
            <NavItem
              label="Nav card"
              current={selection === "nav-card"}
              nested
              custom
              onClick={() => setSelection("nav-card")}
            />
            <NavItem
              label="Bubble"
              current={selection === "bubble"}
              nested
              onClick={() => setSelection("bubble")}
            />
            <NavItem
              label="Avatar"
              current={selection === "avatar"}
              nested
              custom
              onClick={() => setSelection("avatar")}
            />
            <NavItem
              label="Tabs"
              current={selection === "tabs"}
              nested
              onClick={() => setSelection("tabs")}
            />
            <NavItem
              label="Home tabs"
              current={selection === "home-tabs-header"}
              nested
              custom
              onClick={() => setSelection("home-tabs-header")}
            />
            <NavItem
              label="Book row"
              current={selection === "book-row"}
              nested
              custom
              onClick={() => setSelection("book-row")}
            />
            <NavItem
              label="Music row"
              current={selection === "music-row"}
              nested
              custom
              onClick={() => setSelection("music-row")}
            />
            <NavItem
              label="Stack row"
              current={selection === "stack-row"}
              nested
              custom
              onClick={() => setSelection("stack-row")}
            />
            <NavItem
              label="Object row"
              current={selection === "object-row"}
              nested
              custom
              onClick={() => setSelection("object-row")}
            />
            <NavItem
              label="Work row"
              current={selection === "work-row"}
              nested
              custom
              onClick={() => setSelection("work-row")}
            />
            <NavItem
              label="Play row"
              current={selection === "play-row"}
              nested
              custom
              onClick={() => setSelection("play-row")}
            />
            <NavItem
              label="Image"
              current={selection === "image"}
              nested
              custom
              onClick={() => setSelection("image")}
            />
            <NavItem
              label="Note like"
              current={selection === "note-like"}
              nested
              custom
              onClick={() => setSelection("note-like")}
            />
            <NavItem
              label="Video player"
              current={selection === "video-player"}
              nested
              onClick={() => setSelection("video-player")}
            />
            <NavItem
              label="Typing indicator"
              current={selection === "mini-beni-typing"}
              nested
              custom
              onClick={() => setSelection("mini-beni-typing")}
            />
          </NavSection>
        </div>
        <div className="px-3 py-3">
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={playgroundTheme === "light" ? "secondary" : "ghost"}
              onClick={() => selectPlaygroundTheme("light")}
              type="button"
            >
              Light
            </Button>
            <Button
              size="sm"
              variant={playgroundTheme === "dark" ? "secondary" : "ghost"}
              onClick={() => selectPlaygroundTheme("dark")}
              type="button"
            >
              Dark
            </Button>
            <Button
              size="sm"
              variant={playgroundTheme === "system" ? "secondary" : "ghost"}
              onClick={() => selectPlaygroundTheme("system")}
              type="button"
            >
              System
            </Button>
          </div>
        </div>
      </nav>

      <main className="group/nav flex items-center justify-center p-8">
        {selection === "color" ? (
          <div className="grid w-full max-w-md grid-cols-6 gap-2">
            {visibleTokens.map((token) => (
              <ColorSwatch
                key={token}
                token={token}
                current={inspectedColor === token}
                onSelect={() => setInspectedColor(token)}
              />
            ))}
          </div>
        ) : null}

        {selection === "shadow" ? (
          <div className="flex items-end justify-center gap-6 px-16 py-20">
            {SHADOW_TOKEN_NAMES.map((name) => (
              <ShadowSwatch
                key={name}
                name={name}
                current={shadowToken === name}
                onSelect={() => setShadowToken(name)}
              />
            ))}
          </div>
        ) : null}

        {selection === "typography" ? (
          <div className="flex flex-col items-start gap-3">
            {typeTokenStyles(typeToken).map((name) => {
              const weightName = TYPE_STYLE_WEIGHTS[name];
              return (
                <p
                  key={name}
                  className="text-left text-foreground"
                  style={{
                    fontSize: `var(--type-${typeToken})`,
                    lineHeight: typePreviewLineHeight(typeToken),
                    fontWeight: weightName
                      ? TYPE_TOKEN_WEIGHTS[weightName]
                      : undefined,
                    fontVariationSettings: weightName
                      ? undefined
                      : fontWeights[typeWeight],
                  }}
                >
                  {TYPE_PREVIEW_SENTENCE}
                </p>
              );
            })}
          </div>
        ) : null}

        {selection === "button" ? (
          <Button
            variant={button.variant}
            size={button.size}
            rounded={previewRadius}
            disabled={button.disabled || button.loading}
            aria-label={isIconSize ? button.label : undefined}
          >
            {button.loading ? <Loader2 className="animate-spin" /> : null}
            {isIconSize && !button.loading ? <Plus /> : null}
            {!isIconSize && button.leading && !button.loading ? <Plus /> : null}
            {isIconSize ? null : button.label}
          </Button>
        ) : null}

        {selection === "dropdown" ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                rounded={previewRadius}
                disabled={dropdown.disabled}
                chevron={dropdown.chevron}
              >
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {DROPDOWN_ITEMS.map((label) => (
                <DropdownMenuItemWithIcon
                  key={label}
                  icon={dropdown.icon ? DROPDOWN_ITEM_ICONS[label] : undefined}
                >
                  {label}
                </DropdownMenuItemWithIcon>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {selection === "tooltip" ? (
          <Tooltip delay={tooltip.delay} instant={tooltip.instant}>
            <TooltipTrigger asChild>
              <Button variant="secondary" rounded={previewRadius}>
                Hover me
              </Button>
            </TooltipTrigger>
            <TooltipContent arrow={tooltip.arrow}>{tooltip.content}</TooltipContent>
          </Tooltip>
        ) : null}

        {selection === "checkbox" ? (
          <div className="flex items-center gap-2">
            <Checkbox
              id="playground-checkbox"
              checked={checkbox.checked}
              disabled={checkbox.disabled}
              onCheckedChange={(checked) =>
                setCheckbox((current) => ({
                  ...current,
                  checked: checked === true,
                }))
              }
            />
            <label htmlFor="playground-checkbox" className="text-sm">
              {checkbox.label}
            </label>
          </div>
        ) : null}

        {selection === "input" ? (
          <div className="w-64">
            <Input
              type={input.type}
              size={input.size}
              placeholder={input.placeholder}
              disabled={input.disabled}
              rounded={input.rounded}
              pill={input.pill}
              button={input.button}
              buttonVariant={input.buttonVariant}
            />
          </div>
        ) : null}

        {selection === "nav-card" ? (
          <NavCard
            liveLocation={navCard.liveLocation}
            variant={navCard.variant}
            expandable={navCard.expandable}
          />
        ) : null}

        {selection === "bubble" ? (
          <div className="flex w-full max-w-md flex-col">
            <Bubble
              variant={bubble.variant}
              size={bubble.size}
              align={bubble.align}
              pill={bubble.pill}
            >
              <BubbleContent>{bubble.content}</BubbleContent>
            </Bubble>
          </div>
        ) : null}

        {selection === "avatar" ? (
          <div className="flex w-full max-w-[568px] flex-col gap-4">
            <p className="text-xs font-medium text-gray-10">Team</p>
            <div className="flex flex-col gap-1">
              {PLAYGROUND_AVATAR_MEMBERS.map((member, index) => (
                <AvatarPerson
                  key={member.name}
                  name={index === 0 ? avatar.name : member.name}
                  role={index === 0 ? avatar.role : member.role}
                  src={
                    avatar.showImage
                      ? index === 0
                        ? avatar.src || undefined
                        : member.src
                      : undefined
                  }
                  size={avatar.size}
                />
              ))}
            </div>
          </div>
        ) : null}

        {selection === "tabs" ? (
          <div className="w-full max-w-md">
            <Tabs
              key={`${tabs.variant}-${tabs.orientation}`}
              defaultValue="one"
              orientation={tabs.orientation}
              className={tabs.variant === "pills" ? "gap-0" : undefined}
            >
              <TabsList variant={tabs.variant} aria-label="Playground tabs">
                {TABS_ITEMS.map((item) => (
                  <TabsTrigger key={item.value} value={item.value}>
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TABS_ITEMS.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                  {item.content}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : null}

        {selection === "home-tabs-header" ? <PlaygroundHomeTabsHeader /> : null}

        {selection === "image" ? (
          <div className="w-full max-w-[568px]">
            <Image
              src="/notes/finding-flow-1.webp"
              alt="Person standing beside a bicycle on a beach at sunset"
              width={1200}
              height={899}
              sizes="568px"
              caption={image.caption || undefined}
              captionAlign={image.captionAlign}
              glow={image.glow}
              overlay={image.overlay}
              radius={image.radius}
              stroke={image.stroke}
            />
          </div>
        ) : null}

        {selection === "video-player" ? (
          <PlaygroundVideoPlayer
            autoplayOnHover={videoPlayer.autoplayOnHover}
            caption={videoPlayer.caption}
            glow={videoPlayer.glow}
            loop={videoPlayer.loop}
            overlay={videoPlayer.overlay}
            showMuteButton={videoPlayer.showMuteButton}
          />
        ) : null}

        {selection === "work-row" ? (
          <div className="w-full max-w-[568px]">
            <WorkRow
              icon={workRow.icon}
              role={workRow.role}
              company={
                workPreview?.company ?? {
                  name: workRow.company,
                  href: "#",
                  accent: "purple",
                }
              }
              via={
                workRow.via
                  ? {
                      name: workRow.via,
                      href: "#",
                      accent:
                        workPreview?.via?.accent ??
                        workPreview?.company.accent ??
                        "purple",
                    }
                  : undefined
              }
              dates={workRow.dates}
              description={workRow.description}
              media={workPreview?.media}
              viewProject={workPreview?.viewProject}
              assetCount={workPreview?.assetCount}
            />
          </div>
        ) : null}

        {selection === "book-row" ? (
          <div className="w-full max-w-[568px]">
            <BookRow book={PLAYGROUND_BOOK} />
          </div>
        ) : null}

        {selection === "music-row" ? (
          <div className="w-full max-w-[568px]">
            <MusicRow track={PLAYGROUND_MUSIC_TRACK} />
          </div>
        ) : null}

        {selection === "stack-row" ? (
          <div className="w-full max-w-[568px]">
            <StackRow item={stackPreview} />
          </div>
        ) : null}

        {selection === "object-row" ? (
          <div className="w-full max-w-[568px]">
            <ObjectRow item={objectPreview} />
          </div>
        ) : null}

        {selection === "play-row" ? (
          <div className="w-full max-w-[568px]">
            <PlayRow
              href={PLAY_ITEMS[0].href}
              date={playRow.date}
              text={playRow.text}
              media={PLAY_ITEMS.flatMap((item) => item.media)}
              mediaKind={playRow.mediaKind}
              mediaCount={playRow.mediaCount}
            />
          </div>
        ) : null}

        {selection === "note-like" ? (
          <NoteLikeButton
            liked={noteLike.liked}
            count={noteLike.count}
            onLikedChange={(liked) =>
              setNoteLike((current) => ({ ...current, liked }))
            }
            onCountChange={(count) =>
              setNoteLike((current) => ({ ...current, count }))
            }
          />
        ) : null}

        {selection === "mini-beni-typing" ? (
          <PlaygroundMiniBeniTypingIndicator />
        ) : null}
      </main>

      <aside className="flex min-h-0 flex-col shadow-[inset_0.5px_0_0_0_var(--gray-5)]">
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 py-5">
          {selection === "color" ? (
            <>
              <Field label="Name">
                <span className="h-8 inline-flex items-center text-sm text-foreground">
                  {inspectedColor}
                </span>
              </Field>
              <HexField
                value={
                  colorOverrides[inspectedColor] ??
                  defaultPaletteHex(
                    inspectedColor,
                    playgroundTheme === "system"
                      ? systemTheme
                      : playgroundTheme,
                  )
                }
                onChange={(value) =>
                  setColorOverrides((current) => ({
                    ...current,
                    [inspectedColor]: value,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "shadow" ? (
            <>
              <Field label="Name">
                <span className="h-8 inline-flex items-center text-sm text-foreground">
                  {`--shadow-${shadowToken}`}
                </span>
              </Field>
              <Field label="role">
                <span className="h-8 inline-flex items-center text-sm text-foreground">
                  {SHADOW_TOKEN_ROLES[shadowToken]}
                </span>
              </Field>
            </>
          ) : null}

          {selection === "typography" ? (
            <>
              <Field label="size">
                <input
                  type="number"
                  min={8}
                  max={96}
                  value={typeSizes[typeToken]}
                  onChange={(event) =>
                    setTypeSizes((current) => ({
                      ...current,
                      [typeToken]: Number(event.target.value),
                    }))
                  }
                  className="h-8 w-16 bg-transparent text-right text-sm tabular-nums text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="weight"
                value={typeWeight}
                options={TYPE_WEIGHTS}
                onChange={(value) => setTypeWeight(value as TypeWeight)}
              />
            </>
          ) : null}

          {selection === "button" ? (
            <>
              <InspectorSelect
                label="variant"
                value={button.variant}
                options={BUTTON_VARIANTS}
                onChange={(value) =>
                  setButton((current) => ({
                    ...current,
                    variant: value as ButtonVariant,
                  }))
                }
              />
              <InspectorSelect
                label="size"
                value={button.size}
                options={BUTTON_SIZES}
                onChange={(value) =>
                  setButton((current) => ({
                    ...current,
                    size: value as ButtonSize,
                  }))
                }
              />
              {isIconSize ? null : (
                <Field label="label">
                  <input
                    value={button.label}
                    onChange={(event) =>
                      setButton((current) => ({
                        ...current,
                        label: event.target.value,
                      }))
                    }
                    className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                  />
                </Field>
              )}
              {isIconSize ? null : (
                <InspectorCheck
                  label="icon"
                  checked={button.leading}
                  onToggle={() =>
                    setButton((current) => ({
                      ...current,
                      leading: !current.leading,
                    }))
                  }
                />
              )}
              <InspectorCheck
                label="rounded"
                checked={button.rounded}
                onToggle={() =>
                  setButton((current) => ({
                    ...current,
                    rounded: !current.rounded,
                  }))
                }
              />
              <InspectorCheck
                label="loading"
                checked={button.loading}
                onToggle={() =>
                  setButton((current) => ({
                    ...current,
                    loading: !current.loading,
                  }))
                }
              />
              <InspectorCheck
                label="disabled"
                checked={button.disabled}
                onToggle={() =>
                  setButton((current) => ({
                    ...current,
                    disabled: !current.disabled,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "dropdown" ? (
            <>
              <InspectorCheck
                label="icon"
                checked={dropdown.icon}
                onToggle={() =>
                  setDropdown((current) => ({
                    ...current,
                    icon: !current.icon,
                  }))
                }
              />
              <InspectorCheck
                label="chevron"
                checked={dropdown.chevron}
                onToggle={() =>
                  setDropdown((current) => ({
                    ...current,
                    chevron: !current.chevron,
                  }))
                }
              />
              <InspectorCheck
                label="disabled"
                checked={dropdown.disabled}
                onToggle={() =>
                  setDropdown((current) => ({
                    ...current,
                    disabled: !current.disabled,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "tooltip" ? (
            <>
              <Field label="content">
                <input
                  value={tooltip.content}
                  onChange={(event) =>
                    setTooltip((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorCheck
                label="arrow"
                checked={tooltip.arrow}
                onToggle={() =>
                  setTooltip((current) => ({
                    ...current,
                    arrow: !current.arrow,
                  }))
                }
              />
              <InspectorCheck
                label="instant"
                checked={tooltip.instant}
                onToggle={() =>
                  setTooltip((current) => ({
                    ...current,
                    instant: !current.instant,
                  }))
                }
              />
              <InspectorCheck
                label="delay"
                checked={tooltip.delay}
                onToggle={() =>
                  setTooltip((current) => ({
                    ...current,
                    delay: !current.delay,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "checkbox" ? (
            <>
              <Field label="label">
                <input
                  value={checkbox.label}
                  onChange={(event) =>
                    setCheckbox((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorCheck
                label="checked"
                checked={checkbox.checked}
                onToggle={() =>
                  setCheckbox((current) => ({
                    ...current,
                    checked: !current.checked,
                  }))
                }
              />
              <InspectorCheck
                label="disabled"
                checked={checkbox.disabled}
                onToggle={() =>
                  setCheckbox((current) => ({
                    ...current,
                    disabled: !current.disabled,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "input" ? (
            <>
              <Field label="placeholder">
                <input
                  value={input.placeholder}
                  onChange={(event) =>
                    setInput((current) => ({
                      ...current,
                      placeholder: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="type"
                value={input.type}
                options={INPUT_TYPES}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    type: value as InputType,
                  }))
                }
              />
              <InspectorSelect
                label="size"
                value={input.size}
                options={INPUT_SIZES}
                onChange={(value) =>
                  setInput((current) => ({
                    ...current,
                    size: value as InputSize,
                  }))
                }
              />
              <InspectorCheck
                label="rounded"
                checked={input.rounded}
                onToggle={() =>
                  setInput((current) => ({
                    ...current,
                    rounded: !current.rounded,
                  }))
                }
              />
              <InspectorCheck
                label="pill"
                checked={input.pill}
                onToggle={() =>
                  setInput((current) => ({
                    ...current,
                    pill: !current.pill,
                  }))
                }
              />
              <InspectorCheck
                label="button"
                checked={input.button}
                onToggle={() =>
                  setInput((current) => ({
                    ...current,
                    button: !current.button,
                  }))
                }
              />
              {input.button ? (
                <InspectorSelect
                  label="button variant"
                  value={input.buttonVariant}
                  options={BUTTON_VARIANTS}
                  onChange={(value) =>
                    setInput((current) => ({
                      ...current,
                      buttonVariant: value as ButtonVariant,
                    }))
                  }
                />
              ) : null}
              <InspectorCheck
                label="disabled"
                checked={input.disabled}
                onToggle={() =>
                  setInput((current) => ({
                    ...current,
                    disabled: !current.disabled,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "nav-card" ? (
            <>
              <InspectorSelect
                label="variant"
                value={navCard.variant}
                options={NAV_CARD_VARIANTS}
                onChange={(value) =>
                  setNavCard((current) => ({
                    ...current,
                    variant: value as NavCardVariant,
                  }))
                }
              />
              <InspectorCheck
                label="live location"
                checked={navCard.liveLocation}
                onToggle={() =>
                  setNavCard((current) => ({
                    ...current,
                    liveLocation: !current.liveLocation,
                  }))
                }
              />
              <InspectorCheck
                label="expandable"
                checked={navCard.expandable}
                onToggle={() =>
                  setNavCard((current) => ({
                    ...current,
                    expandable: !current.expandable,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "bubble" ? (
            <>
              <Field label="content">
                <input
                  value={bubble.content}
                  onChange={(event) =>
                    setBubble((current) => ({
                      ...current,
                      content: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="variant"
                value={bubble.variant}
                options={BUBBLE_VARIANTS}
                onChange={(value) =>
                  setBubble((current) => ({
                    ...current,
                    variant: value as BubbleVariant,
                  }))
                }
              />
              <InspectorSelect
                label="size"
                value={bubble.size}
                options={BUBBLE_SIZES}
                onChange={(value) =>
                  setBubble((current) => ({
                    ...current,
                    size: value as BubbleSize,
                  }))
                }
              />
              <InspectorSelect
                label="align"
                value={bubble.align}
                options={BUBBLE_ALIGNS}
                onChange={(value) =>
                  setBubble((current) => ({
                    ...current,
                    align: value as BubbleAlign,
                  }))
                }
              />
              <InspectorCheck
                label="pill"
                checked={bubble.pill}
                onToggle={() =>
                  setBubble((current) => ({
                    ...current,
                    pill: !current.pill,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "avatar" ? (
            <>
              <Field label="name">
                <input
                  value={avatar.name}
                  onChange={(event) =>
                    setAvatar((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <Field label="role">
                <input
                  value={avatar.role}
                  onChange={(event) =>
                    setAvatar((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="size"
                value={avatar.size}
                options={AVATAR_SIZES}
                onChange={(value) =>
                  setAvatar((current) => ({
                    ...current,
                    size: value as AvatarSize,
                  }))
                }
              />
              <InspectorCheck
                label="image"
                checked={avatar.showImage}
                onToggle={() =>
                  setAvatar((current) => ({
                    ...current,
                    showImage: !current.showImage,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "tabs" ? (
            <>
              <InspectorSelect
                label="variant"
                value={tabs.variant}
                options={TABS_VARIANTS}
                onChange={(value) =>
                  setTabs((current) => ({
                    ...current,
                    variant: value as TabsVariant,
                  }))
                }
              />
              <InspectorSelect
                label="orientation"
                value={tabs.orientation}
                options={TABS_ORIENTATIONS}
                onChange={(value) =>
                  setTabs((current) => ({
                    ...current,
                    orientation: value as TabsOrientation,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "stack-row" ? (
            <InspectorSelect
              label="app"
              value={stackPreview.name}
              options={STACK_ITEM_NAMES}
              onChange={(value) => {
                const item = STACK_ITEMS.find(
                  (stackItem) => stackItem.name === value,
                );
                if (!item) return;
                setStackRow(item.id);
              }}
            />
          ) : null}

          {selection === "object-row" ? (
            <InspectorSelect
              label="object"
              value={objectPreview.name}
              options={OBJECT_ITEM_NAMES}
              onChange={(value) => {
                const item = OBJECT_ITEMS.find(
                  (objectItem) => objectItem.name === value,
                );
                if (!item) return;
                setObjectRow(item.id);
              }}
            />
          ) : null}

          {selection === "work-row" ? (
            <>
              <InspectorSelect
                label="Company"
                value={workPreview?.company.name ?? workRow.company}
                options={WORK_COMPANY_NAMES}
                onChange={(value) => {
                  const item = WORK_ITEMS.find(
                    (workItem) => workItem.company.name === value,
                  );
                  if (!item) return;

                  setWorkRow({
                    icon: item.icon,
                    role: item.role,
                    company: item.company.name,
                    via: item.via?.name ?? "",
                    dates: item.dates,
                    description: item.description,
                  });
                }}
              />
              <Field label="role">
                <input
                  value={workRow.role}
                  onChange={(event) =>
                    setWorkRow((current) => ({
                      ...current,
                      role: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <Field label="via">
                <input
                  value={workRow.via}
                  onChange={(event) =>
                    setWorkRow((current) => ({
                      ...current,
                      via: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <Field label="dates">
                <input
                  value={workRow.dates}
                  onChange={(event) =>
                    setWorkRow((current) => ({
                      ...current,
                      dates: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <Field label="description">
                <input
                  value={workRow.description}
                  onChange={(event) =>
                    setWorkRow((current) => ({
                      ...current,
                      description: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
            </>
          ) : null}

          {selection === "play-row" ? (
            <>
              <Field label="text">
                <input
                  value={playRow.text}
                  onChange={(event) =>
                    setPlayRow((current) => ({
                      ...current,
                      text: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <Field label="date">
                <input
                  value={playRow.date}
                  onChange={(event) =>
                    setPlayRow((current) => ({
                      ...current,
                      date: event.currentTarget.value,
                    }))
                  }
                  className="h-8 w-24 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="media"
                value={playRow.mediaKind}
                options={PLAY_MEDIA_KINDS}
                onChange={(value) =>
                  setPlayRow((current) => ({
                    ...current,
                    mediaKind: value as PlayMediaSelection,
                  }))
                }
              />
              <Field label="media count">
                <input
                  type="number"
                  min={0}
                  value={playRow.mediaCount}
                  onChange={(event) =>
                    setPlayRow((current) => ({
                      ...current,
                      mediaCount: Math.max(0, Number(event.target.value)),
                    }))
                  }
                  className="h-8 w-16 bg-transparent text-right text-sm tabular-nums text-foreground outline-none"
                />
              </Field>
            </>
          ) : null}

          {selection === "image" ? (
            <>
              <Field label="caption">
                <input
                  value={image.caption}
                  onChange={(event) =>
                    setImage((current) => ({
                      ...current,
                      caption: event.target.value,
                    }))
                  }
                  className="h-8 w-32 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorSelect
                label="caption align"
                value={image.captionAlign}
                options={["start", "center"] as const}
                onChange={(value) =>
                  setImage((current) => ({
                    ...current,
                    captionAlign: value as "start" | "center",
                  }))
                }
              />
              <InspectorCheck
                label="glow"
                checked={image.glow}
                onToggle={() =>
                  setImage((current) => ({
                    ...current,
                    glow: !current.glow,
                  }))
                }
              />
              <InspectorCheck
                label="overlay"
                checked={image.overlay}
                onToggle={() =>
                  setImage((current) => ({
                    ...current,
                    overlay: !current.overlay,
                  }))
                }
              />
              <Field label="radius">
                <input
                  type="number"
                  min={0}
                  value={image.radius}
                  onChange={(event) =>
                    setImage((current) => ({
                      ...current,
                      radius: Math.max(0, Number(event.target.value)),
                    }))
                  }
                  className="h-8 w-16 bg-transparent text-right text-sm tabular-nums text-foreground outline-none"
                />
              </Field>
              <InspectorCheck
                label="stroke"
                checked={image.stroke}
                onToggle={() =>
                  setImage((current) => ({
                    ...current,
                    stroke: !current.stroke,
                  }))
                }
              />
            </>
          ) : null}

          {selection === "note-like" ? (
            <>
              <InspectorCheck
                label="liked"
                checked={noteLike.liked}
                onToggle={() =>
                  setNoteLike((current) => ({
                    ...current,
                    liked: !current.liked,
                  }))
                }
              />
              <Field label="count">
                <input
                  type="number"
                  min={0}
                  value={noteLike.count}
                  onChange={(event) =>
                    setNoteLike((current) => ({
                      ...current,
                      count: Math.max(0, Number(event.target.value)),
                    }))
                  }
                  className="h-8 w-16 bg-transparent text-right text-sm tabular-nums text-foreground outline-none"
                />
              </Field>
            </>
          ) : null}

          {selection === "video-player" ? (
            <>
              <Field label="caption">
                <input
                  value={videoPlayer.caption}
                  onChange={(event) =>
                    setVideoPlayer((current) => ({
                      ...current,
                      caption: event.target.value,
                    }))
                  }
                  className="h-8 w-32 bg-transparent text-right text-sm text-foreground outline-none"
                />
              </Field>
              <InspectorCheck
                label="glow"
                checked={videoPlayer.glow}
                onToggle={() =>
                  setVideoPlayer((current) => ({
                    ...current,
                    glow: !current.glow,
                  }))
                }
              />
              <InspectorCheck
                label="autoplay on hover"
                checked={videoPlayer.autoplayOnHover}
                onToggle={() =>
                  setVideoPlayer((current) => ({
                    ...current,
                    autoplayOnHover: !current.autoplayOnHover,
                  }))
                }
              />
              <InspectorCheck
                label="loop"
                checked={videoPlayer.loop}
                onToggle={() =>
                  setVideoPlayer((current) => ({
                    ...current,
                    loop: !current.loop,
                  }))
                }
              />
              <InspectorCheck
                label="overlay"
                checked={videoPlayer.overlay}
                onToggle={() =>
                  setVideoPlayer((current) => ({
                    ...current,
                    overlay: !current.overlay,
                  }))
                }
              />
              <InspectorCheck
                label="mute button"
                checked={videoPlayer.showMuteButton}
                onToggle={() =>
                  setVideoPlayer((current) => ({
                    ...current,
                    showMuteButton: !current.showMuteButton,
                  }))
                }
              />
            </>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function ShadowSwatch({
  name,
  current,
  onSelect,
}: {
  name: ShadowTokenName;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`shadow ${name}`}
      aria-current={current ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "size-16 rounded-md bg-card outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        current && "outline outline-1 outline-offset-2 outline-foreground"
      )}
      style={{ boxShadow: `var(--shadow-${name})` }}
    />
  );
}

function ColorSwatch({
  token,
  current,
  onSelect,
}: {
  token: PaletteToken;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={token}
      aria-current={current ? "true" : undefined}
      onClick={onSelect}
      className={cn(
        "relative aspect-square overflow-hidden rounded-md outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        current && "outline outline-1 outline-offset-2 outline-foreground",
        isAlphaToken(token) &&
          "bg-[image:repeating-conic-gradient(var(--gray-4)_0_25%,var(--gray-2)_0_50%)] bg-[size:8px_8px]"
      )}
      style={{
        backgroundColor: isAlphaToken(token)
          ? undefined
          : `var(--${token})`,
      }}
    >
      {isAlphaToken(token) ? (
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundColor: `var(--${token})` }}
        />
      ) : null}
    </button>
  );
}

function NestedList({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[15px] w-px bg-gray-4"
      />
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function NavSection({
  label,
  icon: Icon,
  defaultOpen = true,
  className,
  children,
}: {
  label: string;
  icon: IconComponent;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className={cn("group/section", className)}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center gap-1.5 rounded-md px-2 py-1 text-sm font-normal text-muted-foreground outline-none select-none",
          "hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
          "[&::-webkit-details-marker]:hidden [&::marker]:hidden"
        )}
      >
        <span aria-hidden className="inline-flex shrink-0">
          <Icon size={14} />
        </span>
        {label}
        <span aria-hidden className="ms-auto inline-flex shrink-0">
          <ChevronDown
            size={14}
            className="-rotate-90 transition-transform duration-80 group-open/section:rotate-0"
          />
        </span>
      </summary>
      <NestedList>{children}</NestedList>
    </details>
  );
}

function NavItem({
  label,
  current,
  nested = false,
  custom = false,
  onClick,
}: {
  label: string;
  current: boolean;
  nested?: boolean;
  /** Marks a playground item that is not from shadcn. */
  custom?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={current ? "true" : undefined}
      aria-label={custom ? `${label}, custom component` : undefined}
      className={cn(
        "rounded-md py-1 text-left outline-none hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        nested ? "px-7" : "px-2",
        current ? "text-foreground" : "text-muted-foreground",
        custom && "flex items-center gap-1.5"
      )}
    >
      {label}
      {custom ? (
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-red-9"
        />
      ) : null}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className={inspectorRowClassName}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function InspectorSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className={inspectorRowClassName}>
      <span>{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8">
            {value}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {options.map((option) => (
            <DropdownMenuItem key={option} onSelect={() => onChange(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function InspectorCheck({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className={inspectorRowClassName}>
      <span>{label}</span>
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle()}
      />
    </label>
  );
}

function HexField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field label="hex">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-[7.5rem] bg-transparent text-right font-sans text-sm tabular-nums text-foreground outline-none"
        spellCheck={false}
      />
    </Field>
  );
}
