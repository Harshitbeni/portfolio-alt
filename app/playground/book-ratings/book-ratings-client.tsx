"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { BookRating } from "@/components/book-rating";
import { Button } from "@/components/ui/button";
import { BOOKS, BOOK_SECTIONS, type Book, type BookSection } from "@/lib/books";

const SECTION_LABELS: Record<BookSection, string> = {
  reading: "Reading",
  read: "Read",
};

const RATING_OPTIONS = Array.from({ length: 10 }, (_, index) => (index + 1) * 0.5);

function initialRatings(): Record<string, number | undefined> {
  return Object.fromEntries(
    BOOKS.map((book: Book) => [book.id, book.rating]),
  );
}

function ratingsToJson(ratings: Record<string, number | undefined>): string {
  const entries = BOOKS.flatMap((book) => {
    const rating = ratings[book.id];
    if (rating == null) return [];
    return [{ id: book.id, rating }];
  });

  return JSON.stringify(entries, null, 2);
}

function RatingRow({
  book,
  rating,
  onRatingChange,
}: {
  book: Book;
  rating: number | undefined;
  onRatingChange: (rating: number | undefined) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border border-gray-a5 bg-gray-1 p-3">
      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[4px] border border-gray-a5 bg-gray-2">
        <Image
          alt={`Cover of ${book.title}`}
          src={book.coverSrc}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {book.title}
        </span>
        <span className="truncate text-sm leading-5 text-gray-a10">
          {book.author}
        </span>
      </div>
      <label className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-gray-a10">Rating</span>
        <select
          className="h-8 rounded-md border border-gray-a5 bg-gray-1 px-2 text-sm text-gray-a12 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          value={rating ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            onRatingChange(nextValue === "" ? undefined : Number(nextValue));
          }}
        >
          <option value="">—</option>
          {RATING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {rating != null ? <BookRating value={rating} /> : null}
    </div>
  );
}

export function BookRatingsClient() {
  const [ratings, setRatings] = useState(initialRatings);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const ratedCount = useMemo(
    () => Object.values(ratings).filter((rating) => rating != null).length,
    [ratings],
  );

  const jsonOutput = useMemo(() => ratingsToJson(ratings), [ratings]);

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-sm font-medium text-gray-a12">Book ratings</h1>
            <p className="mt-1 text-sm text-gray-a10">
              Disposable tool. Rate books, then copy JSON to add ratings to{" "}
              <code className="text-xs text-gray-a11">lib/books.ts</code>.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => copyJson()}
            disabled={ratedCount === 0}
          >
            {copyState === "copied"
              ? "Copied"
              : copyState === "error"
                ? "Copy failed"
                : "Copy JSON"}
          </Button>
        </div>
        <p className="text-xs text-gray-a10">
          {ratedCount} of {BOOKS.length} rated
        </p>
      </header>

      {BOOK_SECTIONS.map((section) => {
        const books = BOOKS.filter((book) => book.section === section);
        if (books.length === 0) return null;

        return (
          <section key={section} aria-labelledby={`book-ratings-${section}`}>
            <h2
              id={`book-ratings-${section}`}
              className="mb-4 text-xs font-medium text-gray-a10"
            >
              {SECTION_LABELS[section]}
            </h2>
            <div className="flex flex-col gap-3">
              {books.map((book) => (
                <RatingRow
                  key={book.id}
                  book={book}
                  rating={ratings[book.id]}
                  onRatingChange={(nextRating) =>
                    setRatings((current) => ({
                      ...current,
                      [book.id]: nextRating,
                    }))
                  }
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium text-gray-a10">Preview</h2>
        <pre className="overflow-x-auto rounded-md border border-gray-a5 bg-gray-2 p-4 text-xs leading-5 text-gray-a11">
          {jsonOutput}
        </pre>
      </section>
    </div>
  );
}
