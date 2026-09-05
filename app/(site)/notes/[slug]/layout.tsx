import { NoteNelsonPresence } from "@/components/note-stagger";
import type { ReactNode } from "react";

export default function NoteSlugLayout({ children }: { children: ReactNode }) {
  return <NoteNelsonPresence>{children}</NoteNelsonPresence>;
}
