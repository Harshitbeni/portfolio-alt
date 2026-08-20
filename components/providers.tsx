"use client";

import { IconProvider } from "@/lib/icon-context";
import { ThemeProvider } from "@/lib/theme";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <IconProvider>{children}</IconProvider>
    </ThemeProvider>
  );
}
