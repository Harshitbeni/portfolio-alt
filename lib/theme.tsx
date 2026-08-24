"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import {
  applyTimeSky,
  clearTimeSky,
  getTimeSkyAppearance,
} from "@/lib/time-sky";

export type Theme = "light" | "dark";
export type Appearance = "system" | "time";

const APPEARANCE_KEY = "appearance";
const APPEARANCE_CHANGE = "appearance-change";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getAppearance(): Appearance {
  try {
    return localStorage.getItem(APPEARANCE_KEY) === "time" ? "time" : "system";
  } catch {
    return "system";
  }
}

function isTimeActive(appearance: Appearance, pathname: string) {
  return appearance === "time" && pathname === "/";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function applyAppearance(pathname: string) {
  const timeActive = isTimeActive(getAppearance(), pathname);
  document.documentElement.toggleAttribute("data-time-mode", timeActive);

  if (timeActive) {
    applyTimeSky();
    return;
  }

  clearTimeSky();
  applyTheme(getSystemTheme());
}

function withoutColorTransitions(update: () => void) {
  const style = document.createElement("style");
  style.append(
    document.createTextNode("*,*::before,*::after{transition:none !important}")
  );
  document.head.append(style);
  update();
  void document.body.offsetHeight;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      style.remove();
    });
  });
}

function subscribeSystem(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (!isTimeActive(getAppearance(), window.location.pathname)) {
      applyTheme(media.matches ? "dark" : "light");
    }
    onStoreChange();
  };
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
  };
}

function subscribeAppearance(onStoreChange: () => void) {
  const onChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === APPEARANCE_KEY) onChange();
  };
  window.addEventListener(APPEARANCE_CHANGE, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(APPEARANCE_CHANGE, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const ThemeContext = createContext<{
  theme: Theme;
  appearance: Appearance;
  timeActive: boolean;
  setAppearance: (appearance: Appearance) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const appearance = useSyncExternalStore(
    subscribeAppearance,
    getAppearance,
    () => "system" as const
  );
  const systemTheme = useSyncExternalStore(
    subscribeSystem,
    getSystemTheme,
    () => "light" as const
  );
  const timeActive = isTimeActive(appearance, pathname);
  const theme: Theme = timeActive ? getTimeSkyAppearance() : systemTheme;

  useEffect(() => {
    applyAppearance(pathname);
  }, [pathname]);

  const setAppearance = useCallback(
    (next: Appearance) => {
      withoutColorTransitions(() => {
        try {
          if (next === "time") {
            localStorage.setItem(APPEARANCE_KEY, "time");
          } else {
            localStorage.removeItem(APPEARANCE_KEY);
          }
        } catch {
          // Ignore storage errors (private mode, etc).
        }
        applyAppearance(pathname);
      });
      window.dispatchEvent(new Event(APPEARANCE_CHANGE));
    },
    [pathname]
  );

  const value = useMemo(
    () => ({ theme, appearance, timeActive, setAppearance }),
    [theme, appearance, timeActive, setAppearance]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
