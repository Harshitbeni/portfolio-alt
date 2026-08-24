import Image from "next/image";
import type { StackItem } from "@/lib/stack";

export function StackRow({
  item,
}: {
  item: StackItem;
}) {
  return (
    <a
      className="group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      href={item.href}
      target="_blank"
      rel="noreferrer"
    >
      <span className="relative block size-12 shrink-0">
        <span className="absolute inset-0 overflow-hidden rounded-[12px] bg-gray-2">
          <Image
            alt=""
            src={item.iconSrc}
            fill
            sizes="48px"
            className="object-cover"
            aria-hidden
          />
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] rounded-[12px] border border-gray-a6"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {item.name}
        </span>
        <span className="text-pretty text-sm leading-5 font-normal text-gray-a10">
          {item.description}
        </span>
      </span>
    </a>
  );
}
