"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { NavCard, type NavCardVariant } from "@/components/nav-card";
import {
  Bubble,
  BubbleContent,
} from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/components/ui/dropdown-menu-item-icon";
import { fontWeights } from "@/lib/font-weight";
import { defaultIcons, filledIcons, type IconComponent, type IconName } from "@/lib/icon-context";
import { useTheme } from "@/lib/theme";
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
  TYPE_TOKEN_NAMES,
  TYPE_TOKENS,
  type TypeTokenName,
} from "@/lib/type-tokens";
import {
  SHADOW_TOKEN_NAMES,
  SHADOW_TOKEN_ROLES,
  type ShadowTokenName,
} from "@/lib/shadow-tokens";
import { cn } from "@/lib/utils";

const inspectorRowClassName =
  "flex h-8 shrink-0 items-center justify-between gap-3 text-sm text-muted-foreground";

const TYPE_TOKEN_LABELS: Record<TypeTokenName, string> = {
  sm: "SM",
  xs: "XS",
  xxs: "XXS",
};

const TYPE_PREVIEW_SENTENCE = "Harshit Beniwal is an Interface Designer.";

const Plus = defaultIcons.plus;
const Sun = defaultIcons.sun;
const Moon = defaultIcons.moon;
const Monitor = defaultIcons.monitor;
const ChevronDown = defaultIcons["chevron-down"];

type Selection =
  | "color"
  | "typography"
  | "shadow"
  | "button"
  | "dropdown"
  | "checkbox"
  | "input"
  | "nav-card"
  | "bubble";

const BUTTON_VARIANTS = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
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
const NAV_CARD_VARIANTS = ["full", "compact"] as const;
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
type TypeWeight = (typeof TYPE_WEIGHTS)[number];

export function Playground() {
  const { preference, theme, setPreference } = useTheme();
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

  return (
    <div
      style={previewStyle}
      className="grid h-dvh grid-cols-[12.5rem_minmax(0,1fr)_14rem] bg-background text-foreground"
    >
      <nav className="flex flex-col border-r border-border text-sm">
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
          </NavSection>
        </div>
        <div className="flex gap-1 px-3 pb-14 pt-4">
          <ThemeButton
            label="Light"
            current={preference === "light"}
            onClick={() => setPreference("light")}
          >
            <Sun />
          </ThemeButton>
          <ThemeButton
            label="Dark"
            current={preference === "dark"}
            onClick={() => setPreference("dark")}
          >
            <Moon />
          </ThemeButton>
          <ThemeButton
            label="System"
            current={preference === "system"}
            onClick={() => setPreference("system")}
          >
            <Monitor />
          </ThemeButton>
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
            {TYPE_TOKEN_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                aria-current={typeToken === name ? "true" : undefined}
                onClick={() => setTypeToken(name)}
                className={cn(
                  "text-left outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
                  typeToken === name
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                style={{
                  fontSize: `var(--type-${name})`,
                  fontVariationSettings: fontWeights[typeWeight],
                }}
              >
                {TYPE_PREVIEW_SENTENCE}
              </button>
            ))}
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
      </main>

      <aside className="overflow-y-auto border-l border-border px-3 py-5">
        <div className="flex flex-col gap-3">
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
                  defaultPaletteHex(inspectedColor, theme)
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

function ThemeButton({
  label,
  current,
  onClick,
  children,
}: {
  label: string;
  current: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      variant={current ? "secondary" : "ghost"}
      size="icon"
      aria-label={label}
      aria-pressed={current}
      onClick={onClick}
    >
      {children}
    </Button>
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
