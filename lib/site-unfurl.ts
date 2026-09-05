import "server-only";

import { BOOKS } from "@/lib/books";
import { getMusicPreview } from "@/lib/music";
import { getNote, getNotes } from "@/lib/notes";
import { NOW_PLAYING_FALLBACK } from "@/lib/now-playing";
import { STACK_ITEMS } from "@/lib/stack";

export const SITE_UNFURL_FALLBACK_IMAGE =
  "/work/privado-mobile-app-scan/portrait-black-and-white.png";

export type SiteUnfurlSource = {
  title: string;
  imageSrc: string | null;
};

function readingCover() {
  return (
    BOOKS.find((book) => book.section === "reading") ?? BOOKS[0]
  )?.coverSrc ?? null;
}

function firstNoteImage(
  notes: { title: string; imageSrc: string | null }[],
) {
  return notes.find((note) => note.imageSrc)?.imageSrc ?? null;
}

export async function unfurlSitePath(url: URL): Promise<SiteUnfurlSource> {
  const path = url.pathname.replace(/\/+$/, "") || "/";
  const tab = url.searchParams.get("tab");

  if (path === "/notes") {
    const notes = await getNotes();
    return {
      title: "Notes",
      imageSrc: firstNoteImage(notes) ?? SITE_UNFURL_FALLBACK_IMAGE,
    };
  }

  if (path.startsWith("/notes/")) {
    const slug = path.slice("/notes/".length).split("/")[0] ?? "";
    const note = slug ? await getNote(slug) : null;

    if (note) {
      return {
        title: note.title,
        imageSrc: note.imageSrc ?? SITE_UNFURL_FALLBACK_IMAGE,
      };
    }

    return {
      title: "Notes",
      imageSrc: SITE_UNFURL_FALLBACK_IMAGE,
    };
  }

  if (path === "/") {
    if (tab === "books") {
      return {
        title: "Books",
        imageSrc: readingCover() ?? SITE_UNFURL_FALLBACK_IMAGE,
      };
    }

    if (tab === "music") {
      const preview = await getMusicPreview();
      const image =
        preview?.nowPlaying?.image ??
        preview?.sections.find((section) => section.tracks[0]?.image)
          ?.tracks[0]?.image ??
        NOW_PLAYING_FALLBACK.image;

      return {
        title: "Music",
        imageSrc: image,
      };
    }

    if (tab === "stack") {
      return {
        title: "Stack",
        imageSrc: STACK_ITEMS[0]?.iconSrc ?? SITE_UNFURL_FALLBACK_IMAGE,
      };
    }

    if (tab === "notes") {
      const notes = await getNotes();
      return {
        title: "Notes",
        imageSrc: firstNoteImage(notes) ?? SITE_UNFURL_FALLBACK_IMAGE,
      };
    }

    if (tab === "play") {
      return { title: "Play", imageSrc: SITE_UNFURL_FALLBACK_IMAGE };
    }

    if (tab === "work") {
      return { title: "Work", imageSrc: SITE_UNFURL_FALLBACK_IMAGE };
    }
  }

  return {
    title: "Harshit Beni",
    imageSrc: SITE_UNFURL_FALLBACK_IMAGE,
  };
}
