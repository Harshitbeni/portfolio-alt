"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavCardExpandPanel } from "@/components/nav-card-expand";
import { MiniBeni } from "@/components/mini-beni/MiniBeni";
import { MINI_BENI_PROFILE_ALT } from "@/components/mini-beni/reveal-core";
import { navCardIcons } from "@/lib/icon-context";
import {
  DEFAULT_NOMADS_LOCATION,
  formatNomadsLocation,
  isNomadsLocation,
} from "@/lib/nomads-location";
import { cn } from "@/lib/utils";

const DEFAULT_NAME = "Harshit Beniwal";
const DEFAULT_IMAGE = "/nav-card/avatar.webp";
const DEFAULT_LOCATION = formatNomadsLocation(DEFAULT_NOMADS_LOCATION);
const DEFAULT_HREF = "/";
const LOADING_LOCATION = "Loading location...";
const EXPANDED_WIDTH = 320;

const focusRingClassName =
  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const iconSlotTransitionClassName =
  "transition-opacity [transition-duration:var(--resize-dur)] [transition-timing-function:var(--resize-ease)] motion-reduce:transition-none";

const ExpandIcon = navCardIcons.expand;

export type NavCardVariant = "full" | "compact";

export type NavCardProps = {
  name?: string;
  location?: string;
  liveLocation?: boolean;
  imageSrc?: string;
  href?: string;
  variant?: NavCardVariant;
  expandable?: boolean;
};

