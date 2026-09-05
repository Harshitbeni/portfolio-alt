"use client";

import { StackRow } from "@/components/stack-row";
import { STACK_ITEMS, STACK_SECTIONS, type StackSection } from "@/lib/stack";

const SECTION_LABELS: Record<StackSection, string> = {
  work: "Work",
  utility: "Utility",
  life: "Life",
};

export function StackPanel() {
  return (
    <div className="flex w-full flex-col gap-6">
      {STACK_SECTIONS.map((section) => {
        const items = STACK_ITEMS.filter((item) => item.section === section);

        if (items.length === 0) return null;

        return (
          <section
            key={section}
            aria-labelledby={`stack-${section}`}
            className="pb-6"
          >
            <h2
              id={`stack-${section}`}
              className="mb-6 text-xs leading-4 font-medium text-gray-a10"
            >
              {SECTION_LABELS[section]}
            </h2>
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <StackRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
