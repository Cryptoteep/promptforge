"use client";

import * as React from "react";
import { Search, X, ArrowUpDown, Inbox, History, Trash2, Shuffle, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type PromptListItem, type SortOption } from "./types";
import { categoryMeta } from "./lib";
import { PromptCard } from "./prompt-card";
import { cn } from "@/lib/utils";

interface BrowseProps {
  category: string; // "" | Category
  setCategory: (c: string) => void;
  query: string;
  setQuery: (q: string) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  onView: (id: string) => void;
  /** Prompts the current browser has already upvoted (localStorage-backed). */
  votedIds: Set<string>;
  onUpvote: (id: string) => void;
  /** Bumped by parent to force a refetch (e.g. after submitting a prompt). */
  refreshKey: number;
  /** Recently-viewed prompt ids, newest first (localStorage-backed). */
  recentIds?: string[];
  /** The full prompt list, used to resolve recent ids → titles. */
  recentPrompts?: PromptListItem[];
  onClearRecent?: () => void;
  /** Click a tag chip → filter the grid by that tag. */
  onTagClick?: (tag: string) => void;
  /** Open a random prompt — "Surprise me". */
  onSurprise?: () => void;
  /** Bookmarked (favorited) prompt ids. */
  bookmarkIds?: string[];
  /** Full prompt list, used to resolve bookmark ids → titles. */
  bookmarkPrompts?: PromptListItem[];
  onToggleBookmark?: (id: string) => void;
  onClearBookmarks?: () => void;
}

interface ApiResponse {
  prompts: PromptListItem[];
}

const SKELETON_COUNT = 6;

