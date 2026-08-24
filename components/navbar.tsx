"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { NavCard } from "@/components/nav-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RESUME_HREF,
  RESUME_PDF_HREF,
  isNavActive,
} from "@/lib/primary-nav";
import { cn } from "@/lib/utils";

const ENTER = {
  opacity: 1,
  y: 0,
} as const;

const ENTER_FROM = {
  opacity: 0.001,
  y: -96,
} as const;

const ENTER_TRANSITION = {
  type: "spring" as const,
  duration: 0.4,
  bounce: 0.2,
};

export function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const resumeActive = isNavActive(pathname, RESUME_HREF);

  if (pathname === "/") {
    return null;
  }

  return (
    <motion.header
      initial={reduceMotion ? false : ENTER_FROM}
      animate={ENTER}
      transition={reduceMotion ? { duration: 0 } : ENTER_TRANSITION}
      aria-label="Site"
      className="group/nav sticky top-0 z-50 w-full overflow-visible bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-[24px] supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 overflow-visible p-2">
        <div className="relative shrink-0 overflow-visible">
          <NavCard href="/" variant="compact" />
        </div>
        <nav
          aria-label="Primary"
          className="flex min-w-0 items-center justify-end p-2"
        >
          <ResumeNav active={resumeActive} />
        </nav>
      </div>
    </motion.header>
  );
}

function ResumeNav({ active }: { active: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          rounded={9999}
          chevron
          className={cn(
            "font-normal",
            active
              ? "bg-muted text-foreground dark:bg-muted/50"
              : "text-muted-foreground"
          )}
        >
          resume
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max min-w-36">
        <DropdownMenuItem asChild>
          <a href={RESUME_PDF_HREF} download="Harshit-Beniwal-Resume.pdf">
            Download
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={RESUME_HREF}>View online</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
