# Privado Mobile Case Study Layout Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Privado Mobile App Scan case study follow the old portfolio's layout patterns while keeping the new portfolio's current width and token system.

**Architecture:** Keep the existing block-based case-study renderer. Add an opt-in desktop table-of-contents mode to the shared section navigation, and enable the old-layout spacing only for the Privado mobile case study. Convert its three separate detail questions into the existing `qa-group` block so no new content model is required.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, Radix color tokens, existing portfolio type tokens.

---

## Chunk 1: Page structure

### Task 1: Combine the introductory details

**Files:**

- Modify: `lib/case-studies/privado-mobile-app-scan.ts:22-40`
- Reuse: `components/case-study/case-study-article.tsx:577-596`

- [ ] **Step 1: Replace the three separate `qa` blocks with one `qa-group` block**

Use the existing questions and answers without copy changes:

```ts
{
  type: "qa-group",
  items: [
    {
      question: "What's Privado?",
      answer:
        "Privado is a platform that scans codebases with its proprietary code-scan engine to map data flows and catch privacy risks before they ship.",
    },
    {
      question: "What's the gap?",
      answer:
        "Code-scan works perfectly for web apps, but not at all for mobile apps. This meant losing half of our market, as they were unable to use Privado.",
    },
    {
      question: "What was my role?",
      answer:
        "I led the end-to-end design, collaborating with the engineering and product teams to bring Privado's privacy tools to mobile apps.",
    },
  ],
}
```

- [ ] **Step 2: Confirm only one grouped details panel is rendered**

Run the local page and inspect the Details section. Expected: one bordered token-based panel contains all three rows; each row keeps its small question marker; no individual question card borders remain; Team, Links, and Timeline remain below it.

### Task 2: Add the opt-in desktop table of contents

**Files:**

- Modify: `components/case-study/case-study-section-nav.tsx:11-92`
- Modify: `components/case-study/case-study-article.tsx:786-813`

- [ ] **Step 1: Add an optional desktop-list prop**

Extend `CaseStudySectionNav` with `showDesktopList?: boolean`. Keep one `activeId`, one observer, and one click handler for both navigation presentations.

- [ ] **Step 2: Render the fixed desktop list when enabled**

At 1024 px widths and above, render a fixed 120 px list with these rules:

```tsx
className="fixed top-32 z-10 hidden w-[120px] flex-col gap-2 min-[1024px]:flex"
style={{ left: "calc(50% - 460px)" }}
```

Use real `<a href="#section-id">` links styled as plain token-based text. Use the shared click handler to keep the existing controlled scroll behavior. The active item uses `text-gray-a12`; inactive items use `text-gray-a10` and `hover:text-gray-a12`. Keep visible keyboard focus. Add `aria-current="true"` only to the active item.

- [ ] **Step 3: Keep the compact navigation below 1024 px**

Add `min-[1024px]:hidden` to the existing horizontal sticky pill navigation when the desktop list is enabled. Preserve the current navigation unchanged when `showDesktopList` is false.

