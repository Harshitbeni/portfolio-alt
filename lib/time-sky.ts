export const TIME_SKY_VAR = "--time-sky";

type RGB = readonly [number, number, number];
type Stop = { at: number; rgb: RGB };

function hex(value: string): RGB {
  const n = Number.parseInt(value.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Figma v4 / shades frames 1–6 (`55:755`–`55:759`, `55:761`). 0 = bottom. */
const SKY_GRADIENTS: Stop[][] = [
  [
    { at: 0, rgb: hex("#1d339a") },
    { at: 1, rgb: hex("#060d33") },
  ],
  [
    { at: 0, rgb: hex("#82777a") },
    { at: 0.25, rgb: hex("#676783") },
    { at: 1, rgb: hex("#1d2653") },
  ],
  [
    { at: 0, rgb: [194, 131, 65] },
    { at: 0.1, rgb: [165, 118, 77] },
    { at: 0.30279, rgb: [111, 90, 97] },
    { at: 1, rgb: [35, 32, 58] },
  ],
  [
    { at: 0, rgb: hex("#fd8026") },
    { at: 0.30279, rgb: hex("#aa6b49") },
    { at: 1, rgb: hex("#5d414a") },
  ],
  [
    { at: 0, rgb: hex("#f9c687") },
    { at: 0.25, rgb: hex("#b9a6ae") },
    { at: 1, rgb: hex("#4b60ba") },
  ],
  [
    { at: 0, rgb: hex("#abc2ff") },
    { at: 0.25, rgb: hex("#849fff") },
    { at: 1, rgb: hex("#4f70dd") },
  ],
];

const CYCLE = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function sample(stops: Stop[], at: number): RGB {
  const first = stops[0];
  const last = stops[stops.length - 1];

  if (!first || !last || at <= first.at) return first?.rgb ?? [0, 0, 0];
  if (at >= last.at) return last.rgb;

  for (let i = 0; i < stops.length - 1; i++) {
    const from = stops[i];
    const to = stops[i + 1];
    if (!from || !to || at > to.at) continue;
    const span = to.at - from.at;
    return lerpRgb(from.rgb, to.rgb, span === 0 ? 0 : (at - from.at) / span);
  }

  return last.rgb;
}

function mixStops(from: Stop[], to: Stop[], t: number): Stop[] {
  const ats = [...new Set([...from.map((stop) => stop.at), ...to.map((stop) => stop.at)])].sort(
    (a, b) => a - b
  );

  return ats.map((at) => ({
    at,
    rgb: lerpRgb(sample(from, at), sample(to, at), t),
  }));
}

function toCss(stops: Stop[]) {
  const parts = stops.map((stop) => {
    const r = Math.round(stop.rgb[0]);
    const g = Math.round(stop.rgb[1]);
    const b = Math.round(stop.rgb[2]);
    const at = `${(stop.at * 100).toFixed(3)}%`;
    return `rgb(${r} ${g} ${b}) ${at}`;
  });

  return `linear-gradient(to top, ${parts.join(", ")})`;
}

export function getTimeSkyProgress(date: Date) {
  const ms =
    date.getHours() * 3_600_000 +
    date.getMinutes() * 60_000 +
    date.getSeconds() * 1_000 +
    date.getMilliseconds();
  const scaled = (ms / 86_400_000) * CYCLE.length;
  const index = Math.floor(scaled) % CYCLE.length;
  const t = scaled - Math.floor(scaled);
  const from = CYCLE[index] ?? 0;
  const to = CYCLE[(index + 1) % CYCLE.length] ?? 0;

  return { from, to, t };
}

function skyColorAt(date: Date, at: number): RGB {
  const { from, to, t } = getTimeSkyProgress(date);
  const fromStops = SKY_GRADIENTS[from];
  const toStops = SKY_GRADIENTS[to];

  if (!fromStops || !toStops) return [6, 13, 51];

  return lerpRgb(sample(fromStops, at), sample(toStops, at), t);
}

function channelToLinear(channel: number) {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: RGB) {
  return (
    0.2126 * channelToLinear(rgb[0]) +
    0.7152 * channelToLinear(rgb[1]) +
    0.0722 * channelToLinear(rgb[2])
  );
}

/** Sample where homepage copy sits (upper third of the sky). */
const CONTENT_STOP = 0.72;
/** WCAG crossover where black and white text have equal contrast. */
const LIGHT_SKY_LUMA = 0.179;

export function getTimeSkyCss(date = new Date()) {
  const { from, to, t } = getTimeSkyProgress(date);
  const fromStops = SKY_GRADIENTS[from];
  const toStops = SKY_GRADIENTS[to];

  if (!fromStops || !toStops) {
    return toCss(SKY_GRADIENTS[0] ?? []);
  }

  if (t === 0) return toCss(fromStops);
  if (t === 1) return toCss(toStops);

  return toCss(mixStops(fromStops, toStops, t));
}

export function getTimeSkyAppearance(date = new Date()): "light" | "dark" {
  return relativeLuminance(skyColorAt(date, CONTENT_STOP)) >= LIGHT_SKY_LUMA
    ? "light"
    : "dark";
}

export function applyTimeSky(date = new Date()) {
  const root = document.documentElement;
  const sky = getTimeSkyAppearance(date);
  root.style.setProperty(TIME_SKY_VAR, getTimeSkyCss(date));
  root.classList.toggle("dark", sky === "dark");
  root.dataset.timeSky = sky;
}

export function clearTimeSky() {
  const root = document.documentElement;
  root.style.removeProperty(TIME_SKY_VAR);
  delete root.dataset.timeSky;
}
