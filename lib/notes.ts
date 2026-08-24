import "server-only";

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";

const NOTES_DIR = join(process.cwd(), "content/notes");

export type NoteListItem = {
  slug: string;
  title: string;
  date: string;
};

export type Note = NoteListItem & {
  body: string;
};

type Frontmatter = {
  title: string;
  date: string;
  slug: string;
};

function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) {
    throw new Error("Note is missing frontmatter");
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    fields[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }

  const { title, date, slug } = fields;
  if (!title || !date || !slug) {
    throw new Error("Note frontmatter requires title, date, and slug");
  }

  return { data: { title, date, slug }, body: match[2].trim() };
}

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseNoteDate(date: string): number {
  const match = /^(\d{1,2}) ([A-Za-z]{3}), (\d{4})$/.exec(date.trim());
  if (!match) return Number.NaN;

  const day = Number(match[1]);
  const month = MONTHS[match[2]];
  const year = Number(match[3]);
  if (month == null || !Number.isInteger(day) || !Number.isInteger(year)) {
    return Number.NaN;
  }

  return Date.UTC(year, month, day);
}

const loadNotes = cache(async (): Promise<Note[]> => {
  const files = (await readdir(NOTES_DIR)).filter((name) => name.endsWith(".md"));
  const notes = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(join(NOTES_DIR, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      return { ...data, body };
    }),
  );

  return notes.sort((a, b) => parseNoteDate(b.date) - parseNoteDate(a.date));
});

export const getNotes = cache(async (): Promise<NoteListItem[]> => {
  const notes = await loadNotes();
  return notes.map(({ slug, title, date }) => ({ slug, title, date }));
});

export const getNote = cache(async (slug: string): Promise<Note | null> => {
  const notes = await loadNotes();
  return notes.find((note) => note.slug === slug) ?? null;
});

export const getNoteSlugs = cache(async () => {
  const notes = await getNotes();
  return notes.map((note) => note.slug);
});
