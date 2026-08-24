"use client";

import { IconProvider } from "@/lib/icon-context";
import { ThemeProvider } from "@/lib/theme";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <IconProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </IconProvider>
    </ThemeProvider>
  );
}
