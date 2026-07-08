"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Package,
  ArrowRight,
  Code2,
  PenLine,
  ListChecks,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PromptListItem } from "./types";
import { categoryMeta, truncate } from "./lib";

interface CollectionsProps {
  prompts: PromptListItem[];
  onView: (id: string) => void;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tags or categories that define membership in this collection. */
  match: (p: PromptListItem) => boolean;
  accent: string;
}

/**
 * Curated "starter packs" — thematic bundles that group prompts across
 * categories. Membership is computed from the live prompt list, so the
 * counts stay accurate as the library grows.
 */
const COLLECTIONS: Collection[] = [
  {
    id: "developer-pack",
    title: "Developer starter pack",
    description:
      "Refactor, review, and ship better code. The essentials every engineer should have on hand.",
    icon: Code2,
    match: (p) =>
      p.category === "coding" ||
      /refactor|commit|review|debug|code/i.test(p.tags + " " + p.title),
    accent: "from-emerald-500/15 to-teal-500/10 border-emerald-500/25",
  },
  {
    id: "writing-workshop",
    title: "Writing workshop",
    description:
      "From blank page to polished draft — brainstorming, summaries, and editing helpers.",
    icon: PenLine,
    match: (p) =>
      p.category === "writing" ||
      /writ|blog|summari|draft|edit/i.test(p.tags + " " + p.title),
    accent: "from-amber-500/15 to-yellow-500/10 border-amber-500/25",
  },
  {
    id: "get-things-done",
    title: "Get things done",
    description:
      "Plan your week, tame your inbox, and turn chaos into a clear next step.",
    icon: ListChecks,
    match: (p) =>
      p.category === "productivity" ||
      /plan|email|weekly|standup|inbox/i.test(p.tags + " " + p.title),
    accent: "from-orange-500/15 to-red-500/10 border-orange-500/25",
  },
  {
    id: "founders-toolkit",
    title: "Founder's toolkit",
    description:
      "Positioning, outreach, and strategy prompts for early-stage builders.",
    icon: Briefcase,
    match: (p) =>
      p.category === "business" ||
      /business|outreach|canvas|strateg|position/i.test(p.tags + " " + p.title),
    accent: "from-cyan-500/15 to-sky-500/10 border-cyan-500/25",
  },
];

export function Collections({ prompts, onView }: CollectionsProps) {
  const [active, setActive] = React.useState<string | null>(null);

  const enriched = React.useMemo(
    () =>
      COLLECTIONS.map((c) => ({
        ...c,
        items: prompts.filter(c.match).slice(0, 6),
      })),
    [prompts],
  );

  const visible = enriched.filter((c) => c.items.length > 0);
  if (visible.length === 0) return null;

  const activeCollection = active ? enriched.find((c) => c.id === active) : null;

  return (
    <section
      id="collections"
      aria-labelledby="collections-heading"
      className="scroll-mt-24 border-t bg-muted/10"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="h-4 w-4" aria-hidden />
            </span>
            <h2
              id="collections-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Collections
            </h2>
          </div>
          <p className="text-sm text-foreground/60">
            Curated starter packs — thematic bundles that group prompts across
            categories. Click one to preview its prompts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((c, i) => {
            const Icon = c.icon;
            const isActive = active === c.id;
            return (
              <motion.button
                key={c.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(i * 0.05, 0.2) }}
                onClick={() => setActive(isActive ? null : c.id)}
                aria-pressed={isActive}
                aria-expanded={isActive}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-gradient-to-br p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  c.accent,
                  isActive && "ring-2 ring-primary",
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/70 text-foreground shadow-sm">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground/60">
                    {c.items.length} {c.items.length === 1 ? "prompt" : "prompts"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-foreground/60">
                  {c.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  {isActive ? "Hide" : "Preview"}
                  <ArrowRight
                    className={cn(
                      "h-3 w-3 transition-transform",
                      isActive ? "-rotate-90" : "group-hover:translate-x-0.5",
                    )}
                    aria-hidden
                  />
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active collection preview */}
        {activeCollection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-6 overflow-hidden"
          >
            <div className="rounded-xl border bg-background p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center gap-2">
                <activeCollection.icon className="h-4 w-4 text-primary" aria-hidden />
                <h3 className="text-sm font-semibold">
                  {activeCollection.title}
                </h3>
                <span className="text-xs text-foreground/50">
                  · {activeCollection.items.length} prompts
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {activeCollection.items.map((p) => {
                  const meta = categoryMeta(p.category);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onView(p.id)}
                      className="group flex items-start gap-2.5 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px]",
                          meta.badge,
                        )}
                      >
                        <meta.icon className="h-3 w-3" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-snug group-hover:text-primary">
                          {p.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-foreground/55">
                          {truncate(p.description, 90)}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </button>
                  );
                })}
              </div>
              {activeCollection.items.length === 0 && (
                <p className="flex items-center gap-2 py-4 text-sm text-foreground/50">
                  <Sparkles className="h-4 w-4" aria-hidden />
                  No prompts match this collection yet — contribute one!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
