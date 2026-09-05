"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  NELSON_CHILD,
  NELSON_CONTAINER,
  NELSON_EXIT,
  NELSON_EXIT_TRANSITION,
  NELSON_STAGGER,
  nelsonChildClassName,
  useNelsonTextTransition,
} from "@/components/nelson-text-transition";

type NoteStaggerContent = {
  home: ReactNode;
  title: string;
  date: string;
  children: ReactNode;
};

function RestNoteStagger({ home, title, date, children }: NoteStaggerContent) {
  return (
    <div>
      <div className="mb-4">{home}</div>
      <h1 className="mb-1 text-xl-medium text-gray-a12">{title}</h1>
      <p className="mb-8 text-sm leading-5 text-gray-a10">{date}</p>
      <div>{children}</div>
    </div>
  );
}

function NelsonNoteStagger({
  home,
  title,
  date,
  children,
}: NoteStaggerContent) {
  return (
    <motion.div initial="initial" animate="visible" variants={NELSON_STAGGER}>
      <motion.div
        className={`${nelsonChildClassName} mb-4`}
        variants={NELSON_CHILD}
      >
        {home}
      </motion.div>
      <motion.h1
        className={`${nelsonChildClassName} mb-1 text-xl-medium text-gray-a12`}
        variants={NELSON_CHILD}
      >
        {title}
      </motion.h1>
      <motion.p
        className={`${nelsonChildClassName} mb-8 text-sm leading-5 text-gray-a10`}
        variants={NELSON_CHILD}
      >
        {date}
      </motion.p>
      <motion.div className={nelsonChildClassName} variants={NELSON_CHILD}>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function NoteNelsonPresence({ children }: { children: ReactNode }) {
  const { reducedMotion } = useNelsonTextTransition();

  if (reducedMotion) {
    return children;
  }

  return (
    <div className="grid">
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}

export function NoteNelsonPage({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { reducedMotion } = useNelsonTextTransition();

  if (reducedMotion) {
    return children;
  }

  return (
    <motion.div
      key={pathname}
      className="col-start-1 row-start-1"
      inherit={false}
      variants={NELSON_CONTAINER}
      initial="initial"
      animate="visible"
      exit={NELSON_EXIT}
      transition={NELSON_EXIT_TRANSITION}
    >
      {children}
    </motion.div>
  );
}

export function NoteStagger({
  home,
  title,
  date,
  children,
}: NoteStaggerContent & { slug: string }) {
  const { reducedMotion } = useNelsonTextTransition();
  if (reducedMotion) {
    return (
      <RestNoteStagger home={home} title={title} date={date}>
        {children}
      </RestNoteStagger>
    );
  }

  return (
    <NelsonNoteStagger home={home} title={title} date={date}>
      {children}
    </NelsonNoteStagger>
  );
}
