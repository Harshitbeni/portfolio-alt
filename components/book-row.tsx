"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BookRating } from "@/components/book-rating";
import type { Book } from "@/lib/books";

const BOOK_COVER_SHADOW =
  "shadow-[0px_0.602187px_1.08394px_-1.16667px_rgba(0,0,0,0.68),0px_2.28853px_4.11936px_-2.33333px_rgba(0,0,0,0.61),0px_10px_18px_-3.5px_rgba(0,0,0,0.3)]";

export function BookRow({
  book,
}: {
  book: Book;
}) {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const reducedMotion = Boolean(useReducedMotion());

  return (
    <div
      className="group flex min-w-0 items-center gap-3 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      onBlur={() => setIsCoverOpen(false)}
      onFocus={() => setIsCoverOpen(true)}
      onMouseEnter={() => setIsCoverOpen(true)}
      onMouseLeave={() => setIsCoverOpen(false)}
    >
      <span
        aria-hidden
        className="relative block h-16 w-12 shrink-0"
        style={{ perspective: "500px" }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[4px] bg-gray-2">
          <Image
            alt=""
            src={book.coverSrc}
            fill
            sizes="64px"
            className="object-cover"
          />
          {isCoverOpen ? (
            <span
              className={`absolute inset-[2px] rounded-[2px] bg-white ${BOOK_COVER_SHADOW}`}
            />
          ) : null}
        </span>
        <motion.span
          animate={{
            left: isCoverOpen ? -3 : 0,
            rotateY: isCoverOpen ? -32 : 0,
            scale: isCoverOpen ? 1.04 : 1,
          }}
          className={`absolute top-0 h-16 w-12 overflow-hidden rounded-[4px] bg-gray-2${isCoverOpen ? ` ${BOOK_COVER_SHADOW}` : ""}`}
          style={{ transformStyle: "preserve-3d" }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", bounce: 0.2, duration: 0.4 }
          }
        >
          <Image
            alt={`Cover of ${book.title}`}
            src={book.coverSrc}
            fill
            sizes="64px"
            className="object-cover"
          />
          <span className="absolute inset-y-[-12px] left-[2px] w-px bg-black/45 blur-[0.5px]" />
          <span className="absolute inset-y-[-12px] left-[5px] w-px bg-black/25 blur-[1px]" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[2] rounded-[4px] border border-[var(--black-a3)]"
          />
        </motion.span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {book.title}
        </span>
        <span className="truncate text-sm leading-5 font-normal text-gray-a10">
          {book.author}
        </span>
      </span>
      {book.rating != null ? <BookRating value={book.rating} /> : null}
    </div>
  );
}
