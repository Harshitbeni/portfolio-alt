import { NoteNelsonPage } from "@/components/note-stagger";
import type { ReactNode } from "react";

export default function NoteSlugTemplate({ children }: { children: ReactNode }) {
  return <NoteNelsonPage>{children}</NoteNelsonPage>;
}
