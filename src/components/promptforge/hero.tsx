"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Upload, Github, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  promptCount: number;
  categoryCount: number;
}

export function Hero({ promptCount, categoryCount }: HeroProps) {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b"
    >
      {/* Decorative background blobs — subtle, emerald-tinted. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 dark:opacity-40"
      >
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            Community-driven · MIT licensed · no tracking
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            The open-source library of{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              AI prompts
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
            className="mx-auto mt-5 max-w-2xl text-pretty text-base text-foreground/70 sm:text-lg"
          >
            A free, community-curated home for high-quality AI prompts. Browse,
            run them in the built-in playground, and submit your own. No
            accounts, no paywalls, no tracking — just good prompts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.18 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href="#browse">
                <LayoutGrid className="mr-2 h-4 w-4" aria-hidden />
                Browse prompts
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              <a href="#submit">
                <Upload className="mr-2 h-4 w-4" aria-hidden />
                Submit a prompt
              </a>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.24 }}
            className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-foreground/70"
          >
            <div className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden />
              <dd className="font-semibold text-foreground">{promptCount}</dd>
              <dt>prompts</dt>
            </div>
            <span aria-hidden className="text-foreground/30">·</span>
            <div className="inline-flex items-center gap-1.5">
              <LayoutGrid className="h-4 w-4 text-primary" aria-hidden />
              <dd className="font-semibold text-foreground">{categoryCount}</dd>
              <dt>categories</dt>
            </div>
            <span aria-hidden className="text-foreground/30">·</span>
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
              <dt>MIT licensed</dt>
            </div>
            <span aria-hidden className="text-foreground/30">·</span>
            <div className="inline-flex items-center gap-1.5">
              <Heart className="h-4 w-4 text-primary" aria-hidden />
              <dt>community-driven</dt>
            </div>
          </motion.dl>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <a
              href="https://github.com/promptforge/promptforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              Star us on GitHub →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
