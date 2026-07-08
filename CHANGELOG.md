# Changelog

All notable changes to **PromptForge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Roadmap items tracked in the README.

## [0.1.9] — 2026-01-08

### Added
- 🔗 **Per-prompt share count** — clicking the Share button in the detail dialog
  now increments a privacy-friendly `shares` counter on the prompt (no identity
  stored, just an aggregate). The count shows as an amber pill in the dialog's
  meta row (only when > 0). New `POST /api/shares` endpoint; new `shares` column
  on the Prompt model.
- 📥 **Import bookmarks bundle** — the Bookmarks row now has an Import button
  (Upload icon) that accepts a previously-exported `promptforge-bookmarks.md`
  file, parses the `# {title}` headers, matches them against the loaded prompt
  list by title (case-insensitive), and adds the matched prompts to your
  bookmarks. The bookmarks toolbar now shows even with 0 bookmarks (so you can
  import into an empty state). Deduped — only adds prompts not already
  bookmarked.

### Changed
- **Schema** — added `shares Int @default(0)` to the Prompt model.
- **Detail dialog** — share count amber pill in the meta row; optimistic count
  bump on share click.
- **Bookmarks row** — toolbar (Import + Export + Clear) always visible when
  import is available; chips only render when there are bookmarks.

## [0.1.8] — 2026-01-08

### Added
- 📊 **Stats dashboard** — a new "By the numbers" section showing a live snapshot
  of the library: total prompts, total upvotes, avg upvotes/prompt, category
  count, distinct authors, and the largest category. Includes highlight cards
  (largest category + most-upvoted prompt) and a per-category breakdown bar
  chart with percentages. Computed from the live prompt list, so it stays
  accurate as the library grows.
- 💾 **Playground history now persists** — successful playground runs are now
  saved to localStorage (key `promptforge:playground-history`, capped at 5),
  so the "Recent runs" strip survives page refreshes. Previously session-only.

### Changed
- **Page layout** — StatsDashboard inserted between the featured banner and
  the category overview.
- **Playground** — history hydrates from localStorage on mount and persists on
  every change (after hydration to avoid clobbering).

## [0.1.7] — 2026-01-08

### Added
- 🔖 **Bookmark from the detail dialog** — the prompt detail dialog now has a
  Save/Saved bookmark toggle in its footer (next to Fork). Amber when active,
  syncs with the card bookmark. No need to find the card to bookmark a prompt
  you're viewing.
- 📦 **Export all bookmarks as a Markdown bundle** — the Bookmarks row in Browse
  now has an "Export" button that fetches all bookmarked prompts in full and
  downloads them as a single `promptforge-bookmarks.md` file (with a header,
  count, export timestamp, and each prompt separated by `---`). Loading spinner
  while fetching.

### Changed
- **Bookmarks row** — added an Export button (Download icon) alongside Clear.
- **Detail dialog footer** — added a bookmark toggle (Save/Saved) between Fork
  and Test in playground.

## [0.1.6] — 2026-01-08

### Added
- 🔖 **Bookmark / favorite prompts** — every prompt card now has a bookmark
  toggle (amber when active). Bookmarks are localStorage-backed (persist across
  sessions) and shown in a dedicated "Bookmarks" row at the top of Browse, with
  a count badge and a Clear button. Distinct from recently-viewed.
- 📜 **Playground history** — successful playground runs are recorded in a
  session-only "Recent runs" strip (newest first, capped at 5). Click an entry
  to restore its prompt, model, and output. Includes a Clear button.

### Changed
- **Prompt card footer** — added a bookmark toggle button between the upvote
  and the copy/view actions. Amber fill when bookmarked.

## [0.1.5] — 2026-01-08

### Added
- 📋 **Copy as Markdown from the card** — every prompt card's copy button is now
  a dropdown with three options: **Copy description** (just the summary),
  **Copy as Markdown** (full prompt + metadata, fetched on click), and
  **Download .md** (save to your device). No need to open the detail dialog to
  grab a prompt.

### Changed
- **Dark-mode contrast polish** — the hero eyebrow badge, subheadline, and
  trust strip now use higher-contrast text colors (foreground/80→foreground,
  foreground/75→foreground/85, foreground/45→foreground/60) for better
  readability in dark mode. Verified via VLM assessment.

## [0.1.4] — 2026-01-08

### Added
- 🎲 **"Surprise me"** — open a random prompt with one click. Available as a
  CTA in the hero and as a shuffle button next to the sort dropdown in Browse.
  Great for discovery when you don't know what you're looking for.
- ⌨️ **Global keyboard shortcuts**:
  - `/` focuses the Browse search input (and scrolls to it).
  - `Esc` clears all Browse filters (search + category).
  - `⌘/Ctrl + Enter` runs the playground prompt (added in v0.1.1).
  Shortcuts are suppressed when a dialog is open or when typing in a field.

### Changed
- **Hero** — added a third "Surprise me" CTA (ghost variant) alongside Browse
  and Submit.
- **Browse controls** — added a shuffle icon button next to the sort dropdown.
- **Docs section** — the keyboard-shortcuts card now documents all three
  shortcuts (`/`, `Esc`, `⌘/Ctrl + Enter`).

