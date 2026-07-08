"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Upload,
  Github,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  promptCount: number;
  categoryCount: number;
  /** Open a random prompt — "Surprise me". */
  onSurprise?: () => void;
}

export function Hero({ promptCount, categoryCount, onSurprise }: HeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b"
    >
      {/* Layered decorative background for depth + texture. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft color blobs */}
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl dark:bg-primary/20" />
        <div className="absolute top-8 right-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl dark:bg-amber-400/10" />
        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            color: "var(--muted-foreground)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Community-driven · MIT licensed · no tracking
          </motion.div>

          {/* Headline with stronger hierarchy */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            The open-source library of{" "}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                AI prompts
              </span>
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-primary/40"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 Q 50 2, 100 6 T 198 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-base text-foreground/85 sm:text-lg"
          >
            A free, community-curated home for high-quality AI prompts. Browse,
            run them in the built-in playground, and submit your own. No
            accounts, no paywalls, no tracking — just good prompts.
          </motion.p>

          {/* CTAs — primary visually heavier than secondary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full gap-2 shadow-md sm:w-auto">
              <a href="#browse">
                <LayoutGrid className="h-4 w-4" aria-hidden />
                Browse prompts
                <span className="ml-1 hidden text-xs font-normal opacity-70 sm:inline">
                  {promptCount} available
                </span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full gap-2 sm:w-auto"
            >
              <a href="#submit">
                <Upload className="h-4 w-4" aria-hidden />
                Submit a prompt
              </a>
            </Button>
            {onSurprise && (
              <Button
                size="lg"
                variant="ghost"
                onClick={onSurprise}
                className="w-full gap-2 text-foreground/70 hover:text-foreground sm:w-auto"
              >
                <Shuffle className="h-4 w-4" aria-hidden />
                Surprise me
              </Button>
            )}
          </motion.div>

          {/* Stats row — cardized for clarity */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
            className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <StatCard
              icon={<Sparkles className="h-4 w-4" aria-hidden />}
              value={String(promptCount)}
              label="prompts"
            />
            <StatCard
              icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
              value={String(categoryCount)}
              label="categories"
            />
            <StatCard
              icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
              value="MIT"
              label="licensed"
            />
            <StatCard
              icon={<Heart className="h-4 w-4" aria-hidden />}
              value="100%"
              label="community"
            />
          </motion.dl>

          {/* GitHub CTA — more prominent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href="https://github.com/Cryptoteep/promptforge"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-2 text-sm font-medium text-foreground/70 shadow-sm backdrop-blur transition-all hover:border-primary/40 hover:text-foreground hover:shadow-md"
            >
              <Github className="h-4 w-4" aria-hidden />
              Star us on GitHub
              <Star className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:scale-110" aria-hidden />
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-foreground/60"
          >
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3 w-3" aria-hidden /> Real model output
            </span>
            <span aria-hidden className="text-foreground/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" aria-hidden /> No API keys exposed
            </span>
            <span aria-hidden className="text-foreground/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3 w-3" aria-hidden /> Built by volunteers
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-background/60 px-3.5 py-2.5 text-left shadow-sm backdrop-blur">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <dd className="text-lg font-bold leading-none tracking-tight text-foreground">
          {value}
        </dd>
        <dt className="mt-0.5 text-xs text-foreground/55">{label}</dt>
      </div>
    </div>
  );
}
