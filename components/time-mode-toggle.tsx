"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { timeModeIcons } from "@/lib/icon-context";
import { applyTimeSky } from "@/lib/time-sky";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const Sunset = timeModeIcons.sunset;
const SunsetFilled = timeModeIcons.sunsetFilled;

export function TimeModeToggle() {
  const { appearance, timeActive, setAppearance } = useTheme();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (appearance !== "time") return;

    applyTimeSky();
    const id = window.setInterval(() => applyTimeSky(), 1000);
    return () => window.clearInterval(id);
  }, [appearance]);

  const Icon = timeActive ? SunsetFilled : Sunset;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      rounded={9999}
      aria-pressed={timeActive}
      data-time-text=""
      aria-label={
        timeActive ? "Use system light and dark" : "Use time of day background"
      }
      onClick={() => setAppearance(timeActive ? "system" : "time")}
      className={cn(
        "fixed z-20 size-10 text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
        "right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "transition-[scale,color,background-color] duration-150 ease-out active:scale-[0.96]",
        "aria-pressed:text-foreground motion-reduce:transition-none motion-reduce:active:scale-100"
      )}
    >
      {reduceMotion ? (
        <Icon size={20} />
      ) : (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={timeActive ? "on" : "off"}
            initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className="inline-flex"
          >
            <Icon size={20} />
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
