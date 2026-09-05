import Link from "next/link";
import { NotePreview } from "@/components/note-preview";
import type { NoteListItem } from "@/lib/notes";

export function NotesRow({ note }: { note: NoteListItem }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group flex min-w-0 items-center gap-2 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <NotePreview
        title={note.title}
        excerpt={note.excerpt}
        imageSrc={note.imageSrc}
      />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-5 font-medium text-gray-a12">
          {note.title}
        </span>
        <span className="text-xxs leading-4 font-normal text-gray-a10">
          {note.date}
        </span>
      </span>
    </Link>
  );
}
