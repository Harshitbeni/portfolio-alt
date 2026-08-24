"use client";

import { StackRow } from "@/components/stack-row";
import { STACK_ITEMS } from "@/lib/stack";

export function StackPanel() {
  return (
    <div className="flex w-full flex-col gap-6">
      {STACK_ITEMS.map((item) => (
        <StackRow key={item.id} item={item} />
      ))}
    </div>
  );
}
