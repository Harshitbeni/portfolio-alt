<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio

Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui (Radix).

## Repository roles

- `/Users/harshitbeni/Repos/portfolio-alt` is the new portfolio and the active working repository. Make all requested portfolio changes here unless the user says otherwise.
- `/Users/harshitbeni/Repos/portfolio` is the old portfolio. Use it only as a reference for content, design, structure, and implementation details.
- Do not edit the old portfolio unless the user explicitly asks for changes there.
- When copying from the old portfolio, adapt the work to the new portfolio instead of overwriting the new project wholesale.

## Design system

Start small. Add colors and components only when asked.

- **Type:** Tokens: `3XL` (`--type-3xl`, 36px), `2XL` (`--type-2xl`, 32px), `XL` (`--type-xl`, 24px), `LG` (`--type-lg`, 20px), `MD` (`--type-md`, 16px; `text-md-medium` / `text-md-semibold` at 500 / 600), `SM` (`--type-sm`, 14px), `XS` (`--type-xs`, 13px), `XXS` (`--type-xxs`, 12px). Add more type tokens only when asked.
- **Shadows:** Radix Themes scale `--shadow-1`–`--shadow-6` (light/dark). Tailwind `shadow-sm` / `shadow-md` / `shadow-lg` map to 2 / 4 / 5.
- **Components:** shadcn/ui (Radix). Installed: `Button`, `Dropdown Menu`, `Checkbox`, `Input`, `Bubble`. Add more with `npx shadcn@latest add <name>`.
- **Colors:** Radix `gray`, `red`, `green`, `yellow`, `blue`, and `purple` 1–12, plus Radix `gray` alpha (`--gray-a1`–`--gray-a12`). Semantic status still maps to `--red-9` / `--green-9` / `--yellow-9`. Tokens live in `app/globals.css`.
- **Font:** Inter variable via `next/font/google` (`--font-inter`). Do not pass a `weight` array to `next/font`.
- **Icons:** Central Icons (`@central-icons-react/all`) through `IconProvider` in `lib/icon-context.tsx`. Use `useIcon("plus")` (and the other named slots) instead of Lucide. Default style is round / outlined / radius 1 / stroke 1.5. Installing the package requires `CENTRAL_LICENSE_KEY` in the environment (see `.env.example`); never put the key in source or this file. Skill: `.agents/skills/central-icons`
- **Playground:** `/playground` is for live, session-only token and component tweaks. It does not write CSS files.

## Dev tools

### Agentation (always on in development)

- Package: `agentation` (dev dependency)
- Mounted from `components/agentation-dev-toolbar.tsx` in `app/layout.tsx`
- Visible by default in `next dev`; omitted from production
- Skill: `.agents/skills/agentation`

## Interaction libraries (installed, unused until asked)

### Cuelume

- Package: `cuelume` — included, not used in the UI yet
- When the user asks for sound on a component, add Cuelume there **and to similar cases in that change**
- Do not add a global sound layer or cue unrelated surfaces
- Skill: `.agents/skills/cuelume`

### Torph

- Package: `torph` — included, not used in the UI yet
- Use only in the **named scenario**. Do not apply it to similar copy unless asked
- Import from `torph/react` only, in a Client Component
- Skill: `.agents/skills/torph`

## Interface skills (agent, not UI)

From [jakubkrehel/skills](https://github.com/jakubkrehel/skills). These are agent instructions, not packages to import. Follow them when building or reviewing UI. `interface-review` is user-invoked only.

- `better-interface` — holistic review that routes to the domain skills below
- `better-ui`, `better-typography`, `better-colors`, `better-accessibility`, `better-layout`, `better-writing`
- `interface-review` — change-scoped review (`disable-model-invocation`); run it by name
- Lockfile: `skills-lock.json`
