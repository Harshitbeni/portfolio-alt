"use client";

import { BookRow } from "@/components/book-row";
import { BOOKS, type BookSection } from "@/lib/books";

const SECTION_LABELS: Record<BookSection, string> = {
  reading: "Reading",
  read: "Read",
};

export function BooksPanel() {
  return (
    <div className="flex w-full flex-col gap-6">
      {(["reading", "read"] as const).map((section) => {
        const books = BOOKS.filter((book) => book.section === section);

        if (books.length === 0) return null;

        return (
          <section
            key={section}
            aria-labelledby={`books-${section}`}
            className="pb-6"
          >
            <h2
              id={`books-${section}`}
              className="mb-6 text-xs leading-4 font-medium text-gray-a10"
            >
              {SECTION_LABELS[section]}
            </h2>
            <div className="flex flex-col gap-6">
              {books.map((book) => (
                <BookRow
                  key={book.id}
                  book={book}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
