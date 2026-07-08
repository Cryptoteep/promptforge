"use client";

import * as React from "react";
import { Header } from "@/components/promptforge/header";
import { Hero } from "@/components/promptforge/hero";
import { FeaturedBanner } from "@/components/promptforge/featured-banner";
import { CategoryOverview } from "@/components/promptforge/category-overview";
import { Browse } from "@/components/promptforge/browse";
import { Playground } from "@/components/promptforge/playground";
import { DocsSection } from "@/components/promptforge/docs-section";
import { SubmitForm } from "@/components/promptforge/submit-form";
import { Footer } from "@/components/promptforge/footer";
import { PromptDetailDialog } from "@/components/promptforge/prompt-detail-dialog";
import type { Prompt, PromptListItem, SortOption, VoteResponse } from "@/components/promptforge/types";
import { CATEGORIES } from "@/components/promptforge/types";
import { toast } from "sonner";

const VOTED_STORAGE_KEY = "promptforge:voted";

export default function Home() {
  // ---- Browse state ----
  const [category, setCategory] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortOption>("popular");
  const [refreshKey, setRefreshKey] = React.useState(0);

  // ---- Category overview totals (fetched once) ----
  const [totals, setTotals] = React.useState<Record<string, number>>({});
  const [totalPrompts, setTotalPrompts] = React.useState(0);
  const [featured, setFeatured] = React.useState<PromptListItem[]>([]);

  // ---- Detail dialog ----
  const [selectedPromptId, setSelectedPromptId] = React.useState<string | null>(null);

  // ---- Playground ----
  const [playgroundPrefill, setPlaygroundPrefill] = React.useState<string | null>(null);

  // ---- Votes ----
  const [votedIds, setVotedIds] = React.useState<Set<string>>(new Set());
  const [voting, setVoting] = React.useState<Set<string>>(new Set());

  // Hydrate voted set from localStorage.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(VOTED_STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        setVotedIds(new Set(arr));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistVoted = (next: Set<string>) => {
    try {
      localStorage.setItem(VOTED_STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore */
    }
  };

  // Fetch category totals once on mount (and after every refresh bump).
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/prompts?sort=popular")
      .then((r) => r.json())
      .then((data: { prompts?: PromptListItem[] }) => {
        if (cancelled) return;
        const list = data.prompts ?? [];
        const counts: Record<string, number> = {};
        let total = 0;
        for (const p of list) {
          counts[p.category] = (counts[p.category] ?? 0) + 1;
          total += 1;
        }
        setTotals(counts);
        setTotalPrompts(total);
        // Top 3 by upvotes feed the featured banner.
        setFeatured(
          [...list].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3),
        );
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleUpvote = React.useCallback(
    async (promptId: string) => {
      if (votedIds.has(promptId)) {
        toast.info("You've already upvoted this prompt");
        return;
      }
      if (voting.has(promptId)) return;
      setVoting((prev) => new Set(prev).add(promptId));

      // Optimistically mark as voted so the UI feels instant.
      const optimistic = new Set(votedIds);
      optimistic.add(promptId);
      setVotedIds(optimistic);
      persistVoted(optimistic);

      try {
        const res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptId }),
        });
        const data = (await res.json()) as VoteResponse;
        if (!res.ok) throw new Error("Vote failed");
        if (!data.voted) {
          // Server says they already voted (e.g. same browser hash from
          // before localStorage). Keep it marked locally to avoid spamming.
          toast.info("Looks like you've already upvoted this one");
        } else {
          toast.success("Upvoted!");
        }
        // Refresh the browse list + totals so the new count shows.
        setRefreshKey((k) => k + 1);
      } catch {
        // Roll back the optimistic local mark on failure.
        const rolled = new Set(votedIds);
        rolled.delete(promptId);
        setVotedIds(rolled);
        persistVoted(rolled);
        toast.error("Couldn't register your vote", {
          description: "Please try again in a moment.",
        });
      } finally {
        setVoting((prev) => {
          const next = new Set(prev);
          next.delete(promptId);
          return next;
        });
      }
    },
    [votedIds, voting],
  );

  const handleTestInPlayground = React.useCallback((prompt: Prompt) => {
    setSelectedPromptId(null);
    setPlaygroundPrefill(prompt.content);
  }, []);

  const handleSelectCategory = React.useCallback((c: string) => {
    setCategory(c);
    // Scroll to the browse section so the user sees the filter apply.
    requestAnimationFrame(() => {
      const el = document.getElementById("browse");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleSubmitSuccess = React.useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero promptCount={totalPrompts} categoryCount={CATEGORIES.length} />

        <FeaturedBanner
          prompts={featured}
          onView={(id) => setSelectedPromptId(id)}
        />

        <CategoryOverview
          totals={totals}
          active={category}
          onSelect={handleSelectCategory}
        />

        <Browse
          category={category}
          setCategory={setCategory}
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          onView={(id) => setSelectedPromptId(id)}
          votedIds={votedIds}
          onUpvote={handleUpvote}
          refreshKey={refreshKey}
        />

        <Playground
          prefill={playgroundPrefill}
          onPrefillConsumed={() => setPlaygroundPrefill(null)}
        />

        <DocsSection />

        <SubmitForm onSubmitSuccess={handleSubmitSuccess} />
      </main>

      <Footer />

      {/* Detail dialog (rendered at page level so it overlays everything). */}
      <PromptDetailDialog
        promptId={selectedPromptId}
        hasVoted={selectedPromptId ? votedIds.has(selectedPromptId) : false}
        onUpvote={handleUpvote}
        onOpenChange={(open) => {
          if (!open) setSelectedPromptId(null);
        }}
        onTestInPlayground={handleTestInPlayground}
      />
    </div>
  );
}
