import "server-only";

import { readFile } from "node:fs/promises";
import { join, normalize, relative, sep } from "node:path";

import sharp from "sharp";

import { formatUnfurlDomain } from "@/lib/bubble-links";
import { unfurlSitePath } from "@/lib/site-unfurl";
import type { UnfurlResult, UnfurlTextMode } from "@/lib/unfurl-types";

const CACHE_TTL_MS = 60 * 60 * 1000;
const FAILURE_TTL_MS = 30 * 1000;
const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 512 * 1024;
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 5;
const DEFAULT_BACKGROUND_HEX = "#e8e8e8";
const LUMINANCE_THRESHOLD = 0.45;

type CacheEntry =
  | { ok: true; expires: number; value: UnfurlResult }
  | { ok: false; expires: number };

const cache = new Map<string, CacheEntry>();

function normalizeHost(hostname: string) {
  return hostname.replace(/^\[|\]$/g, "").replace(/^www\./i, "").toLowerCase();
}

export function isThisSiteUrl(url: URL, requestUrl: URL) {
  const host = normalizeHost(url.hostname);
  const requestHost = normalizeHost(requestUrl.hostname);
  return host === "harshitbeni.com" || host === requestHost;
}

function isPrivateIPv4(hostname: string) {
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return false;
  }

  const parts = hostname.split(".").map(Number);
  const [a, b] = parts;

  if (a == null || b == null) {
    return false;
  }

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function isBlockedHost(hostname: string) {
  const host = normalizeHost(hostname);

  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "0.0.0.0" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return true;
  }

  return isPrivateIPv4(host);
}

function assertPublicHttpUrl(url: URL) {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported URL");
  }

  if (isBlockedHost(url.hostname)) {
    throw new Error("Blocked URL");
  }
}

function cacheGet(key: string) {
  const entry = cache.get(key);

  if (!entry || Date.now() >= entry.expires) {
    cache.delete(key);
    return null;
  }

  return entry;
}

function cacheSet(key: string, entry: CacheEntry) {
  cache.set(key, entry);
}

function toHex(value: number) {
  return value.toString(16).padStart(2, "0");
}

function relativeLuminance(r: number, g: number, b: number) {
  const linear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function textModeForHex(hex: string): UnfurlTextMode {
  const match = hex.match(/^#([0-9a-f]{6})$/i);

  if (!match?.[1]) {
    return "dark";
  }

  const value = match[1];
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return relativeLuminance(r, g, b) > LUMINANCE_THRESHOLD ? "dark" : "light";
}

async function sampleBottomStrip(buffer: Buffer) {
  const image = sharp(buffer, { failOn: "none" });
  const { width = 1, height = 1 } = await image.metadata();
  const strip = Math.max(1, Math.round(height * 0.12));
  const { data } = await sharp(buffer, { failOn: "none" })
    .extract({
      left: 0,
      top: Math.max(0, height - strip),
      width,
      height: strip,
    })
    .resize(1, 1, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const r = data[0] ?? 232;
  const g = data[1] ?? 232;
  const b = data[2] ?? 232;
  const backgroundHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  return {
    backgroundHex,
    textMode: textModeForHex(backgroundHex),
  };
}

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function metaContent(html: string, keys: string[]) {
  for (const key of keys) {
    const property = html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        "i",
      ),
    );
    const contentFirst = html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${key}["'][^>]*>`,
        "i",
      ),
    );
    const value = property?.[1] ?? contentFirst?.[1];

    if (value) {
      return decodeHtml(value);
    }
  }

  return null;
}

function pageTitle(html: string) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1]) : null;
}

async function readLimited(response: Response, maxBytes: number) {
  const declared = Number(response.headers.get("content-length") ?? "");

  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new Error("Response too large");
  }

  if (!response.body) {
    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.byteLength > maxBytes) {
      throw new Error("Response too large");
    }

    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (!value) {
      continue;
    }

    total += value.byteLength;

    if (total > maxBytes) {
      await reader.cancel();
      throw new Error("Response too large");
    }

    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

