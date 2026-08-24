import Link from "next/link";

type NoteListItem = {
  slug: string;
  title: string;
  date: string;
};

export function NotesRow({ note }: { note: NoteListItem }) {
  return (
    <Link
      href={`/notes/${note.slug}`}
      className="group flex min-w-0 flex-col gap-0.5 rounded-md outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span className="truncate text-sm leading-5 font-medium text-gray-a12">
        {note.title}
      </span>
      <span className="text-sm leading-5 font-normal text-gray-a10">
        {note.date}
      </span>
    </Link>
  );
}
