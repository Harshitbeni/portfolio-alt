export const HOME_OTHER_TABS_SPACING_LEFT = 12;

export const HOME_TABS_TRANSITION_DURATION = 160;

export const HOME_TABS_MOBILE_BREAKPOINT = 640;

export const HOME_TABS_STACK_OVERLAP = 28;

export const HOME_TABS_STACK_DURATION = 240;

export const HOME_TABS_STACK_STAGGER = 24;

export const HOME_TABS = [
  { value: "work", label: "Work" },
  { value: "play", label: "Play" },
  { value: "notes", label: "Notes" },
  { value: "others", label: "Others" },
] as const;

export type HomeTab = (typeof HOME_TABS)[number]["value"];

export const OTHER_TABS = [
  { value: "books", label: "Books" },
  { value: "music", label: "Music" },
  { value: "stack", label: "Stack" },
  { value: "objects", label: "Objects" },
] as const;

export type OtherTab = (typeof OTHER_TABS)[number]["value"];

export function isHomeTab(value: string | null): value is HomeTab {
  return HOME_TABS.some((item) => item.value === value);
}

export function isOtherTab(value: string | null): value is OtherTab {
  return OTHER_TABS.some((item) => item.value === value);
}

export function homeTabFromParam(value: string | null): HomeTab {
  if (isOtherTab(value)) return "others";
  if (isHomeTab(value) && value !== "others") return value;
  return HOME_TABS[0].value;
}