async function fetchPublic(url: URL, accept: string) {
  let current = url;

  for (let i = 0; i < MAX_REDIRECTS; i += 1) {
    assertPublicHttpUrl(current);

    const response = await fetch(current, {
      headers: {
        accept,
        "user-agent": "Mozilla/5.0 (compatible; MiniBeniUnfurl/1.0)",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("Redirect missing location");
      }

      current = new URL(location, current);
      continue;
    }

    if (!response.ok) {
      throw new Error(`Fetch failed ${response.status}`);
    }

    return { response, finalUrl: current };
  }

  throw new Error("Too many redirects");
}

function publicFilePath(imageSrc: string) {
  const relativePath = imageSrc.replace(/^\/+/, "");
  const root = join(process.cwd(), "public");
  const file = normalize(join(root, relativePath));
  const rel = relative(root, file);

  if (rel.startsWith("..") || rel.startsWith(`..${sep}`) || rel === "..") {
    return null;
  }

  return file;
}

async function colorFromImageSrc(imageSrc: string, pageUrl: URL) {
  try {
    if (imageSrc.startsWith("/") && !imageSrc.startsWith("//")) {
      const file = publicFilePath(imageSrc);

      if (!file) {
        return {
          backgroundHex: DEFAULT_BACKGROUND_HEX,
          textMode: "dark" as const,
        };
      }

      const buffer = await readFile(file);
      return sampleBottomStrip(buffer);
    }

    const imageUrl = new URL(imageSrc, pageUrl);
    const { response } = await fetchPublic(imageUrl, "image/*,*/*;q=0.8");
    const buffer = await readLimited(response, MAX_IMAGE_BYTES);
    return sampleBottomStrip(buffer);
  } catch {
    return {
      backgroundHex: DEFAULT_BACKGROUND_HEX,
      textMode: "dark" as const,
    };
  }
}

async function unfurlExternal(url: URL): Promise<UnfurlResult> {
  const { response, finalUrl } = await fetchPublic(
    url,
    "text/html,application/xhtml+xml",
  );
  const html = (await readLimited(response, MAX_HTML_BYTES)).toString("utf8");
  const title =
    metaContent(html, ["og:title", "twitter:title"]) ??
    pageTitle(html) ??
    formatUnfurlDomain(finalUrl.href);
  const imageRaw =
    metaContent(html, ["og:image:secure_url", "og:image", "twitter:image"]) ??
    null;
  const imageUrl = imageRaw ? new URL(imageRaw, finalUrl).href : null;
  const color = imageUrl
    ? await colorFromImageSrc(imageUrl, finalUrl)
    : {
        backgroundHex: DEFAULT_BACKGROUND_HEX,
        textMode: "dark" as const,
      };

  return {
    url: finalUrl.href,
    title,
    domain: formatUnfurlDomain(finalUrl.href),
    imageUrl,
    backgroundHex: color.backgroundHex,
    textMode: color.textMode,
  };
}

async function unfurlThisSite(
  url: URL,
  requestUrl: URL,
): Promise<UnfurlResult> {
  const source = await unfurlSitePath(url);
  const color = source.imageSrc
    ? await colorFromImageSrc(source.imageSrc, requestUrl)
    : {
        backgroundHex: DEFAULT_BACKGROUND_HEX,
        textMode: "dark" as const,
      };
  const imageUrl = source.imageSrc ?? null;

  return {
    url: `${url.pathname}${url.search}` || "/",
    title: source.title,
    domain: "harshitbeni.com",
    imageUrl,
    backgroundHex: color.backgroundHex,
    textMode: color.textMode,
  };
}

export async function unfurlUrl(
  raw: string,
  requestUrl: URL,
): Promise<UnfurlResult | null> {
  let url: URL;

  try {
    url =
      raw.startsWith("/") && !raw.startsWith("//")
        ? new URL(raw, requestUrl)
        : new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null;
  }

  const cacheKey = isThisSiteUrl(url, requestUrl)
    ? `site:${url.pathname}?${url.searchParams.toString()}`
    : `ext:${url.href}`;
  const cached = cacheGet(cacheKey);

  if (cached?.ok) {
    return cached.value;
  }

  if (cached && !cached.ok) {
    return null;
  }

  try {
    const value = isThisSiteUrl(url, requestUrl)
      ? await unfurlThisSite(url, requestUrl)
      : await unfurlExternal(url);

    cacheSet(cacheKey, {
      ok: true,
      expires: Date.now() + CACHE_TTL_MS,
      value,
    });
    return value;
  } catch {
    cacheSet(cacheKey, {
      ok: false,
      expires: Date.now() + FAILURE_TTL_MS,
    });
    return null;
  }
}
