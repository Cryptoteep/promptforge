"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Flame, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PromptListItem } from "./types";
import { categoryMeta, formatDate, truncate } from "./lib";

interface FeaturedBannerProps {
  prompts: PromptListItem[];
  onView: (id: string) => void;
}

/**
 * A rotating "Featured prompt" banner that highlights the most upvoted
 * prompt. Auto-rotates every 7s, pauses on hover, and is fully
 * keyboard-accessible.
 */
export function FeaturedBanner({ prompts, onView }: FeaturedBannerProps) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Pick the top 3 by upvotes.
  const featured = React.useMemo(() => {
    return [...prompts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  }, [prompts]);

  React.useEffect(() => {
    if (featured.length <= 1 || paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % featured.length);
    }, 7000);
    return () => clearInterval(t);
  }, [featured.length, paused]);

  if (featured.length === 0) return null;

  const current = featured[index % featured.length];
  const meta = categoryMeta(current.category);
  const Icon = meta.icon;

  return (
    <section
      aria-label="Featured prompt"
      className="border-t bg-gradient-to-br from-primary/10 via-emerald-500/5 to-amber-500/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border bg-background/70 p-5 shadow-sm backdrop-blur sm:p-6"
        >
          {/* Decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Flame className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    Featured
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.badge}`}>
                    <Icon className="h-3 w-3" aria-hidden />
                    {meta.label}
                  </span>
                  <span className="text-[11px] text-foreground/50">
                    {formatDate(current.createdAt)}
                  </span>
                </div>
                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {current.title}
                </h3>
                <p className="mt-1 line-clamp-1 max-w-xl text-sm text-foreground/65">
                  {truncate(current.description, 120)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                onClick={() => onView(current.id)}
                size="sm"
                className="gap-1.5 shadow-sm"
              >
                View prompt
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Button>
            </div>
          </div>

          {/* Rotation dots */}
          {featured.length > 1 && (
            <div
              className="relative mt-4 flex items-center justify-center gap-1.5"
              role="tablist"
              aria-label="Choose featured prompt"
            >
              {featured.map((p, i) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show featured prompt ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-foreground/25 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
