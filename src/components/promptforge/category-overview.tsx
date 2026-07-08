"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, type Category } from "./types";
import { categoryMeta } from "./lib";
import { cn } from "@/lib/utils";

interface CategoryOverviewProps {
  totals: Record<string, number>;
  active: string;
  onSelect: (c: string) => void;
}

export function CategoryOverview({
  totals,
  active,
  onSelect,
}: CategoryOverviewProps) {
  const maxCount = Math.max(1, ...CATEGORIES.map((c) => totals[c] ?? 0));

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="border-t bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-col gap-1">
          <h2
            id="categories-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Browse by category
          </h2>
          <p className="text-sm text-foreground/60">
            {CATEGORIES.length} curated categories. Click one to filter the
            library below.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {CATEGORIES.map((c: Category, i) => {
            const meta = categoryMeta(c);
            const Icon = meta.icon;
            const count = totals[c] ?? 0;
            const isActive = active === c;
            const pct = Math.round((count / maxCount) * 100);
            return (
              <motion.button
                key={c}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(i * 0.03, 0.2) }}
                onClick={() => onSelect(c)}
                aria-pressed={isActive}
                className={cn(
                  "group relative flex flex-col items-start gap-2 overflow-hidden rounded-xl border p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  meta.tint,
                  isActive && "ring-2 ring-primary",
                )}
              >
                {/* Top gradient accent */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70 transition-opacity group-hover:opacity-100",
                    meta.bar,
                  )}
                />
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 text-foreground shadow-sm transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="w-full">
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {meta.label}
                    <ArrowRight
                      className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                  <div className="text-xs text-foreground/60">
                    {count} {count === 1 ? "prompt" : "prompts"}
                  </div>
                </div>
                {/* Mini progress bar showing relative count */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-background/60" aria-hidden>
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", meta.bar)}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="line-clamp-2 text-[11px] leading-snug text-foreground/55">
                  {meta.blurb}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
