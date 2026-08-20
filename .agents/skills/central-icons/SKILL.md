---
name: central-icons
description: Project icon library is Central Icons via IconProvider. Use when adding or swapping icons.
---

# Central Icons

This project uses `@central-icons-react/all` through `IconProvider` (`lib/icon-context.tsx`). Lucide is not the visual default for icons we add ourselves (generated shadcn files may still import Lucide).

## Use named slots first

```tsx
import { useIcon } from "@/lib/icon-context";

const Plus = useIcon("plus");
<Button>
  <Plus />
  Create
</Button>
```

Render icons as children (or `asChild`). Do not pass them as component props.

Slots already mapped: plus, search, sun, moon, chevron-right, chevron-down, x, copy, menu, home, and the rest in `SLOT_TO_CENTRAL`.

## Adding a new icon

1. Look up a `componentName` in `node_modules/@central-icons-react/all/skills/central-icons-react-all/SKILL.md` (or `icons/index.d.ts`). Never guess names.
2. Add a slot in `lib/icon-context.tsx` and map it to that `Icon…` name.
3. Render it with `useIcon("slot-name")`.

Do not import Lucide. Prefer `useIcon` over importing `CentralIcon` directly so stroke/size stay consistent (round, outlined, radius 1, stroke from `strokeWidth`).

Installing `@central-icons-react/all` requires `CENTRAL_LICENSE_KEY` in the environment. The key lives in `.env.local` (gitignored). See `.env.example`.
