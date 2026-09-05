import Image from "next/image";

const TITLE_BAR_MIN = 12;
const TITLE_BAR_MAX = 24;
const BODY_BAR_MIN = 10;
const BODY_BAR_MAX = 24;
const BODY_LINE_CHARS = 22;

function titleBarWidth(title: string) {
  return Math.min(
    TITLE_BAR_MAX,
    Math.max(TITLE_BAR_MIN, Math.round(title.length * 0.8)),
  );
}

function bodyBarWidths(excerpt: string, hasImage: boolean) {
  const count = hasImage ? 3 : 7;
  const words = excerpt.split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (lines.length >= count) break;
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > BODY_LINE_CHARS) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (lines.length < count && current) {
    lines.push(current);
  }

  const widths = lines.slice(0, count).map((line) =>
    Math.min(
      BODY_BAR_MAX,
      Math.max(
        BODY_BAR_MIN,
        Math.round((line.length / BODY_LINE_CHARS) * BODY_BAR_MAX),
      ),
    ),
  );

  while (widths.length < count) {
    widths.push(BODY_BAR_MIN);
  }

  return widths;
}

export function NotePreview({
  title,
  excerpt,
  imageSrc,
}: {
  title: string;
  excerpt: string;
  imageSrc: string | null;
}) {
  const hasImage = imageSrc != null;
  const titleWidth = titleBarWidth(title);
  const bars = bodyBarWidths(excerpt, hasImage);

  return (
    <span
      aria-hidden
      className="relative block h-10 w-8 shrink-0 rounded-[4px] bg-gray-1 shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_1px_0_rgba(0,0,0,0.02),0_0_0_0.5px_rgb(0_0_0/0.06)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.05),0_1px_1px_0_rgba(0,0,0,0.02),0_0_0_0.5px_rgb(255_255_255/0.06)] transition-[background-color] duration-150 ease-out group-hover:bg-gray-3"
    >
      {imageSrc ? (
        <span className="absolute top-0.5 left-0.5 h-4 w-[28px] overflow-hidden rounded-[2px]">
          <Image
            src={imageSrc}
            alt=""
            width={56}
            height={32}
            className="size-full object-cover"
            sizes="28px"
          />
          <span className="pointer-events-none absolute inset-0 rounded-[2px] border-[0.5px] border-gray-a6" />
        </span>
      ) : null}
      <span
        className={
          hasImage
            ? "absolute top-5 left-1 flex flex-col gap-0.5"
            : "absolute top-1 left-1 flex flex-col gap-0.5"
        }
      >
        <span
          className="h-0.5 rounded-[1px] bg-gray-9"
          style={{ width: titleWidth }}
        />
        {bars.map((width, index) => (
          <span
            key={index}
            className="h-0.5 rounded-[1px] bg-gray-6"
            style={{ width }}
          />
        ))}
      </span>
    </span>
  );
}
