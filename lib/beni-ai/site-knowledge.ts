import { BOOKS } from "@/lib/books";
import { PLAY_ITEMS } from "@/lib/play";
import { STACK_ITEMS } from "@/lib/stack";

function formatBookLine(
  title: string,
  author: string,
  href: string,
  rating?: number,
) {
  const ratingPart = typeof rating === "number" ? `, ${rating}/5` : "";
  return `- ${title} by ${author}${ratingPart} ${href}`;
}

function playLine(text: string) {
  const line =
    text
      .split("\n")
      .map((part) => part.trim())
      .find(Boolean) ?? text.trim();

  if (line.length <= 90) {
    return line;
  }

  return `${line.slice(0, 87).trimEnd()}...`;
}

export function formatBooksKnowledge() {
  const reading = BOOKS.filter((book) => book.section === "reading");
  const read = BOOKS.filter((book) => book.section === "read");
  const favorites = read.filter((book) => book.rating === 5);

  return `## Books

On this site at https://harshitbeni.com/?tab=books (Others / Books). Tracking on Oku.
If a title is not on this list, say you do not know. Do not invent reviews beyond the rating.
When mentioning a book, put its oku url on its own line.

Currently reading:
${reading.map((book) => formatBookLine(book.title, book.author, book.href)).join("\n")}

Favorites (5/5):
${favorites.map((book) => formatBookLine(book.title, book.author, book.href)).join("\n")}

Read (rating / 5):
${read.map((book) => formatBookLine(book.title, book.author, book.href, book.rating)).join("\n")}`;
}

export function formatStackKnowledge() {
  return `## Stack

On this site at https://harshitbeni.com/?tab=stack (Others / Stack). These are Harshit's own blurbs.
If a tool is not on this list, say you do not know.
When mentioning a tool, put its url on its own line.

${STACK_ITEMS.map((item) => `- ${item.name}: ${item.description} ${item.href}`).join("\n")}`;
}

export function formatPlayKnowledge() {
  return `## Play

On this site at https://harshitbeni.com/?tab=play. Posts from https://x.com/harshitbeni.
If a post is not on this list, say you do not know. Do not invent tweets.
When mentioning a post, put its x.com url on its own line.

${PLAY_ITEMS.map((item) => `- ${item.date}: ${playLine(item.text)} ${item.href}`).join("\n")}`;
}
