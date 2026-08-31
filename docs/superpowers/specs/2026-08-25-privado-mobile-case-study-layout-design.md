# Privado Mobile Case Study Layout Design

## Goal

Bring the Privado Mobile App Scan case study in the new portfolio into visual and structural alignment with the old portfolio while keeping the new portfolio's current content width, color tokens, type tokens, and navigation.

## Approved Direction

The new case study keeps its current narrow article width. It does not copy the old portfolio's 800 px content width or old site navigation.

The page adopts these parts of the old design:

- A fixed table of contents on the left at desktop widths.
- One combined details panel for the three introductory questions.
- Two-column layouts where the current page already compares or pairs content.
- Larger vertical gaps between major sections.
- The old page's restrained media treatment and clear section hierarchy.

The page continues to use the new portfolio's Radix color tokens and existing type tokens. No old raw color values or old font sizes are copied.

## Page Shell

The article remains inside the current `max-w-[600px]` shell with 16 px side padding. The existing Home link and new portfolio navigation behavior stay unchanged.

At viewport widths of 1024 px and above, a 120 px-wide table of contents sits to the left of the article. Its left edge is `calc(50% - 460px)`, which leaves 40 px between its right edge and the 600 px article. It is fixed 128 px from the top of the viewport. Its six links fit in the normal viewport height, so the list does not need its own scrolling region. It uses plain text links, like the old page, rather than pills.

The table of contents must not reduce or shift the article's current width. It is positioned outside the article column. It is hidden below 1024 px.

Below 1024 px, the current horizontal sticky section navigation remains available so every section stays reachable. The desktop and compact navigation render from the same section data and use the same active-section logic.

Only one section is active at a time. The existing `IntersectionObserver` behavior remains authoritative: visible sections are measured within the current `-10% 0px -55% 0px` root margin, and the section with the largest intersection ratio becomes active. Clicking a section scrolls it into view. The active link uses `aria-current="true"`; every link keeps a keyboard-visible focus state. Section clicks use smooth scrolling normally and instant scrolling when the user prefers reduced motion.

## Header and Hero

The existing hero video remains the first visual. Its surface uses the new radius, border, background, and shadow tokens. The title and summary remain below it and use only the existing `LG` and `MD` type tokens.

The hero width remains equal to the current article width. The page does not introduce the old portfolio's 800 px hero width.

## Details

The three question-and-answer items are combined into one panel, matching the old page's grouping. Each row keeps its question, answer, and small visual marker. Internal spacing separates rows; individual bordered cards are removed.

Team, links, and timeline remain below the combined panel. They use the current content and components. Their layout stays compact and uses the new tokens.

## Section Layout

Major sections use generous vertical spacing. The target is a clear pause of approximately 80–96 px between sections at desktop sizes and 64–80 px on smaller screens.

Section labels remain small and muted. Headings, body copy, captions, and links use the existing new type and color tokens.

Existing two-column layouts remain two columns for now. Context cards and paired media use two columns at 640 px and above and one column below 640 px, matching their current responsive behavior. The compact comparison cards and web/mobile scan diagram remain two columns at every width, matching their current behavior. They may be redesigned in a later pass, but this work does not change those rules.

## Media and Cards

Images and videos remain inside the current content width. They use the new radius and border tokens. Process cards keep their current content and media, but spacing becomes more generous so each exploration reads as a distinct step.

No new media, copy, interactions, animation system, or backend behavior is added.

## Responsive Behavior

- 1024 px and above: fixed 120 px left table of contents and the current-width article.
- Below 1024 px: hide the left table of contents and use the existing horizontal sticky navigation.
- Below 640 px: preserve article side padding and allow long text to wrap. Context cards and paired media become one column. Comparison cards and the web/mobile scan diagram stay two columns.

## Verification

The completed page must be checked in a real browser at wide desktop and mobile widths.

Verification must confirm:

- The article width is unchanged.
- The desktop table of contents remains fixed and does not cover the article.
- The details questions render in one combined panel.
- Existing paired content remains two columns where requested.
- Major sections have visibly generous spacing.
- Text, surfaces, borders, accents, and hero styling use the new token system.
- The page has no horizontal overflow or browser console errors.
