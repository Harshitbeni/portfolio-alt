---
name: torph
description: >-
  Adds Torph text morphing to one named scenario. Use when the user asks to
  morph, transition, or animate a specific changing string with Torph. Do not
  apply it to similar copy unless they say so.
---

# Torph

Dependency-free animated text morphing. Import the React adapter; do not use Vue/Svelte/vanilla entry points in this Next.js app.

The package is installed. Nothing in the UI uses it yet. Do not wrap copy in `TextMorph` unless the user names that scenario.

## When the user asks

Use Torph only on the instance they name. Do not spread it to sibling headings, other statuses, or "similar" labels. If they want another surface to morph, they will ask.

The string must actually change. Static copy does not need Torph.

## How to add it

1. Import from `torph/react` in a Client Component (`"use client"`).
2. Leave `respectReducedMotion` at its default (`true`).
3. Prefer `TextMorph` over `useTextMorph` unless they need a custom element.

```tsx
"use client";

import { TextMorph } from "torph/react";

<TextMorph as="h1" className="font-sans">
  {text}
</TextMorph>
```

Spring easing (duration is derived from the spring):

```tsx
<TextMorph ease={{ stiffness: 200, damping: 20 }}>{text}</TextMorph>
```

## Props that matter here

| Prop | Default | Notes |
| --- | --- | --- |
| `children` | required | The text to morph |
| `as` | `"span"` | Semantic element (`h1`, `p`, …) |
| `duration` | `400` | Ignored when `ease` is a spring |
| `ease` | `"cubic-bezier(0.19, 1, 0.22, 1)"` | CSS easing or `{ stiffness, damping, mass, precision }` |
| `scale` | `true` | Scale exiting segments |
| `respectReducedMotion` | `true` | Keep on |
| `disabled` | `false` | Skip animation |

Do not import `torph` (vanilla), `torph/vue`, or `torph/svelte`.
