"use client";

import { BookOpen, Code2, Variable, GitPullRequest, ShieldCheck, Lightbulb } from "lucide-react";

const DOCS = [
  {
    icon: Variable,
    title: "Variable syntax",
    body: (
      <>
        Wrap dynamic values in double braces:{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground/80">
          {`{{language}}`}
        </code>
        . The playground auto-detects them and renders inputs you can fill in
        before running.
      </>
    ),
  },
  {
    icon: Code2,
    title: "Run in the playground",
    body: (
      <>
        Every prompt has a <span className="font-medium">Test in playground</span>{" "}
        button. The model runs on the server via{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs text-foreground/80">
          z-ai-web-dev-sdk
        </code>{" "}
        — no API keys are ever exposed to the browser.
      </>
    ),
  },
  {
    icon: GitPullRequest,
    title: "Contribute",
    body: (
      <>
        Submit through the form below (pending review) or open a PR against the{" "}
        <a
          href="https://github.com/promptforge/promptforge/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          contributing guide
        </a>{" "}
        to add a prompt directly to the seed file.
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: "License & privacy",
    body: (
      <>
        Everything is MIT-licensed. No accounts, no tracking, no paywalls.
        Upvotes are deduplicated by a hashed browser fingerprint, not by
        identity.
      </>
    ),
  },
  {
    icon: Lightbulb,
    title: "What makes a good prompt",
    body: (
      <>
        A clear role, a specific task, and a constraint. Avoid filler like
        &ldquo;you are an expert&rdquo; without saying{" "}
        <em>at what</em>. Show an example output if you can.
      </>
    ),
  },
];

export function DocsSection() {
  return (
    <section
      id="docs"
      aria-labelledby="docs-heading"
      className="scroll-mt-20 border-t"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" aria-hidden />
            </span>
            <h2
              id="docs-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              How it works
            </h2>
          </div>
          <p className="text-sm text-foreground/60">
            A 60-second tour of PromptForge — the variable syntax, the
            playground, contributing, and the license.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DOCS.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold">{d.title}</h3>
                <p className="mt-1 text-sm text-foreground/65">{d.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
