---
name: agentation
description: Agentation visual feedback toolbar is already installed in this Next.js project.
---

# Agentation

The annotation toolbar is already wired and **visible by default in development**.

## Current setup

- Package: `agentation` (dev dependency)
- Client wrapper: `components/agentation-dev-toolbar.tsx`
- Mounted in `app/layout.tsx` on every page when `NODE_ENV === "development"`
- Production builds omit the toolbar

Do not add a second `<Agentation />` instance.

## Usage

In `next dev`, the floating toolbar appears on `/`, `/playground`, and any new routes. Click elements to annotate them, then copy structured markdown for the coding agent.

MCP sync (`agentation-mcp`, port 4747) is **not** configured yet. If the user asks for live annotation syncing with Cursor, set up the MCP server then.

## Notes

- Agentation is a client component and requires React 18+
- Desktop only
- Keep the `NODE_ENV` development guard so it never ships to production
