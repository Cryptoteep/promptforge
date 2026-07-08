# Contributing to PromptForge

First off — **thank you** for taking the time to contribute! 🎉

PromptForge is a community project, and every contribution matters: a new
prompt, a typo fix, a bug report, a feature idea, or just a star. This document
explains how to get involved.

> 💬 **New here?** We mentor first-time contributors. Look for issues labeled
> [`good first issue`](https://github.com/Cryptoteep/promptforge/labels/good%20first%20issue)
> and don't hesitate to ask questions.

## 📜 Code of Conduct

By participating, you agree to uphold our
[Code of Conduct](./CODE_OF_CONDUCT.md). Please be kind, respectful, and
inclusive. Harassment of any kind will not be tolerated.

---

## 🗂️ Table of Contents

- [Ways to contribute](#-ways-to-contribute)
- [Development setup](#-development-setup)
- [Contribution workflow](#-contribution-workflow)
- [Adding a prompt](#-adding-a-prompt)
- [Coding standards](#-coding-standards)
- [Commit messages](#-commit-messages)
- [Pull requests](#-pull-requests)
- [Reporting bugs](#-reporting-bugs)
- [Suggesting features](#-suggesting-features)

---

## 🤝 Ways to contribute

You don't need to write code to help! Here are some great ways to contribute:

| Way                       | How                                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| 📝 Add a prompt           | Submit via the in-app form, or edit `prisma/seed.ts` and open a PR        |
| 🐛 Report a bug           | [Open a bug report](https://github.com/Cryptoteep/promptforge/issues/new?template=bug_report.md) |
| 💡 Suggest a feature      | [Open a feature request](https://github.com/Cryptoteep/promptforge/issues/new?template=feature_request.md) |
| 🎨 Improve UI/UX          | Pick a [`good first issue`](https://github.com/Cryptoteep/promptforge/labels/good%20first%20issue) |
| 📚 Improve docs           | Fix typos, clarify wording, add translations                              |
| ⭐ Star the repo          | It helps others discover PromptForge                                       |
| 💬 Help in issues         | Answer questions, reproduce bugs, review PRs                              |

---

## 🛠️ Development setup

### Prerequisites

- Node.js 18.18+ or Bun 1.0+
- Bun (recommended) — `curl -fsSL https://bun.sh/install | bash`

### Steps

```bash
# 1. Fork & clone
git clone https://github.com/<your-username>/promptforge.git
cd promptforge

# 2. Install dependencies
bun install

# 3. Set up environment
cp .env.example .env
# Edit .env — set DATABASE_URL and your z-ai API key

# 4. Database
bun run db:push          # create schema
bun run prisma/seed.ts   # seed example prompts

# 5. Run
bun run dev              # http://localhost:3000

# 6. Lint before committing
bun run lint
```

---

## 🔄 Contribution workflow

1. **Fork** the repo and create your branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   # or: fix/typo-in-readme, prompt/add-commit-message-helper
   ```
2. **Make your changes.** Keep commits focused.
3. **Lint:** `bun run lint` — must pass with no errors.
4. **Test manually** in the browser (the dev server auto-reloads).
5. **Commit** using [conventional commit messages](#-commit-messages).
6. **Push** to your fork and open a Pull Request against `main`.
7. **Reference** any related issue (e.g. `Closes #42`).
8. **Respond** to review feedback kindly and iteratively.

---

## 📝 Adding a prompt

Prompts live in [`prisma/seed.ts`](./prisma/seed.ts). To add one:

1. Add a new object to the `prompts` array:
   ```ts
   {
     title: "Generate a release notes draft",
     description: "Turn a list of commits or changes into polished release notes.",
     content: "You are a technical writer. Given the following list of changes, draft release notes grouped by category (Features, Fixes, Breaking). Use clear, friendly language.\n\nChanges:\n{{changes}}",
     category: "writing",          // one of: coding, writing, analysis, creative, education, productivity, business
     tags: "release-notes,documentation,changelog",
     authorName: "Your Name",
     authorGithub: "your-handle",   // optional
     model: "glm-4.6",
     exampleOutput: "## Features\n- ...\n\n## Fixes\n- ...",
   }
   ```
2. Run `bun run prisma/seed.ts` to verify it inserts cleanly.
3. Open a PR.

### Prompt guidelines

- **Useful & specific** — generic prompts ("write a story") are less valuable than targeted ones.
- **Use `{{variables}}`** for inputs the user will fill in.
- **Original or properly attributed** — don't copy copyrighted material.
- **Tested** — run it in the playground and include a representative `exampleOutput`.
- **Safe** — no prompts that produce harmful, illegal, or harassing content.

---

## 🧹 Coding standards

- **TypeScript everywhere**, strict mode.
- **ESLint** must pass: `bun run lint`.
- **shadcn/ui** components for UI — don't reinvent existing components.
- **Tailwind CSS** for styling. No indigo/blue as primary accent.
- **Accessible by default**: semantic HTML, ARIA labels, keyboard support.
- **Responsive**: mobile-first; test at 375px, 768px, 1280px.
- **Server vs client**: `z-ai-web-dev-sdk` and Prisma live server-side only. Use `'use client'` only where needed.
- **No tests required** for prompt additions; for code changes, manual verification is fine for now.

---

## 💬 Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]
```

Types: `feat`, `fix`, `prompt`, `docs`, `style`, `refactor`, `chore`, `ci`.

Examples:
```
prompt: add release-notes drafter to writing category
feat(playground): stream model output token-by-token
fix(footer): prevent overlap on short pages
docs: clarify local setup steps in README
```

---

## 🚀 Pull requests

- **One change per PR** — keep it reviewable.
- **Use the PR template** — fill in the checklist.
- **Link related issues** (`Closes #123`, `Refs #456`).
- **Be patient & kind** — reviews are volunteer work.
- **Don't force-push** after requesting review (it makes comments hard to follow).

A maintainer will review your PR as soon as they can. Small PRs usually merge
quickly; larger ones may need discussion.

---

## 🐛 Reporting bugs

Use the [bug report template](https://github.com/Cryptoteep/promptforge/issues/new?template=bug_report.md).
Include:

- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if visual)
- Browser/OS
- Console errors

---

## 💡 Suggesting features

Use the [feature request template](https://github.com/Cryptoteep/promptforge/issues/new?template=feature_request.md).
Explain the **problem** you're trying to solve, not just the solution you
propose. This leads to better discussions.

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/Cryptoteep/promptforge/discussions) (if enabled),
- Or open an issue with the `question` label.

Happy forging! 🔥
