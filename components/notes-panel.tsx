import { NotesRow } from "@/components/notes-row";
import { getNotes } from "@/lib/notes";

export async function NotesPanel() {
  const notes = await getNotes();

  return (
    <div className="flex w-full flex-col gap-6">
      {notes.map((note) => (
        <NotesRow key={note.slug} note={note} />
      ))}
    </div>
  );
}
