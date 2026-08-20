---
name: cuelume
description: >-
  Adds Cuelume Web Audio interaction sounds to a requested UI control and
  similar cases. Use when the user asks to add sound, Cuelume, web audio, or
  hover/press/toggle cues to a component. Do not add sounds unprompted.
---

# Cuelume

Curated interaction sounds synthesized with the Web Audio API. No audio files, no runtime dependencies.

The package is installed. Nothing in the UI uses it yet. Do not add sounds while building a screen unless the user asks for audio on that work.

## When the user asks

They will name a component (or a moment: copy success, error, arrival). Add Cuelume there, then to **similar cases in the same change** — same control kind, same interaction, same surface. Do not sound-enable the rest of the product.

Examples of "similar":

- Sound on the primary button → other primary buttons in that view, not every `<button>`
- Hover tick on a nav link → the other links in that nav, not body links
- `play("success")` after copy → other copy-to-clipboard actions you touch in this change

Not similar: unrelated pages, new features, or a global sound layer.

## How to add it

1. If `bind()` is not already mounted, add it once in a client `useEffect` (app providers or the nearest client parent). Do not bind during render or in a Server Component. Do not add a second `bind()`.
2. Prefer `data-cuelume-*` on the controls. Use `play()` only when there is no pointer/click (copy success, errors, client navigation).
3. Sound supplements visuals. Every cue still needs a visual equivalent. Mute/volume belong to app settings via `setEnabled` / `setVolume` — Cuelume does not persist them.

```tsx
"use client";

import { useEffect } from "react";
import { bind } from "cuelume";

useEffect(() => {
  bind();
}, []);
```

```tsx
<button data-cuelume-press data-cuelume-release>Save</button>
<a data-cuelume-hover="tick">Docs</a>
<button data-cuelume-toggle>Dark mode</button>
```

```ts
import { play, setEnabled, setVolume } from "cuelume";

play("success");
play("success", { volume: 0.4 });
setVolume(0.7);
setEnabled(false);
```

| Attribute | Fires on | Default |
| --- | --- | --- |
| `data-cuelume-hover` | `pointerenter` (fine pointer only) | `chime` |
| `data-cuelume-press` | `pointerdown` | `press` |
| `data-cuelume-release` | `pointerup` | `release` |
| `data-cuelume-toggle` | `click` | `toggle` |

Sounds: `chime`, `sparkle`, `droplet`, `bloom`, `whisper`, `tick`, `press`, `release`, `toggle`, `success`, `error`, `page`, `loading`, `ready`, `pulse`, `scan`, `arrival`.
