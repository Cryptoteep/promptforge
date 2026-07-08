"use client";

import { motion } from "framer-motion";
import { BookOpen, Code2, Variable, GitPullRequest, ShieldCheck, Lightbulb, Keyboard, Share2, Download } from "lucide-react";

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
    icon: Keyboard,
    title: "Keyboard shortcuts",
    body: (
      <>
        In the playground, press{" "}
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">⌘/Ctrl</kbd>{" "}
        +{" "}
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold">Enter</kbd>{" "}
        to run your prompt instantly — no need to reach for the mouse.
      </>
    ),
  },
  {
    icon: Share2,
    title: "Share & deep-link",
    body: (
      <>
        Open any prompt and hit{" "}
        <span className="font-medium">Share</span> to copy a link that opens
        that exact prompt. The URL updates automatically, so you can bookmark
        or send it to a teammate.
      </>
    ),
  },
  {
    icon: Download,
    title: "Export prompts",
    body: (
      <>
        Every prompt can be exported as{" "}
        <span className="font-medium">Markdown</span> (for docs &amp; READMEs)
        or <span className="font-medium">JSON</span> (portable &amp;
        structured) from the detail dialog&apos;s <span className="font-medium">Export</span> menu.
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
          href="https://github.com/Cryptoteep/promptforge/blob/main/CONTRIBUTING.md"
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
      className="scroll-mt-24 border-t bg-muted/20"
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
            playground, sharing &amp; export, contributing, and the license.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS.map((d, i) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(i * 0.04, 0.24) }}
                className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                {/* hover glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-4 w-4" aria-hidden />
                  </div>
                  <h3 className="text-sm font-semibold">{d.title}</h3>
                  <p className="mt-1 text-sm text-foreground/65">{d.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
