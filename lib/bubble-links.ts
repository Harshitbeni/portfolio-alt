export type BubbleInlineSegment =
  | { type: "text"; value: string }
  | { type: "link"; href: string; label: string };

export type ParsedBubbleLinks = {
  text: string;
  cardHref: string | null;
  segments: BubbleInlineSegment[];
};

type FoundLink = {
  start: number;
  end: number;
  href: string;
  label: string;
};

const TRAILING_URL_PUNCT = /[.,!?;:]+$/;
const MARKDOWN_LINK_RE =
  /\[([^\]]+)\]\((<)?(https?:\/\/[^)\s>]+|\/(?!\/)[^)\s]*)>?\)/gi;
const BARE_URL_RE = /https?:\/\/[^\s<>"'`]+/gi;
const BARE_SITE_HOST_RE =
  /(?:^|[\s])((?:www\.)?harshitbeni\.com\/[^\s<>"'`]+)/gi;
const RELATIVE_PATH_RE = /(?:^|[\s])(\/(?!\/)[^\s<>"'`]+)/g;

function normalizeHost(hostname: string) {
  return hostname.replace(/^www\./i, "").toLowerCase();
}

export function formatUnfurlDomain(href: string) {
  try {
    const url = href.startsWith("/")
      ? new URL(href, "https://harshitbeni.com")
      : new URL(href);
    const host = normalizeHost(url.hostname);
    const port =
      url.port && url.port !== "80" && url.port !== "443" ? `:${url.port}` : "";

    if (host === "localhost" || host === "127.0.0.1") {
      return `${host}${port}`;
    }

    if (host === "harshitbeni.com") {
      return "harshitbeni.com";
    }

    return `${host}${port}`;
  } catch {
    return href;
  }
}

export function internalBubbleHref(href: string, origin?: string) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return href;
  }

  try {
    const url = new URL(href);
    const host = normalizeHost(url.hostname);
    const originHost = origin
      ? normalizeHost(new URL(origin).hostname)
      : null;
    const path = `${url.pathname}${url.search}${url.hash}` || "/";

    if (host === "harshitbeni.com" || (originHost && host === originHost)) {
      return path;
    }
  } catch {
    return null;
  }

  return null;
}

function overlaps(links: FoundLink[], start: number, end: number) {
  return links.some((link) => start < link.end && end > link.start);
}

function stripTrailingPunctuation(value: string) {
  return value.replace(TRAILING_URL_PUNCT, "");
}

function canonicalizeHref(raw: string): string | null {
  const value = stripTrailingPunctuation(raw.trim());

  if (!value) {
    return null;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  const withProtocol = /^https?:\/\//i.test(value)
    ? value
    : /^(?:www\.)?harshitbeni\.com\//i.test(value)
      ? `https://${value}`
      : null;

  if (!withProtocol) {
    return null;
  }

  try {
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function pushLink(
  links: FoundLink[],
  start: number,
  raw: string,
  label?: string,
) {
  const href = canonicalizeHref(raw);

  if (!href) {
    return;
  }

  const consumed = stripTrailingPunctuation(raw);
  const end = start + consumed.length;

  if (end <= start || overlaps(links, start, end)) {
    return;
  }

  links.push({
    start,
    end,
    href,
    label: (label ?? consumed).trim() || href,
  });
}

function findLinks(text: string): FoundLink[] {
  const links: FoundLink[] = [];

  for (const match of text.matchAll(MARKDOWN_LINK_RE)) {
    const raw = match[3];
    const index = match.index;

    if (raw == null || index == null) {
      continue;
    }

    pushLink(links, index, raw, match[1]);
    const last = links.at(-1);

    if (last && last.start === index) {
      last.end = index + match[0].length;
    }
  }

  for (const match of text.matchAll(BARE_URL_RE)) {
    const raw = match[0];
    const index = match.index;

    if (index == null) {
      continue;
    }

    pushLink(links, index, raw);
  }

  for (const match of text.matchAll(BARE_SITE_HOST_RE)) {
    const raw = match[1];
    const index = match.index;

    if (raw == null || index == null) {
      continue;
    }

    const start = match[0].startsWith(raw) ? index : index + 1;
    pushLink(links, start, raw);
  }

  for (const match of text.matchAll(RELATIVE_PATH_RE)) {
    const raw = match[1];
    const index = match.index;

    if (raw == null || index == null) {
      continue;
    }

    const start = match[0].startsWith(raw) ? index : index + 1;
    pushLink(links, start, raw);
  }

  return links.sort((a, b) => a.start - b.start);
}

function isLinkFirst(text: string, link: FoundLink) {
  return /^\s*$/.test(text.slice(0, link.start));
}

function isLinkLast(text: string, link: FoundLink) {
  return /^[\s.,!?;:]*$/.test(text.slice(link.end));
}

function stripCardLink(text: string, link: FoundLink) {
  const before = text.slice(0, link.start).trimEnd();
  const after = text.slice(link.end).replace(/^[\s.,!?;:]+/, "").trimStart();
  return [before, after].filter(Boolean).join(" ").trim();
}

function segmentsFromText(text: string): BubbleInlineSegment[] {
  if (!text) {
    return [];
  }

  const links = findLinks(text);

  if (links.length === 0) {
    return [{ type: "text", value: text }];
  }

  const segments: BubbleInlineSegment[] = [];
  let cursor = 0;

  for (const link of links) {
    if (link.start > cursor) {
      segments.push({ type: "text", value: text.slice(cursor, link.start) });
    }

    segments.push({
      type: "link",
      href: link.href,
      label: link.label,
    });
    cursor = link.end;
  }

  if (cursor < text.length) {
    segments.push({ type: "text", value: text.slice(cursor) });
  }

  return segments;
}

export function parseBubbleLinks(text: string): ParsedBubbleLinks {
  const links = findLinks(text);

  if (links.length === 0) {
    return {
      text,
      cardHref: null,
      segments: text ? [{ type: "text", value: text }] : [],
    };
  }

  const last = links.at(-1);
  const first = links[0];
  const card =
    last && isLinkLast(text, last)
      ? last
      : first && isLinkFirst(text, first)
        ? first
        : null;

  if (!card) {
    return {
      text,
      cardHref: null,
      segments: segmentsFromText(text),
    };
  }

  const leftover = stripCardLink(text, card);

  return {
    text: leftover,
    cardHref: card.href,
    segments: segmentsFromText(leftover),
  };
}
