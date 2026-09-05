"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import {
  NELSON_CHILD,
  NELSON_CONTAINER,
  nelsonChildClassName,
  useNelsonTextTransition,
} from "@/components/nelson-text-transition";

function RestHomeStagger({
  header,
  intro,
  tabs,
}: {
  header: ReactNode;
  intro: ReactNode;
  tabs: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <div className="flex w-full flex-col items-start px-3">{header}</div>
      </div>
      <div>
        <div className="px-4">{intro}</div>
      </div>
      <div className="mt-6">{tabs}</div>
    </div>
  );
}

function NelsonHomeStagger({
  header,
  intro,
  tabs,
}: {
  header: ReactNode;
  intro: ReactNode;
  tabs: ReactNode;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPlay(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const lines = [
    {
      key: "header",
      className: nelsonChildClassName,
      node: (
        <div className="flex w-full flex-col items-start px-3">{header}</div>
      ),
    },
    {
      key: "intro",
      className: nelsonChildClassName,
      node: <div className="px-4">{intro}</div>,
    },
    {
      key: "tabs",
      className: `${nelsonChildClassName} mt-6`,
      node: tabs,
    },
  ];

  return (
    <motion.div
      className="flex w-full flex-col gap-6"
      inherit={false}
      initial={NELSON_CONTAINER.initial}
      animate={play ? NELSON_CONTAINER.visible : NELSON_CONTAINER.initial}
    >
      {lines.map((line, index) => (
        <motion.div
          key={line.key}
          className={line.className}
          inherit={false}
          initial={NELSON_CHILD.initial}
          animate={
            play
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.06,
                    y: NELSON_CHILD.visible.transition.y,
                  },
                }
              : NELSON_CHILD.initial
          }
        >
          {line.node}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function HomeStagger({
  header,
  intro,
  tabs,
}: {
  header: ReactNode;
  intro: ReactNode;
  tabs: ReactNode;
}) {
  const { reducedMotion } = useNelsonTextTransition();

  if (reducedMotion) {
    return <RestHomeStagger header={header} intro={intro} tabs={tabs} />;
  }

  return <NelsonHomeStagger header={header} intro={intro} tabs={tabs} />;
}
