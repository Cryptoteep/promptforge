<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/PromptForge-🔥-emerald">
    <img alt="PromptForge" src="https://img.shields.io/badge/PromptForge-🔥-emerald">
  </picture>
</p>

<h1 align="center">PromptForge 🔥</h1>

<p align="center">
  <strong>The open-source, community-driven library of high-quality AI prompts.</strong><br>
  No accounts to browse. No paywalls. No tracking. Built by the community, for the community.
</p>

<p align="center">
  <a href="https://github.com/Cryptoteep/promptforge/stargazers"><img src="https://img.shields.io/github/stars/Cryptoteep/promptforge?style=social" alt="GitHub Stars"></a>
  <a href="https://github.com/Cryptoteep/promptforge/forks"><img src="https://img.shields.io/github/forks/Cryptoteep/promptforge?style=social" alt="GitHub Forks"></a>
  <a href="https://github.com/Cryptoteep/promptforge/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href="https://github.com/Cryptoteep/promptforge/issues"><img src="https://img.shields.io/github/issues/Cryptoteep/promptforge" alt="Open Issues"></a>
  <a href="https://github.com/Cryptoteep/promptforge/pulls"><img src="https://img.shields.io/github/issues-pr/Cryptoteep/promptforge" alt="Open PRs"></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/contributions-welcome-🤝-emerald" alt="Contributions Welcome">
</p>

---

## 📖 About

**PromptForge** is a free, open-source library of curated, high-quality prompts for
large language models. Think of it as a shared, public notebook of prompts that
actually work — written, reviewed, and improved by the community.

### 🎯 Our Mission

> A free, open, community-driven home for high-quality AI prompts.
> No accounts required to browse, no paywalls, no tracking.
> Built by the community, for the community.

We believe the best prompts should be **open**, **discoverable**, and
**improvable** — not locked behind a subscription or a login wall.

### ✨ Features

- 🔥 **Curated prompt library** — 14+ starter prompts across 7 categories (Coding, Writing, Analysis, Creative, Education, Productivity, Business).
- 🧪 **Built-in playground** — test any prompt right in your browser, with `{{variable}}` auto-detection and live model output.
- 🔍 **Search & filter** — find prompts by keyword, category, or popularity.
- 👍 **Community voting** — upvote the prompts you love (deduped, no login required).
- 📤 **Open contributions** — submit prompts via the in-app form or open a pull request.
- 🎨 **Beautiful & accessible** — responsive, light/dark mode, keyboard-navigable, screen-reader friendly.
- 🆓 **Truly free** — MIT licensed, no ads, no tracking, no premium tier. Ever.

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.18+ or [Bun](https://bun.sh/) 1.0+
- A package manager: `bun` (recommended), `npm`, `pnpm`, or `yarn`

### Run locally

```bash
# 1. Clone
git clone https://github.com/Cryptoteep/promptforge.git
cd promptforge

# 2. Install dependencies
bun install   # or: npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your z-ai API key (see .env.example)

# 4. Push the database schema & seed example prompts
bun run db:push
bun run prisma/seed.ts   # seeds 14 example prompts

# 5. Start the dev server
bun run dev
```

Open `http://localhost:3000` in your browser. 🎉

### Environment variables

Create a `.env` file (see `.env.example`):

```env
DATABASE_URL="file:./db/custom.db"
# The z-ai SDK reads its API key from the environment.
# See https://z.ai for details.
```

---

## 🤝 Contributing

We **love** contributions! PromptForge is built by the community, and there are
many ways to help — no coding experience required:

- 📝 **Add a prompt** — submit via the in-app form, or open a PR editing `prisma/seed.ts`.
- 🐛 **Report a bug** — open a [bug report issue](https://github.com/Cryptoteep/promptforge/issues/new?template=bug_report.md).
- 💡 **Suggest a feature** — open a [feature request](https://github.com/Cryptoteep/promptforge/issues/new?template=feature_request.md).
- 🎨 **Improve the UI/UX** — see issues labeled [`good first issue`](https://github.com/Cryptoteep/promptforge/labels/good%20first%20issue).
- 📚 **Improve docs** — typos, clarifications, and translations all welcome.
- ⭐ **Star the repo** — it helps others discover the project.

Please read our [**Contributing Guide**](./CONTRIBUTING.md) and
[**Code of Conduct**](./CODE_OF_CONDUCT.md) before getting started.

### Good first issues

New to the project? Look for issues labeled
[`good first issue`](https://github.com/Cryptoteep/promptforge/labels/good%20first%20issue)
and [`help wanted`](https://github.com/Cryptoteep/promptforge/labels/help%20wanted).
We're happy to mentor first-time contributors!

---

## 🗺️ Roadmap

- [x] Prompt library with search & categories
- [x] In-browser playground with `{{variable}}` support
- [x] Community voting (deduped, no login)
- [x] In-app prompt submission (pending review)
- [x] Shareable deep-links (`?p=<id>`)
- [x] Export prompts as JSON / Markdown
- [x] Keyboard shortcuts (`⌘/Ctrl + Enter` to run)
- [x] Featured prompt banner
- [x] Prompt collections / bundles
- [x] "Fork a prompt" to remix & improve
- [ ] Prompt versioning & edit history
- [ ] Translations (i18n) — help wanted!
- [ ] Per-prompt discussion threads

See the [open issues](https://github.com/Cryptoteep/promptforge/issues) for the
full list of proposed features and known issues.

---

## 🏗️ Tech Stack

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org/) (App Router)        |
| Language     | [TypeScript](https://www.typescriptlang.org/)         |
| Styling      | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Database     | [Prisma](https://www.prisma.io/) + SQLite             |
| AI           | `z-ai-web-dev-sdk` (LLM playground)                   |
| Animations   | [Framer Motion](https://www.framer.com/motion/)       |
| License      | MIT                                                   |

---

## 📜 License

PromptForge is licensed under the **MIT License** — see [LICENSE](./LICENSE).
You're free to use, modify, and distribute it, including commercially.

## 💖 Sponsors

PromptForge is a non-commercial, volunteer-maintained project. If it helps you,
consider [sponsoring](https://github.com/sponsors/Cryptoteep) or just
⭐ **starring** the repo — it means a lot.

## 🙏 Acknowledgements

- Every contributor who adds a prompt, fixes a typo, or opens an issue.
- The open-source projects we build on: Next.js, Prisma, Tailwind, shadcn/ui.

---

<p align="center">
  <sub>Built with care by the open-source community.</sub><br>
  <sub>🐛 Found a bug? <a href="https://github.com/Cryptoteep/promptforge/issues/new?template=bug_report.md">Report it</a> · 💡 Have an idea? <a href="https://github.com/Cryptoteep/promptforge/issues/new?template=feature_request.md">Suggest it</a> · 📝 Got a prompt? <a href="https://github.com/Cryptoteep/promptforge/issues/new?template=prompt_submission.md">Share it</a></sub>
</p>