export function Browse({
  category,
  setCategory,
  query,
  setQuery,
  sort,
  setSort,
  onView,
  votedIds,
  onUpvote,
  refreshKey,
  recentIds = [],
  recentPrompts = [],
  onClearRecent,
  onTagClick,
  onSurprise,
  bookmarkIds = [],
  bookmarkPrompts = [],
  onToggleBookmark,
  onClearBookmarks,
}: BrowseProps) {
  const [prompts, setPrompts] = React.useState<PromptListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalsByCategory, setTotalsByCategory] = React.useState<
    Record<string, number>
  >({});

  // Debounce the search input so we don't fire a request per keystroke.
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 220);
    return () => clearTimeout(t);
  }, [query]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    params.set("sort", sort);

    fetch(`/api/prompts?${params.toString()}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const data = (await r.json()) as ApiResponse;
        return data.prompts ?? [];
      })
      .then((rows) => {
        if (cancelled) return;
        setPrompts(rows);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load prompts");
        setPrompts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, debouncedQuery, sort, refreshKey]);

  // Fetch category totals once on mount for the chip counts.
  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/prompts?sort=popular")
      .then((r) => r.json())
      .then((data: ApiResponse) => {
        if (cancelled) return;
        const counts: Record<string, number> = {};
        for (const p of data.prompts ?? []) {
          counts[p.category] = (counts[p.category] ?? 0) + 1;
        }
        setTotalsByCategory(counts);
      })
      .catch(() => {
        /* non-fatal */
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <section
      id="browse"
      aria-labelledby="browse-heading"
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-col gap-1">
          <h2
            id="browse-heading"
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            Browse prompts
          </h2>
          <p className="text-sm text-foreground/60">
            {loading
              ? "Loading…"
              : `${prompts.length} ${prompts.length === 1 ? "prompt" : "prompts"}${
                  category ? ` in ${categoryMeta(category).label}` : ""
                }${debouncedQuery ? ` matching “${debouncedQuery}”` : ""}`}
          </p>
        </div>

        {/* Recently viewed row (localStorage-backed) */}
        {recentIds.length > 0 && recentPrompts.length > 0 && (
          <RecentlyViewed
            recentIds={recentIds}
            recentPrompts={recentPrompts}
            onView={onView}
            onClear={onClearRecent}
          />
        )}

        {/* Bookmarks row (localStorage-backed favorites) */}
        {bookmarkIds.length > 0 && bookmarkPrompts.length > 0 && (
          <BookmarksRow
            bookmarkIds={bookmarkIds}
            bookmarkPrompts={bookmarkPrompts}
            onView={onView}
            onClear={onClearBookmarks}
          />
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
              aria-hidden
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, description, or tag…"
              aria-label="Search prompts"
              className="pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-foreground/40 transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-foreground/40" aria-hidden />
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
            >
              <SelectTrigger className="w-[150px]" aria-label="Sort prompts">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            {onSurprise && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSurprise}
                aria-label="Surprise me — open a random prompt"
                title="Surprise me (random prompt)"
                className="shrink-0"
              >
                <Shuffle className="h-4 w-4" aria-hidden />
              </Button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div
          className="mb-8 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          <CategoryChip
            label="All"
            count={Object.values(totalsByCategory).reduce((a, b) => a + b, 0)}
            active={category === ""}
            onClick={() => setCategory("")}
          />
          {CATEGORIES.map((c) => {
            const meta = categoryMeta(c);
            const Icon = meta.icon;
            return (
              <CategoryChip
                key={c}
                label={meta.label}
                count={totalsByCategory[c] ?? 0}
                active={category === c}
                onClick={() => setCategory(c)}
                icon={<Icon className="h-3.5 w-3.5" aria-hidden />}
              />
            );
          })}
        </div>

        {/* Grid */}
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
            <p className="text-sm font-medium text-destructive">
              Couldn&apos;t load prompts
            </p>
            <p className="mt-1 text-xs text-foreground/60">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => setSort(sort === "popular" ? "newest" : "popular")}
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : prompts.length === 0 ? (
          <EmptyState
            hasQuery={!!debouncedQuery || !!category}
            onClear={() => {
              setQuery("");
              setCategory("");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prompts.map((p, i) => (
              <PromptCard
                key={p.id}
                prompt={p}
                index={i}
                hasVoted={votedIds.has(p.id)}
                onView={onView}
                onUpvote={onUpvote}
                onTagClick={onTagClick}
                isBookmarked={bookmarkIds.includes(p.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryChip({
  label,
  count,
  active,
  onClick,
  icon,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground/70 hover:bg-accent hover:text-foreground",
      )}
    >
      {icon}
      {label}
      {typeof count === "number" && (
        <span
          className={cn(
            "ml-0.5 rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({
  hasQuery,
  onClear,
}: {
  hasQuery: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-6 w-6 text-foreground/40" aria-hidden />
      </div>
      <p className="text-sm font-medium">
        {hasQuery ? "No prompts match your filters" : "No prompts yet"}
      </p>
      <p className="mt-1 max-w-sm text-xs text-foreground/60">
        {hasQuery
          ? "Try a different search term or category, or clear your filters."
          : "Be the first to contribute a prompt to the community."}
      </p>
      {hasQuery ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onClear}>
          Clear filters
        </Button>
      ) : (
        <Button asChild size="sm" className="mt-4">
          <a href="#submit">Submit a prompt</a>
        </Button>
      )}
    </div>
  );
}

function RecentlyViewed({
  recentIds,
  recentPrompts,
  onView,
  onClear,
}: {
  recentIds: string[];
  recentPrompts: PromptListItem[];
  onView: (id: string) => void;
  onClear?: () => void;
}) {
  // Order by recency (recentIds is newest-first), drop any ids not in the list.
  const ordered = recentIds
    .map((id) => recentPrompts.find((p) => p.id === id))
    .filter((p): p is PromptListItem => Boolean(p))
    .slice(0, 8);
  if (ordered.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border bg-muted/30 p-3 sm:p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground/60">
          <History className="h-3.5 w-3.5" aria-hidden />
          Recently viewed
        </h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/45 transition-colors hover:text-destructive"
            aria-label="Clear recently viewed"
          >
            <Trash2 className="h-3 w-3" aria-hidden />
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 pf-scroll">
        {ordered.map((p) => {
          const meta = categoryMeta(p.category);
          const Icon = meta.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onView(p.id)}
              className="group flex shrink-0 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-left transition-all hover:border-primary/30 hover:shadow-sm"
              title={p.title}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px]",
                  meta.badge,
                )}
              >
                <Icon className="h-3 w-3" aria-hidden />
              </span>
              <span className="max-w-[140px] truncate text-xs font-medium group-hover:text-primary">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookmarksRow({
  bookmarkIds,
  bookmarkPrompts,
  onView,
  onClear,
}: {
  bookmarkIds: string[];
  bookmarkPrompts: PromptListItem[];
  onView: (id: string) => void;
  onClear?: () => void;
}) {
  // Preserve bookmark order (newest first).
  const ordered = bookmarkIds
    .map((id) => bookmarkPrompts.find((p) => p.id === id))
    .filter((p): p is PromptListItem => Boolean(p));
  if (ordered.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 sm:p-4">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
          <Bookmark className="h-3.5 w-3.5 fill-current" aria-hidden />
          Bookmarks
          <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 text-[10px] tabular-nums text-amber-700 dark:text-amber-300">
            {ordered.length}
          </span>
        </h3>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/45 transition-colors hover:text-destructive"
            aria-label="Clear all bookmarks"
          >
            <Trash2 className="h-3 w-3" aria-hidden />
            Clear
          </button>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 pf-scroll">
        {ordered.map((p) => {
          const meta = categoryMeta(p.category);
          const Icon = meta.icon;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onView(p.id)}
              className="group flex shrink-0 items-center gap-2 rounded-lg border border-amber-500/30 bg-background px-3 py-2 text-left transition-all hover:border-primary/30 hover:shadow-sm"
              title={p.title}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[10px]",
                  meta.badge,
                )}
              >
                <Icon className="h-3 w-3" aria-hidden />
              </span>
              <span className="max-w-[140px] truncate text-xs font-medium group-hover:text-primary">
                {p.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
