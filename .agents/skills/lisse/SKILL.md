---
name: lisse
description: >-
  Applies Lisse squircles to every visible rounded corner. Use when adding
  border-radius, rounded Tailwind classes, cards, buttons, chips, overlays,
  or any clipped/rounded surface.
---

# Lisse

Figma/Apple smooth corners (`squircle`, smoothing `0.65`) via `@lisse/react`. This project uses them on **every visible rounded corner**.

Package is installed. Helpers live in `lib/lisse.ts`.

## Rule

If it has a visible `border-radius`, it gets Lisse. Keep the Tailwind/CSS radius (source of truth for the number); Lisse replaces the circular arc with a squircle clip.

Do not leave new `rounded-*` fills, borders, or elevated shells on CSS arcs.

Do not fork generated shadcn files to inject `useLisse` — the next `shadcn add` would wipe it. Keep Lisse on app-authored rounded surfaces (swatches, custom chrome).

## How

Existing element (preferred — no extra wrapper):

```tsx
const ref = useRef<HTMLButtonElement>(null);
useLisse(ref, "measure"); // or a pixel radius; third arg autoEffects
```

Motion overlay with a **fixed** radius (`LisseMotion` in `lib/lisse-motion.tsx`). Per-corner animated radii: `applyLisseClip` + `lissePerCorner` in `onUpdate`.

## Constraints

- Client Components only (`ResizeObserver`).
- `clip-path` clips descendants: portalled menus/tooltips, not children of the clipped node.
- Do not clip a scroll container. Clip the rounded shell; put `overflow-y-auto` on an inner unclipped element.
- Focus: `outline` + `outline-offset`, not Tailwind `ring` / `box-shadow` (those clip).
- `autoEffects: false` when border or box-shadow **animates**. `true` for static borders/shadows (swatches, focus-ring overlays).
- Default smoothing is `LISSE_SMOOTHING` (`APPLE_SMOOTHING`, 0.65). Do not switch to `FIGMA_SMOOTHING` unless asked.