## [0.1.3] — 2026-01-08

### Added
- 🕘 **Recently viewed row** — prompts you open are remembered (localStorage-backed,
  newest first, capped at 8) and shown as a horizontal scroller at the top of
  Browse. Includes a "Clear" button to wipe history. Persists across sessions.
- 🏷️ **Tag-chip search** — tags on prompt cards are now clickable buttons. Click
  a tag to instantly filter the browse grid by that tag (sets the search query
  and scrolls to the results).

### Changed
- **Category overview** — each category card now has a top gradient accent bar,
  a hover icon scale, and a mini progress bar showing the relative prompt count
  per category.
- **Prompt detail dialog** — the meta row (author, date, model) is now a row of
  cardized pills for clarity, plus a prominent upvote-count pill.

## [0.1.2] — 2026-01-08

### Added
- 📦 **Prompt collections** — a new "Collections" section with 4 curated starter
  packs (Developer starter pack, Writing workshop, Get things done, Founder's
  toolkit). Click a collection to preview its prompts. Membership is computed
  from the live prompt list, so counts stay accurate as the library grows.
- 🍴 **"Fork a prompt"** — every prompt's detail dialog now has a Fork button
  that pre-fills the submit form with the prompt's content (author fields left
  blank so the new contributor gets credit). A "Forked from an existing prompt"
  banner appears in the form with a quick-clear action.

### Changed
- **Header nav** — added a "Collections" link for discoverability.
- **Submit form** — accepts a prefill (used by Fork); shows a forked-from
  banner when pre-filled, with an inline clear button.

## [0.1.1] — 2026-01-08

### Added
- 🔗 **Shareable deep-links** — opening a prompt now updates the URL with `?p=<id>`,
  and loading a URL with `?p=` auto-opens that prompt's detail dialog. Links are
  shareable and bookmarkable. Browser back/forward keeps the dialog in sync.
- 📤 **Export prompts** — every prompt can be exported as **Markdown** (`.md`,
  for docs & READMEs) or **JSON** (`.json`, portable & structured) from a new
  Export dropdown in the detail dialog.
- 🔗 **Share button** — copies a shareable deep-link to the clipboard in one click.
- ⌨️ **Keyboard shortcut** — `⌘/Ctrl + Enter` runs the playground prompt when the
  playground section is in view, with a visible `<kbd>` hint.
- 🔥 **Featured prompt banner** — a rotating (7s, pause-on-hover) banner showing
  the top-3 prompts by upvotes, with accessible rotation dots.
- 📚 New docs cards for keyboard shortcuts, sharing, and export.

### Changed
- **Hero redesign** — layered background (color blobs + dot-grid texture),
  animated "live" ping dot, gradient SVG underline, 4 stat cards, prominent
  GitHub star CTA pill, trust strip.
- **Prompt cards** — per-category gradient accent bar on the left edge,
  elevated hover (shadow-lg + border), model pill with status dot, title
  turns primary on hover.
- **Playground** — variables block highlighted in a bordered container with
  primary-colored label, example placeholders, Cpu icon on model selector,
  improved output readability.
- **Docs section** — now 8 cards in a 4-col grid with hover glow + scale,
  whileInView animations.
- **Footer** — added a "Star on GitHub" CTA strip, "Back to top" link,
  Security link, and version badge.

### Fixed
- 🐛 Hero, footer, header, docs, and submit-form all pointed to the wrong
  GitHub URL (`github.com/promptforge/promptforge`). Now correctly point to
  `github.com/Cryptoteep/promptforge` (11 links fixed).
- 🐛 Browse section `scroll-mt` was too small — the search "clear" button
  could be obscured by the sticky header. Increased to `scroll-mt-24`.
- 🐛 Footer displayed "github.com/promptforge" as link text instead of
  "Cryptoteep/promptforge".

## [0.1.0] — 2025-01-15

### Added
- 🎉 Initial public release of PromptForge.
- Prompt library with **14 curated prompts** across **7 categories**
  (coding, writing, analysis, creative, education, productivity, business).
- 🔍 Search and filter by category, with "Popular" and "Newest" sorting.
- 🧪 In-browser **playground** with `{{variable}}` auto-detection and live
  model output powered by `z-ai-web-dev-sdk`.
- 👍 Community **upvoting** (deduped via hashed voter identifier, no login).
- 📤 In-app **prompt submission** (enters as `pending` for review).
- 🎨 Light/dark theme, fully responsive, accessible UI built on shadcn/ui.
- 📜 MIT license, CONTRIBUTING guide, Code of Conduct, SECURITY policy.
- 🤖 GitHub Actions CI (lint + build).

### Known limitations
- Prompts are stored in a local SQLite database (no shared backend by default).
- No prompt versioning yet (planned for a future release).
- No i18n yet — contributions welcome.

[Unreleased]: https://github.com/Cryptoteep/promptforge/compare/v0.1.9...HEAD
[0.1.9]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.9
[0.1.8]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.8
[0.1.7]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.7
[0.1.6]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.6
[0.1.5]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.5
[0.1.4]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.4
[0.1.3]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.3
[0.1.2]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.2
[0.1.1]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.1
[0.1.0]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.0
