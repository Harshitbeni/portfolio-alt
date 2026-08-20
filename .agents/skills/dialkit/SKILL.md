---
name: dialkit
disable-model-invocation: true
description: >-
  On-demand DialKit control panels for tuning animation and style values in React.
  Invoke only when the user asks to dial, tune, tweak, or add live controls.
---

# DialKit

**Part of Interface Craft by Josh Puckett**

Generate DialKit configurations for React + Motion projects — live control panels for tuning animation and style values in real time.

This project already has `dialkit` and `motion` installed as **devDependencies**. DialKit is **not mounted**. Do not import `useDialKit` or `DialRoot` until the user explicitly asks.

## When asked to enable DialKit

1. Confirm `dialkit` and `motion` are in `package.json` (already installed).
2. Add `DialRoot` once, in a development-only client wrapper (same `NODE_ENV` guard as Agentation):

```tsx
import { DialRoot } from "dialkit";
import "dialkit/styles.css";

<DialRoot position="top-right" />
```

3. Then generate `useDialKit` configs for the requested component.

Do not enable DialKit because the user is on `/playground`. The playground uses its own token controls.

## When to Use

- User mentions DialKit, dials, sliders, controls, tune, tweak
- User wants a live UI to adjust animation parameters
- User says "add controls for..." or "let me tune..." **and** names DialKit or asks the coding agent to use it

## Mode Detection

### Direct Mode

Triggers when the user describes what they want with context:

- "use DialKit to give me sliders for blur and opacity"
- "add dialkit controls for scale, rotation, and a spring"

Generate the config immediately based on the request.

### Guided Mode

Triggers when the user invokes without specific context:

- "help me set up dialkit"
- "walk me through adding dialkit"

Ask 2-3 concise questions then generate.

## Guided Flow Questions (2-3 max)

1. **Component context**: "What component are you adding controls to?"
2. **Property selection**: "What properties do you want to tweak? (blur, opacity, scale, spring, borderRadius, colors...)"
3. Generate with smart defaults — don't ask about ranges.

## Smart Defaults

| Property | Default | Min | Max | Step |
| --- | --- | --- | --- | --- |
| blur | 0 | 0 | 100 | 1 |
| opacity | 1 | 0 | 1 | 0.01 |
| scale | 1 | 0.5 | 2 | 0.1 |
| rotation | 0 | -180 | 180 | 1 |
| offsetX | 0 | -100 | 100 | 1 |
| offsetY | 0 | -100 | 100 | 1 |
| borderRadius | 0 | 0 | 50 | 1 |
| shadowBlur | 16 | 0 | 48 | 1 |
| shadowOffsetY | 8 | 0 | 24 | 1 |
| gap | 16 | 0 | 48 | 1 |
| padding | 16 | 0 | 48 | 1 |

## Output Format

Always generate complete, copy-paste ready code:

```tsx
import { useDialKit } from "dialkit";
import { motion } from "motion/react";

function ComponentName() {
  const params = useDialKit("ComponentName", {
    // Generated config here
  });

  return (
    <motion.div
      style={{
        // Apply params
      }}
      animate={{
        // Animate params
      }}
      transition={params.spring}
    />
  );
}
```
