"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  ArrowUp,
  Tags,
  TrendingUp,
  Award,
  Calendar,
  Users,
} from "lucide-react";
import type { PromptListItem } from "./types";
import { CATEGORIES } from "./types";
import { categoryMeta } from "./lib";
import { cn } from "@/lib/utils";

interface StatsDashboardProps {
  prompts: PromptListItem[];
}

export function StatsDashboard({ prompts }: StatsDashboardProps) {
  const stats = React.useMemo(() => {
    const total = prompts.length;
    const totalUpvotes = prompts.reduce((sum, p) => sum + (p.upvotes || 0), 0);
    const avgUpvotes = total > 0 ? Math.round(totalUpvotes / total) : 0;

    // Per-category counts + upvotes.
    const byCategory = CATEGORIES.map((c) => {
      const items = prompts.filter((p) => p.category === c);
      return {
        category: c,
        count: items.length,
        upvotes: items.reduce((s, p) => s + (p.upvotes || 0), 0),
      };
    });

    // Top category by count (tiebreak by upvotes).
    const topCategory = [...byCategory].sort(
      (a, b) => b.count - a.count || b.upvotes - a.upvotes,
    )[0];

    // Top prompt by upvotes.
    const topPrompt = [...prompts].sort((a, b) => b.upvotes - a.upvotes)[0];

    // Distinct authors.
    const authors = new Set(prompts.map((p) => p.authorName.toLowerCase()));
    const authorCount = authors.size;

    // Newest prompt date.
    const newest = prompts
      .map((p) => p.createdAt)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

    return {
      total,
      totalUpvotes,
      avgUpvotes,
      byCategory,
      topCategory,
      topPrompt,
      authorCount,
      newest,
    };
  }, [prompts]);

  if (stats.total === 0) return null;

  const topMeta = categoryMeta(stats.topCategory.category);

  return (
    <section
      id="stats"
      aria-labelledby="stats-heading"
      className="border-t bg-muted/10"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" aria-hidden />
            </span>
            <h2
              id="stats-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              By the numbers
            </h2>
          </div>
          <p className="text-sm text-foreground/60">
            A live snapshot of the PromptForge community library.
          </p>
        </div>

        {/* Big stat tiles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatTile
            icon={<Flame className="h-4 w-4" aria-hidden />}
            value={stats.total}
            label="prompts"
            delay={0}
          />
          <StatTile
            icon={<ArrowUp className="h-4 w-4" aria-hidden />}
            value={stats.totalUpvotes}
            label="total upvotes"
            delay={0.04}
          />
          <StatTile
            icon={<TrendingUp className="h-4 w-4" aria-hidden />}
            value={stats.avgUpvotes}
            label="avg / prompt"
            delay={0.08}
          />
          <StatTile
            icon={<Tags className="h-4 w-4" aria-hidden />}
            value={CATEGORIES.length}
            label="categories"
            delay={0.12}
          />
          <StatTile
            icon={<Users className="h-4 w-4" aria-hidden />}
            value={stats.authorCount}
            label="authors"
            delay={0.16}
          />
          <StatTile
            icon={<Award className="h-4 w-4" aria-hidden />}
            value={stats.topCategory.count}
            label={`in ${topMeta.label}`}
            delay={0.2}
            accent
          />
        </div>

        {/* Highlights row */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {/* Top category */}
          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <span
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                topMeta.badge,
              )}
            >
              <topMeta.icon className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                Largest category
              </p>
              <p className="truncate text-sm font-semibold">
                {topMeta.label}{" "}
                <span className="font-normal text-foreground/60">
                  · {stats.topCategory.count} prompts · {stats.topCategory.upvotes} upvotes
                </span>
              </p>
            </div>
          </div>

          {/* Top prompt */}
          {stats.topPrompt && (
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Award className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                  Most upvoted
                </p>
                <p className="truncate text-sm font-semibold">
                  {stats.topPrompt.title}{" "}
                  <span className="font-normal text-foreground/60">
                    · {stats.topPrompt.upvotes} upvotes
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Category breakdown bars */}
        <div className="mt-4 rounded-xl border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Prompts per category
          </p>
          <div className="space-y-2">
            {stats.byCategory.map((c) => {
              const meta = categoryMeta(c.category);
              const pct =
                stats.total > 0 ? Math.round((c.count / stats.total) * 100) : 0;
              return (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="inline-flex w-24 shrink-0 items-center gap-1.5 text-xs font-medium">
                    <meta.icon className="h-3 w-3 text-foreground/60" aria-hidden />
                    {meta.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", meta.bar)}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs tabular-nums text-foreground/60">
                    {c.count} · {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatTile({
  icon,
  value,
  label,
  delay,
  accent,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
      className={cn(
        "rounded-xl border p-4 shadow-sm transition-colors",
        accent
          ? "border-primary/30 bg-primary/5"
          : "bg-card hover:border-primary/20",
      )}
    >
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-lg",
          accent ? "bg-primary/15 text-primary" : "bg-muted text-foreground/60",
        )}
      >
        {icon}
      </span>
      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
        {value}
      </p>
      <p className="text-xs text-foreground/55">{label}</p>
    </motion.div>
  );
}
