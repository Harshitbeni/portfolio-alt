import type { Metadata } from "next";
import { BookRatingsClient } from "./book-ratings-client";

export const metadata: Metadata = {
  title: "Book ratings",
  description: "Disposable tool for rating books",
};

export default function BookRatingsPage() {
  return <BookRatingsClient />;
}
