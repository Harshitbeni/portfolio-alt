import Image from "next/image";
import type { ObjectItem } from "@/lib/objects";

const rowClassName =
  "group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

function ObjectRowContent({ item }: { item: ObjectItem }) {
  return (
    <>
      <span className="relative block size-16 shrink-0">
        <span className="absolute inset-0 overflow-hidden rounded-[12px] bg-gray-2">
          <Image
            alt=""
            src={item.imageSrc}
            fill
            sizes="64px"
            className="object-contain"
            aria-hidden
          />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {item.name}
        </span>
        <span className="text-pretty text-sm leading-5 font-normal text-gray-a10">
          {item.description}
        </span>
      </span>
    </>
  );
}

export function ObjectRow({ item }: { item: ObjectItem }) {
  if (item.href) {
    return (
      <a
        className={rowClassName}
        href={item.href}
        target="_blank"
        rel="noreferrer"
      >
        <ObjectRowContent item={item} />
      </a>
    );
  }

  return (
    <div className={rowClassName}>
      <ObjectRowContent item={item} />
    </div>
  );
}
