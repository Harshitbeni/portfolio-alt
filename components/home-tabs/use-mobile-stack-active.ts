"use client";

import { useSyncExternalStore } from "react";

function getMobileStackMediaQuery(breakpoint: number) {
  return `(max-width: ${breakpoint - 1}px)`;
}

export function useMobileStackActive(enabled: boolean, breakpoint: number) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!enabled) {
        return () => {};
      }

      const mediaQuery = window.matchMedia(getMobileStackMediaQuery(breakpoint));
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () => {
      if (!enabled) {
        return false;
      }

      return window.matchMedia(getMobileStackMediaQuery(breakpoint)).matches;
    },
    () => false,
  );
}
