export const MINI_BENI_PROFILE_ALT =
  "harshit beniwal profile photo illustrated";
export const REVEAL_SETTINGS_EVENT = "mini-beni:reveal-settings";
export const REQUEST_REVEAL_SETTINGS_EVENT =
  "mini-beni:request-reveal-settings";

export type RevealState = "docked" | "revealing" | "free";

export type Position = {
  x: number;
  y: number;
};

export type ViewportBounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type RevealSettings = {
  profileFadeMs: number;
  petFadeMs: number;
  fadeGapMs: number;
  textMoveMs: number;
  petHeight: number;
  initialOffsetX: number;
  initialOffsetY: number;
};

export const DEFAULT_REVEAL_SETTINGS: RevealSettings = {
  profileFadeMs: 250,
  petFadeMs: 250,
  fadeGapMs: 0,
  textMoveMs: 350,
  petHeight: 80,
  initialOffsetX: 0,
  initialOffsetY: 48,
};

export type ProfileRecord = {
  image: Element;
  circle: HTMLElement;
  link: HTMLElement;
  text: HTMLElement;
};

export function getRevealDurationMs(settings: RevealSettings): number {
  return settings.profileFadeMs + settings.fadeGapMs + settings.petFadeMs;
}

export function nextRevealState(
  state: RevealState,
  hasRecord: boolean,
): RevealState {
  return state === "docked" && hasRecord ? "revealing" : state;
}

export function completeRevealState(state: RevealState): RevealState {
  return state === "revealing" ? "free" : state;
}

export function dockRevealState(state: RevealState): RevealState {
  return state === "free" || state === "revealing" ? "docked" : state;
}

export function getViewportBounds(): ViewportBounds {
  const viewport = window.visualViewport;

  return {
    left: 0,
    top: 0,
    right: viewport?.width ?? window.innerWidth,
    bottom: viewport?.height ?? window.innerHeight,
  };
}

export function clampPosition(
  position: Position,
  width: number,
  height: number,
  bounds: ViewportBounds = getViewportBounds(),
): Position {
  const maxX = Math.max(bounds.left, bounds.right - width);
  const maxY = Math.max(bounds.top, bounds.bottom - height);

  return {
    x: Math.min(Math.max(position.x, bounds.left), maxX),
    y: Math.min(Math.max(position.y, bounds.top), maxY),
  };
}

export function getInitialPosition(
  circleRect: Pick<DOMRect, "left" | "top" | "width" | "height">,
  petWidth: number,
  petHeight: number,
  offset: Position,
  bounds?: ViewportBounds,
): Position {
  return clampPosition(
    {
      x:
        circleRect.left +
        (circleRect.width - petWidth) / 2 +
        offset.x,
      y:
        circleRect.top +
        (circleRect.height - petHeight) / 2 +
        offset.y,
    },
    petWidth,
    petHeight,
    bounds,
  );
}

function hasClosest(value: unknown): value is Element {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { closest?: unknown }).closest === "function"
  );
}

function isHtmlElement(value: unknown): value is HTMLElement {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { setAttribute?: unknown }).setAttribute === "function" &&
    typeof (value as { getClientRects?: unknown }).getClientRects === "function"
  );
}

function isAnchorElement(value: unknown): value is HTMLAnchorElement {
  return isHtmlElement(value) &&
    String((value as { tagName?: unknown }).tagName).toUpperCase() === "A";
}

export function findProfileRecords(
  root: Pick<ParentNode, "querySelectorAll"> = document,
): ProfileRecord[] {
  const selector = `img[alt="${MINI_BENI_PROFILE_ALT}"]`;
  const records: ProfileRecord[] = [];

  for (const image of Array.from(root.querySelectorAll(selector))) {
    if (!hasClosest(image)) {
      continue;
    }

    const circle = image.closest('[data-framer-name="profile"]');
    const link = hasClosest(circle) ? circle.closest("a") : null;
    const text = circle?.nextElementSibling;

    if (
      !isHtmlElement(circle) ||
      !isAnchorElement(link) ||
      !isHtmlElement(text)
    ) {
      continue;
    }

    records.push({ image, circle, link, text });
  }

  return records;
}

const SETTING_RANGES: Record<keyof RevealSettings, readonly [number, number]> = {
  profileFadeMs: [80, 600],
  petFadeMs: [80, 600],
  fadeGapMs: [0, 400],
  textMoveMs: [100, 700],
  petHeight: [64, 144],
  initialOffsetX: [-100, 100],
  initialOffsetY: [-100, 100],
};

export function isRevealSettings(value: unknown): value is RevealSettings {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (Object.keys(SETTING_RANGES) as (keyof RevealSettings)[]).every(
    (key) => {
      const setting = candidate[key];
      const [minimum, maximum] = SETTING_RANGES[key];

      return (
        typeof setting === "number" &&
        Number.isFinite(setting) &&
        setting >= minimum &&
        setting <= maximum
      );
    },
  );
}
