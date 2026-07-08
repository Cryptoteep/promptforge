# Changelog

All notable changes to **PromptForge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Roadmap items tracked in the README.

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

[Unreleased]: https://github.com/Cryptoteep/promptforge/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Cryptoteep/promptforge/releases/tag/v0.1.0
