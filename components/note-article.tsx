import { Children, isValidElement, type ReactNode } from "react";
import Image from "next/image";
import type { Components } from "react-markdown";
import Markdown from "react-markdown";
import { NoteHomeButton } from "@/components/note-home-button";
import type { Note } from "@/lib/notes";

const linkClassName =
  "text-gray-a12 underline decoration-gray-a8 [text-decoration-skip-ink:none] [text-decoration-thickness:10%] outline-none transition-[text-decoration-color] duration-200 ease-out hover:decoration-gray-a11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const NOTE_IMAGE_SIZE: Record<string, { width: number; height: number }> = {
  "/notes/i-have-a-dream-1.webp": { width: 1200, height: 899 },
  "/notes/finding-flow-1.webp": { width: 1200, height: 899 },
  "/notes/twitter-before.webp": { width: 1200, height: 725 },
  "/notes/twitter-after.webp": { width: 1200, height: 725 },
  "/notes/youtube-before.webp": { width: 1200, height: 725 },
  "/notes/youtube-after.webp": { width: 1200, height: 725 },
};

function NoteImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src?.startsWith("/notes/")) return null;

  const label = alt === "Before" || alt === "After" ? alt : undefined;
  const size = NOTE_IMAGE_SIZE[src] ?? { width: 1200, height: 725 };

  return (
    <figure>
      <Image
        src={src}
        alt={label ? `${label} screenshot` : (alt ?? "")}
        width={size.width}
        height={size.height}
        className="h-auto w-full rounded-md border border-gray-a6"
        sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
      />
      {label ? (
        <figcaption className="mt-2 text-sm leading-5 text-gray-a10">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

function isNoteImageChild(child: ReactNode) {
  if (!isValidElement<{ src?: string }>(child)) return false;
  if (child.type === NoteImage || child.type === "figure") return true;
  return typeof child.props.src === "string" && child.props.src.startsWith("/notes/");
}

function Paragraph({ children }: { children?: ReactNode }) {
  const childArray = Children.toArray(children).filter((child) => {
    if (typeof child === "string") return child.trim() !== "";
    return true;
  });
  if (childArray.length === 1 && isNoteImageChild(childArray[0])) {
    return childArray[0];
  }

  return (
    <p className="text-pretty text-md leading-6 text-gray-a11">{children}</p>
  );
}

const markdownComponents: Components = {
  p: ({ children }) => <Paragraph>{children}</Paragraph>,
  ul: ({ children }) => (
    <ul className="list-disc space-y-2 pl-5 text-md leading-6 text-gray-a11">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal space-y-6 pl-5 text-md leading-6 text-gray-a11">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="space-y-4 pl-0.5">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-medium text-gray-a12">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a href={href} className={linkClassName}>
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-gray-a6 pl-4 text-md leading-6 text-gray-a11">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-0 border-t border-gray-a6" />,
  img: ({ src, alt }) => (
    <NoteImage src={typeof src === "string" ? src : undefined} alt={alt} />
  ),
};

export function NoteArticle({ note }: { note: Note }) {
  return (
    <article className="w-full max-w-[600px] px-4 text-sm">
      <header className="mb-8 flex flex-col gap-4">
        <NoteHomeButton />
        <div className="flex flex-col gap-1">
          <h1 className="text-md-medium text-gray-a12">
            {note.title}
          </h1>
          <p className="text-sm leading-5 text-gray-a10">{note.date}</p>
        </div>
      </header>
      <div className="flex flex-col gap-4">
        <Markdown components={markdownComponents}>{note.body}</Markdown>
      </div>
    </article>
  );
}
