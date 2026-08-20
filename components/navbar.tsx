"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { NavCard } from "@/components/nav-card";
import { Button } from "@/components/ui/button";
import {
  PRIMARY_NAV_ITEMS,
  isNavActive,
  type PrimaryNavItem,
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
          <NavCard
            href="/"
            variant={pathname === "/" ? "full" : "compact"}
          />
        </div>
        <nav
          aria-label="Primary"
          className="flex min-w-0 items-center justify-end gap-2 overflow-x-auto p-2"
        >
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={isNavActive(pathname, item.href, item.external)}
            />
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

function NavLink({
  item,
  active,
}: {
  item: PrimaryNavItem;
  active: boolean;
}) {
  const className = cn(
    "font-normal",
    active
      ? "bg-muted text-foreground dark:bg-muted/50"
      : "text-muted-foreground"
  );

  if (item.external) {
    return (
      <Button asChild variant="ghost" rounded={9999} className={className}>
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          {item.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant="ghost" rounded={9999} className={className}>
      <Link href={item.href} aria-current={active ? "page" : undefined}>
        {item.label}
      </Link>
    </Button>
  );
}
