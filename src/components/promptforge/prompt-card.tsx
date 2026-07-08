"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUp, Eye, Copy, Check, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PromptListItem } from "./types";
import { categoryMeta, formatDate, parseTags, truncate } from "./lib";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: PromptListItem;
  hasVoted: boolean;
  onView: (id: string) => void;
  onUpvote: (id: string) => void;
  /** 0-based index, used for the staggered entrance animation. */
  index: number;
}

export function PromptCard({
  prompt,
  hasVoted,
  onView,
  onUpvote,
  index,
}: PromptCardProps) {
  const meta = categoryMeta(prompt.category);
  const tags = parseTags(prompt.tags).slice(0, 4);
  const Icon = meta.icon;
  const [copied, setCopied] = React.useState(false);

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // Cards don't have the full content (the list endpoint omits it); copying
    // the description gives the user something useful while signalling that
    // the full prompt is one click away.
    try {
      await navigator.clipboard.writeText(prompt.description);
      setCopied(true);
      toast.success("Description copied", {
        description: "Open the prompt to copy the full text.",
      });
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: Math.min(index * 0.04, 0.3) }}
      className="h-full"
    >
      <Card
        className="group flex h-full cursor-pointer flex-col p-5 transition-all hover:shadow-md hover:-translate-y-0.5 focus-within:shadow-md focus-within:-translate-y-0.5"
        role="article"
        aria-label={`${prompt.title} — ${meta.label} prompt by ${prompt.authorName}`}
        tabIndex={0}
        onClick={() => onView(prompt.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onView(prompt.id);
          }
        }}
      >
        {/* Top row: category badge + model */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={`gap-1.5 ${meta.badge}`}
          >
            <Icon className="h-3 w-3" aria-hidden />
            {meta.label}
          </Badge>
          <span className="text-[11px] font-medium uppercase tracking-wide text-foreground/50">
            {prompt.model}
          </span>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight">
          {prompt.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-foreground/70">
          {truncate(prompt.description, 160)}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-foreground/60">
          <span className="font-medium text-foreground/80">
            {prompt.authorName}
          </span>
          {prompt.authorGithub && (
            <a
              href={`https://github.com/${prompt.authorGithub}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 text-foreground/50 transition-colors hover:text-foreground"
              aria-label={`${prompt.authorName} on GitHub`}
            >
              <Github className="h-3 w-3" />
            </a>
          )}
          <span aria-hidden>·</span>
          <time dateTime={prompt.createdAt}>{formatDate(prompt.createdAt)}</time>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t pt-3">
          <Button
            type="button"
            size="sm"
            variant={hasVoted ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(prompt.id);
            }}
            aria-pressed={hasVoted}
            aria-label={hasVoted ? "Remove upvote" : "Upvote this prompt"}
            className="gap-1.5"
          >
            <ArrowUp
              className={`h-3.5 w-3.5 ${hasVoted ? "fill-current" : ""}`}
              aria-hidden
            />
            {prompt.upvotes}
          </Button>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCopyId}
              aria-label="Copy description"
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onView(prompt.id);
              }}
              className="gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              View
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
