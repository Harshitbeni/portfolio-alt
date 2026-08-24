"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SiteContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[600px] flex-col gap-12 pb-12",
        isHome ? "pt-4 sm:pt-[120px]" : "pt-4 sm:pt-8",
      )}
    >
      {children}
    </div>
  );
}
