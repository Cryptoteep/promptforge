# Changelog

All notable changes to **PromptForge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Roadmap items tracked in the README.

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

[Unreleased]: https://github.com/Cryptoteep/promptforge/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.1
[0.1.0]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.0