Update the shared click handler to use instant scrolling when `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and smooth scrolling otherwise.

- [ ] **Step 4: Enable the desktop list only for Privado mobile**

In `BlockCaseStudyArticle`, set:

```ts
const usesOldLayout = caseStudy.slug === "privado-mobile-app-scan";
```

Pass `showDesktopList={usesOldLayout}`. Do not change other case studies.

- [ ] **Step 5: Verify the navigation implementation before continuing**

Run `npm run lint`, then inspect the page at 1024 px and just below 1024 px. Expected at 1024 px: the fixed list is visible, the pills are hidden, the list stays 128 px from the viewport top while scrolling, and it does not cover the article. Expected below 1024 px: the list is hidden and the pills are visible. In both presentations, clicking a section scrolls to it, only the active item has `aria-current="true"`, and every control has a visible keyboard focus state. With reduced motion enabled, clicking a section must scroll without smooth animation.

## Chunk 2: Spacing and token fidelity

### Task 3: Apply generous section spacing without changing width

**Files:**

- Modify: `components/case-study/case-study-article.tsx:792-814`

- [ ] **Step 1: Preserve the current article width**

Keep `w-full max-w-[600px] px-4`. Do not add a wrapper that changes the article's centered position or its content width.

- [ ] **Step 2: Increase major section spacing for Privado mobile**

Use `gap-20 sm:gap-24` for the Privado mobile sections and retain `gap-16` for other case studies.

- [ ] **Step 3: Increase spacing between the Privado process explorations**

Pass the `usesOldLayout` flag into `CaseStudySectionBlock`. For the Privado `process` and `solution` sections, use `gap-12` between rendered blocks so each exploration reads as a separate step. Preserve the existing `sectionBlockGap` result for all other case studies and sections.

- [ ] **Step 4: Keep existing two-column rules**

Do not modify the existing grids. Context cards and paired media remain two columns from the project's `sm` breakpoint. Confirm in the browser that `sm` resolves at 640 px. Comparison cards and the web/mobile scan diagram remain two columns at every width.

- [ ] **Step 5: Audit all case-study token usage**

Audit the complete Privado page: header, section labels, headings, body copy, captions, links, images, videos, cards, borders, accents, backgrounds, radii, and shadows. The header must use `text-lg-semibold`, `text-md`, `text-gray-a12`, and `text-gray-a11`. Media surfaces must use `var(--radius)` or the project radius utility plus the existing gray border/background tokens. If any raw color, one-off font size, or non-token surface style is found in code used by this page, replace it with the correct existing project token. Do not add a new color or type token.

- [ ] **Step 6: Verify spacing, width, grids, and media treatment before continuing**

Inspect the page in the browser at 1440 px, 800 px, 640 px, and 639 px. Expected: the article content box remains 568 px wide inside the unchanged 600 px shell; major section gaps are 96 px at 640 px and above and 80 px below 640 px; Privado process and solution explorations have 48 px separation; context cards and paired media switch from two columns at 640 px to one column at 639 px; comparison cards and the web/mobile diagram remain two columns; images and videos use the new token radius, border, background, and shadow treatment.

## Chunk 3: Verification

### Task 4: Run static checks

**Files:**

- Verify: all modified files

- [ ] **Step 1: Run formatting validation**

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit code 0.

- [ ] **Step 3: Run a production build**

Run: `npm run build`

Expected: exit code 0 and the Privado route builds successfully.

### Task 5: Verify the layout in a real browser

**Files:**

- Verify route: `/work/privado-mobile-app-scan`

- [ ] **Step 1: Check wide desktop at 1440 px**

Confirm the article remains 600 px wide, the 120 px table of contents is fixed to its left, one item is active, the list does not cover the article, Details is one combined panel, and major section gaps are generous. Confirm process and solution explorations have 48 px separation. Capture a wide-desktop screenshot.

- [ ] **Step 2: Check the 1024 px boundary**

Confirm the desktop list is visible at 1024 px and the horizontal pills are hidden. Check just below 1024 px and confirm the desktop list hides and the horizontal navigation returns. Click multiple section items in both presentations. Confirm the page scrolls to the correct section, both versions share the same active state, only the active item has `aria-current="true"`, and focus remains visible during keyboard navigation. Enable reduced motion and confirm section navigation scrolls instantly.

- [ ] **Step 3: Check the 640 px boundary**

Confirm context cards and paired media use two columns at 640 px and one column just below it. Confirm comparison cards and the web/mobile diagram stay two columns.

- [ ] **Step 4: Check mobile at 390 px**

Confirm the page has no horizontal overflow, the sticky navigation remains usable, copy wraps, and the details panel stays inside the page margins. Audit the rendered hero, text, media surfaces, cards, borders, backgrounds, accents, radii, and shadows against the new portfolio tokens. Capture a mobile screenshot.

- [ ] **Step 5: Check console output**

Confirm there are no new browser errors or hydration warnings on the Privado route.

- [ ] **Step 6: Run a shared-component regression check**

Open `/work/privado-assessments` at desktop and mobile widths. Confirm its article width, current horizontal section navigation, section spacing, and layout are unchanged; confirm it does not receive the new fixed desktop table of contents; and confirm there are no new console errors.

## Scope Guard

Do not change the current width, navigation outside this case study, copy, media files, data model, backend behavior, or other case-study layouts. Do not create a commit unless the user asks for one.
