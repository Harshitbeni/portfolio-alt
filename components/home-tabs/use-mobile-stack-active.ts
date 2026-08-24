"use client";

import { useEffect, useState } from "react";

export function useMobileStackActive(enabled: boolean, breakpoint: number) {
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  });

  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setActive(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [breakpoint, enabled]);

  return active;
}