export function NavCard({
  name = DEFAULT_NAME,
  location = DEFAULT_LOCATION,
  liveLocation = true,
  imageSrc = DEFAULT_IMAGE,
  href = DEFAULT_HREF,
  variant = "full",
  expandable = false,
}: NavCardProps) {
  const pathname = usePathname();
  const cardRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [collapsedWidth, setCollapsedWidth] = useState(0);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [canTween, setCanTween] = useState(false);
  const isCompact = variant === "compact";
  const isExpanded = expandable && expanded;
  const expandedRef = useRef(isExpanded);
  expandedRef.current = isExpanded;
  const locationLabel = useLocationLabel(location, liveLocation);
  const panelId = useId();
  const embeddedProfile = useMemo(
    () => ({
      circleRef,
      linkRef: cardRef,
      textRef,
      imageRef,
    }),
    []
  );

  useLayoutEffect(() => {
    if (!isCompact) {
      return;
    }

    const text = textRef.current;

    if (!text) {
      return;
    }

    const measure = () => {
      let width = 0;

      for (const child of text.children) {
        if (child instanceof HTMLElement) {
          width = Math.max(width, child.scrollWidth);
        }
      }

      setTextWidth(width);
    };

    measure();
    const observer = new ResizeObserver(measure);

    for (const child of text.children) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [isCompact, name, location, liveLocation]);

  useLayoutEffect(() => {
    if (!expandable) {
      return;
    }

    const sizer = sizerRef.current;

    if (!sizer) {
      return;
    }

    const readCollapsed = () => ({
      width: sizer.offsetWidth,
      height: sizer.offsetHeight,
    });

    const readExpandedHeight = () => {
      const card = cardRef.current;

      if (!card) {
        return 0;
      }

      const prevHeight = card.style.height;
      const prevWidth = card.style.width;
      const prevOverflow = card.style.overflow;
      const prevTransition = card.style.transition;
      card.style.transition = "none";
      card.style.width = `${EXPANDED_WIDTH}px`;
      card.style.height = "auto";
      card.style.overflow = "visible";
      const next = card.offsetHeight;
      card.style.height = prevHeight;
      card.style.width = prevWidth;
      card.style.overflow = prevOverflow;
      card.style.transition = prevTransition;
      return next;
    };

    const measureCollapsed = () => {
      const collapsed = readCollapsed();
      setCollapsedWidth((current) =>
        current === collapsed.width ? current : collapsed.width
      );
      setCollapsedHeight((current) =>
        current === collapsed.height ? current : collapsed.height
      );
    };

    const measureExpanded = () => {
      const nextExpandedHeight = readExpandedHeight();

      if (nextExpandedHeight > 0) {
        setExpandedHeight((current) =>
          current === nextExpandedHeight ? current : nextExpandedHeight
        );
      }
    };

    measureCollapsed();

    if (!expandedRef.current) {
      measureExpanded();
    }

    const observer = new ResizeObserver(measureCollapsed);
    observer.observe(sizer);

    return () => observer.disconnect();
  }, [expandable, isCompact, name, locationLabel]);

  useEffect(() => {
    if (collapsedWidth > 0 && collapsedHeight > 0 && expandedHeight > 0) {
      setCanTween(true);
    }
  }, [collapsedWidth, collapsedHeight, expandedHeight]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (cardRef.current?.contains(target)) {
        return;
      }

      setExpanded(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isExpanded]);

  const meetMiniBeni = () => {
    setExpanded(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        circleRef.current?.click();
      });
    });
  };

  const hasResizeSizes =
    expandable && collapsedWidth > 0 && collapsedHeight > 0 && expandedHeight > 0;

  const cardStyle = {
    "--nav-card-text-width": `${textWidth}px`,
    ...(hasResizeSizes
      ? {
          width: isExpanded ? EXPANDED_WIDTH : collapsedWidth,
          height: isExpanded ? expandedHeight : collapsedHeight,
        }
      : null),
  } as CSSProperties;

  const cardClassName = cn(
    "group/card flex",
    expandable
      ? cn(
          "absolute top-0 left-0 z-10 flex-col items-stretch gap-2 overflow-hidden rounded-[20px] p-1",
          canTween && "t-resize",
          hasResizeSizes ? null : "w-max",
          isExpanded ? "bg-gray-1 shadow-4" : "hover:bg-gray-a3"
        )
      : "w-max max-w-full items-center px-2 py-1"
  );

  const profile = (
    <div
      data-nav-card-profile=""
      className={cn("flex items-center", isCompact ? "gap-0" : "gap-2")}
    >
      <button
        ref={circleRef}
        type="button"
        aria-label="Reveal Mini Beni"
        className={cn(
          "relative size-8 shrink-0 overflow-hidden rounded-full border border-gray-a6 bg-transparent p-0",
          focusRingClassName
        )}
      >
        {/* Mini Beni reveal needs a real img node for embedded profile refs. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imageRef}
          src={imageSrc}
          alt={MINI_BENI_PROFILE_ALT}
          width={32}
          height={32}
          decoding="async"
          draggable={false}
          className="pointer-events-none block size-full rounded-[inherit] object-cover object-center"
          aria-hidden="true"
        />
      </button>
      <Link
        ref={textRef}
        href={href}
        aria-current={pathname === href ? "page" : undefined}
        className={cn(
          "flex flex-col items-start no-underline",
          isCompact ? "t-resize min-w-0" : "w-max shrink-0",
          isExpanded && "min-w-0 flex-1",
          focusRingClassName
        )}
      >
        <p className="m-0 whitespace-nowrap text-xxs font-semibold leading-[1.333] tracking-[-0.01em] text-foreground">
          {name}
        </p>
        <span
          aria-live="polite"
          className="m-0 whitespace-nowrap text-xxs font-normal leading-[1.333] tracking-[-0.01em] text-muted-foreground"
        >
          {locationLabel}
        </span>
      </Link>
    </div>
  );

  const card = (
    <div
      ref={cardRef}
      data-nav-card-variant={variant}
      data-nav-card-expanded={isExpanded ? "" : undefined}
      className={cardClassName}
      style={cardStyle}
    >
      {expandable ? (
        <>
          <div
            data-nav-card-header=""
            className={cn(
              "flex shrink-0 items-center gap-2",
              isExpanded ? "w-full" : "w-max"
            )}
          >
            {profile}
            <ExpandToggle
              expanded={isExpanded}
              panelId={panelId}
              onToggle={() => {
                void cardRef.current?.offsetWidth;
                setExpanded((current) => !current);
              }}
            />
          </div>
          <NavCardExpandPanel
            expanded={isExpanded}
            panelId={panelId}
            onMeet={meetMiniBeni}
          />
        </>
      ) : (
        profile
      )}
    </div>
  );

  return (
    <>
      {expandable ? (
        <div className="relative w-max max-w-full">
          <div
            ref={sizerRef}
            aria-hidden
            className={cn(
              "pointer-events-none invisible flex w-max items-center gap-2 p-1"
            )}
          >
            <span className="size-8 shrink-0" />
            {isCompact ? null : (
              <span className="flex flex-col items-start">
                <span className="m-0 whitespace-nowrap text-xxs font-semibold leading-[1.333] tracking-[-0.01em]">
                  {name}
                </span>
                <span className="m-0 whitespace-nowrap text-xxs font-normal leading-[1.333] tracking-[-0.01em]">
                  {locationLabel}
                </span>
              </span>
            )}
            <span className="size-6 shrink-0" />
          </div>
          {card}
        </div>
      ) : (
        card
      )}
      <MiniBeni embeddedProfile={embeddedProfile} />
    </>
  );
}

function ExpandToggle({
  expanded,
  panelId,
  onToggle,
}: {
  expanded: boolean;
  panelId: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center",
        iconSlotTransitionClassName,
        expanded
          ? "opacity-100"
          : cn(
              "opacity-0",
              "group-hover/nav:opacity-100",
              "group-focus-within/nav:opacity-100",
              "focus-within:opacity-100",
              "[@media(hover:none)]:opacity-100"
            )
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        aria-label={expanded ? "Collapse profile" : "Expand profile"}
        onClick={onToggle}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-gray-10 hover:bg-gray-a3",
          focusRingClassName
        )}
      >
        <ExpandIcon size={16} />
      </button>
    </div>
  );
}

function useLocationLabel(location: string, liveLocation: boolean) {
  const fetchKey = liveLocation ? location : null;
  const [fetched, setFetched] = useState<{
    key: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    if (fetchKey === null) {
      return;
    }

    let cancelled = false;

    fetch("/api/location")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`location ${response.status}`);
        }

        return response.json();
      })
      .then((data: unknown) => {
        if (cancelled) {
          return;
        }

        if (!isNomadsLocation(data)) {
          throw new Error("Invalid location payload");
        }

        setFetched({ key: fetchKey, label: formatNomadsLocation(data) });
      })
      .catch(() => {
        if (!cancelled) {
          setFetched({ key: fetchKey, label: fetchKey });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  if (fetchKey === null) {
    return location;
  }

  return fetched?.key === fetchKey ? fetched.label : LOADING_LOCATION;
}
