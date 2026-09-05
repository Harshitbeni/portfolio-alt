"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import {
  formatUnfurlDomain,
  internalBubbleHref,
  type BubbleInlineSegment,
} from "@/lib/bubble-links";
import type { UnfurlResult } from "@/lib/unfurl-types";
import { cn } from "@/lib/utils";

const previewCache = new Map<string, UnfurlResult>();
const previewInflight = new Map<string, Promise<UnfurlResult>>();

async function loadUnfurlPreview(url: string) {
  const cached = previewCache.get(url);

  if (cached) {
    return cached;
  }

  const inflight = previewInflight.get(url);

  if (inflight) {
    return inflight;
  }

  const request = fetch(`/api/unfurl?url=${encodeURIComponent(url)}`).then(
    async (response) => {
      if (!response.ok) {
        throw new Error("unfurl failed");
      }

      const data = (await response.json()) as UnfurlResult;
      previewCache.set(url, data);
      return data;
    },
  );

  previewInflight.set(url, request);

  try {
    return await request;
  } finally {
    previewInflight.delete(url);
  }
}

export function MiniBeniBubbleText({
  segments,
  role,
}: {
  segments: BubbleInlineSegment[];
  role: "user" | "beni";
}) {
  const origin = typeof window === "undefined" ? undefined : window.location.origin;

  return segments.map((segment, index) => {
    if (segment.type === "text") {
      return <span key={index}>{segment.value}</span>;
    }

    const internal = internalBubbleHref(segment.href, origin);
    const className = cn(
      "underline decoration-[10%] underline-offset-2 [text-decoration-skip-ink:none] outline-none",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      role === "user"
        ? "decoration-white/50 hover:decoration-white"
        : "decoration-current/40 hover:decoration-current",
    );

    if (internal) {
      return (
        <Link className={className} href={internal} key={index}>
          {segment.label}
        </Link>
      );
    }

    return (
      <a
        className={className}
        href={segment.href}
        key={index}
        rel="noopener noreferrer"
        target="_blank"
      >
        {segment.label}
      </a>
    );
  });
}

function LinkCardFrame({
  href,
  internal,
  className,
  style,
  children,
  ariaBusy,
  ariaLabel,
}: {
  href: string;
  internal: string | null;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  ariaBusy?: boolean;
  ariaLabel?: string;
}) {
  const shared = {
    "aria-busy": ariaBusy ? true : undefined,
    "aria-label": ariaLabel,
    className: cn(
      "block w-full min-w-0 overflow-hidden rounded-[14px] outline-none",
      "focus-visible:ring-3 focus-visible:ring-ring/50",
      className,
    ),
    style,
  };

  if (internal) {
    return (
      <Link href={internal} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...shared}>
      {children}
    </a>
  );
}

function LinkCardSkeleton() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-[14px] bg-secondary">
      <div className="aspect-[1.91/1] bg-muted" />
      <div className="space-y-1.5 px-2.5 py-1.5">
        <div className="h-3 w-4/5 rounded-sm bg-muted" />
        <div className="h-2.5 w-1/3 rounded-sm bg-muted" />
      </div>
    </div>
  );
}

function LinkCardFallback({
  href,
  internal,
  title,
}: {
  href: string;
  internal: string | null;
  title: string;
}) {
  return (
    <LinkCardFrame
      ariaLabel={title}
      className="bg-secondary px-2.5 py-1.5"
      href={href}
      internal={internal}
    >
      <p className="text-xs font-medium text-secondary-foreground wrap-break-word">
        {title}
      </p>
    </LinkCardFrame>
  );
}

export function MiniBeniLinkCard({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const [preview, setPreview] = useState<UnfurlResult | null>(
    () => previewCache.get(url) ?? null,
  );
  const [failed, setFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const origin = typeof window === "undefined" ? undefined : window.location.origin;
  const internal = internalBubbleHref(url, origin);
  const fallbackTitle = formatUnfurlDomain(url);

  useEffect(() => {
    const cached = previewCache.get(url);

    if (cached) {
      setPreview(cached);
      setFailed(false);
      setImageFailed(false);
      return;
    }

    let cancelled = false;

    setPreview(null);
    setFailed(false);
    setImageFailed(false);

    void loadUnfurlPreview(url)
      .then((data) => {
        if (!cancelled) {
          setPreview(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (failed) {
    return (
      <div className={className}>
        <LinkCardFallback
          href={url}
          internal={internal}
          title={fallbackTitle}
        />
      </div>
    );
  }

  if (!preview) {
    return (
      <div className={className}>
        <LinkCardSkeleton />
      </div>
    );
  }

  const titleColor =
    preview.textMode === "light" ? "#fff" : "rgb(0 0 0 / 0.72)";
  const domainColor =
    preview.textMode === "light"
      ? "rgb(255 255 255 / 0.7)"
      : "rgb(0 0 0 / 0.45)";
  const showImage = Boolean(preview.imageUrl) && !imageFailed;

  return (
    <div className={className}>
      <LinkCardFrame
        ariaLabel={`${preview.title}, ${preview.domain}`}
        href={preview.url || url}
        internal={internalBubbleHref(preview.url || url, origin) ?? internal}
      >
        {showImage ? (
          <div className="aspect-[1.91/1] w-full overflow-hidden bg-muted">
            {/* OG hosts are arbitrary; native img avoids next/image remotePatterns. */}
            <img
              alt=""
              className="size-full object-cover"
              decoding="async"
              onError={() => setImageFailed(true)}
              referrerPolicy="no-referrer"
              src={preview.imageUrl ?? undefined}
            />
          </div>
        ) : null}
        <div
          className="px-2.5 py-1.5"
          style={{ backgroundColor: preview.backgroundHex }}
        >
          <p
            className="line-clamp-2 text-xs font-medium leading-snug"
            style={{ color: titleColor }}
          >
            {preview.title}
          </p>
          <p
            className="truncate text-xxs leading-4"
            style={{ color: domainColor }}
          >
            {preview.domain}
          </p>
        </div>
      </LinkCardFrame>
    </div>
  );
}
