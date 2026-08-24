import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoteArticle } from "@/components/note-article";
import { getNote, getNoteSlugs } from "@/lib/notes";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) {
    return { title: "Not found" };
  }

  return { title: note.title };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    notFound();
  }

  return <NoteArticle note={note} />;
}
