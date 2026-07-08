"use client";

import * as React from "react";
import { Header } from "@/components/promptforge/header";
import { Hero } from "@/components/promptforge/hero";
import { FeaturedBanner } from "@/components/promptforge/featured-banner";
import { CategoryOverview } from "@/components/promptforge/category-overview";
import { Browse } from "@/components/promptforge/browse";
import { Collections } from "@/components/promptforge/collections";
import { Playground } from "@/components/promptforge/playground";
import { DocsSection } from "@/components/promptforge/docs-section";
import { SubmitForm } from "@/components/promptforge/submit-form";
import { Footer } from "@/components/promptforge/footer";
import { PromptDetailDialog } from "@/components/promptforge/prompt-detail-dialog";
import type { Prompt, PromptListItem, SortOption, VoteResponse } from "@/components/promptforge/types";
import { CATEGORIES } from "@/components/promptforge/types";
import { toast } from "sonner";

const VOTED_STORAGE_KEY = "promptforge:voted";
const RECENT_STORAGE_KEY = "promptforge:recent";
const RECENT_MAX = 8;

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
  /** Full approved prompt list — feeds Collections + featured banner. */
  const [allPrompts, setAllPrompts] = React.useState<PromptListItem[]>([]);

  // ---- Detail dialog ----
  const [selectedPromptId, setSelectedPromptId] = React.useState<string | null>(null);

  // ---- Playground ----
  const [playgroundPrefill, setPlaygroundPrefill] = React.useState<string | null>(null);

  // ---- Submit form (fork prefill) ----
  const [submitPrefill, setSubmitPrefill] = React.useState<{
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string;
    authorName: string;
    authorGithub: string;
    model: string;
    exampleOutput: string;
  } | null>(null);

  // ---- Votes ----
  const [votedIds, setVotedIds] = React.useState<Set<string>>(new Set());
  const [voting, setVoting] = React.useState<Set<string>>(new Set());

  // ---- Recently viewed (localStorage-backed, newest first) ----
  const [recentIds, setRecentIds] = React.useState<string[]>([]);

  // Hydrate voted set + recent list from localStorage.
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
    try {
      const rawRecent = localStorage.getItem(RECENT_STORAGE_KEY);
      if (rawRecent) {
        const arr = JSON.parse(rawRecent) as string[];
        if (Array.isArray(arr)) setRecentIds(arr);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persistRecent = (next: string[]) => {
    setRecentIds(next);
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  /** Record a prompt id as recently viewed (deduped, newest first, capped). */
  const recordRecent = React.useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_MAX);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const clearRecent = React.useCallback(() => {
    persistRecent([]);
  }, []);

  // ---- Deep-linking: ?p=<id> opens the detail dialog on load ----
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    if (p) {
      setSelectedPromptId(p);
    }
  }, []);

  // Sync the URL whenever the detail dialog opens/closes, so links are shareable.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selectedPromptId) {
      url.searchParams.set("p", selectedPromptId);
    } else {
      url.searchParams.delete("p");
    }
    // Only push if it actually changed, to avoid spamming history.
    const search = url.searchParams.toString();
    const current = window.location.search.replace(/^\?/, "");
    if (search !== current) {
      window.history.replaceState(null, "", url.toString());
    }
  }, [selectedPromptId]);

  // Handle browser back/forward to keep the dialog in sync with the URL.
  React.useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("p");
      setSelectedPromptId(p);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
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
        setAllPrompts(list);
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

  const handleFork = React.useCallback((prompt: Prompt) => {
    setSelectedPromptId(null);
    // Pre-fill the submit form with the forked prompt's content. The author
    // fields are intentionally left blank so the new contributor gets credit.
    setSubmitPrefill({
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      authorName: "",
      authorGithub: "",
      model: prompt.model,
      exampleOutput: prompt.exampleOutput ?? "",
    });
  }, []);

  const handleSelectCategory = React.useCallback((c: string) => {
    setCategory(c);
    // Scroll to the browse section so the user sees the filter apply.
    requestAnimationFrame(() => {
      const el = document.getElementById("browse");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  /** Open a prompt's detail dialog + record it as recently viewed. */
  const handleView = React.useCallback((id: string) => {
    setSelectedPromptId(id);
    recordRecent(id);
  }, [recordRecent]);

  /** Click a tag chip → filter the browse grid by that tag (as a search query). */
  const handleTagClick = React.useCallback((tag: string) => {
    setQuery(tag);
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
          onView={handleView}
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
          onView={handleView}
          votedIds={votedIds}
          onUpvote={handleUpvote}
          refreshKey={refreshKey}
          recentIds={recentIds}
          recentPrompts={allPrompts.filter((p) => recentIds.includes(p.id))}
          onClearRecent={clearRecent}
          onTagClick={handleTagClick}
        />

        <Collections prompts={allPrompts} onView={handleView} />

        <Playground
          prefill={playgroundPrefill}
          onPrefillConsumed={() => setPlaygroundPrefill(null)}
        />

        <DocsSection />

        <SubmitForm
          onSubmitSuccess={handleSubmitSuccess}
          prefill={submitPrefill}
          onPrefillConsumed={() => setSubmitPrefill(null)}
        />
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
        onFork={handleFork}
      />
    </div>
  );
}
