"use client";

import { useReducedMotion } from "motion/react";

export const NELSON_CONTAINER = {
  initial: { filter: "blur(6px)", opacity: 0 },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      filter: { duration: 0.7 },
      opacity: { duration: 0.7 },
    },
  },
};

export const NELSON_STAGGER = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const NELSON_CHILD = {
  hidden: { opacity: 0 },
  initial: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    transition: {
      y: {
        bounce: 0,
        duration: 0.8,
        type: "spring" as const,
      },
    },
    y: 0,
  },
};

export const NELSON_EXIT = { filter: "blur(6px)", opacity: 0 };
export const NELSON_EXIT_TRANSITION = {
  duration: 0.24,
  ease: [0.4, 0, 1, 1] as const,
};

export const nelsonChildClassName = "transform-gpu will-change-transform";

export function useNelsonTextTransition() {
  return {
    reducedMotion: Boolean(useReducedMotion()),
  };
}
