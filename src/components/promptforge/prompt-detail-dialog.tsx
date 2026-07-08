"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ArrowUp,
  FlaskConical,
  Github,
  Calendar,
  Cpu,
  Tag,
  Loader2,
  ExternalLink,
  Share2,
  Download,
  FileJson,
  FileText,
  Link2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Prompt } from "./types";
import {
  categoryMeta,
  formatDate,
  parseTags,
  renderHighlightedPrompt,
  promptToMarkdown,
  promptToJson,
  downloadTextFile,
  slugify,
} from "./lib";
import { toast } from "sonner";

interface PromptDetailDialogProps {
  /** When set, the dialog is open and showing this prompt id. */
  promptId: string | null;
  hasVoted: boolean;
  onUpvote: (id: string) => void;
  onOpenChange: (open: boolean) => void;
  /** Called when the user clicks "Test in playground". */
  onTestInPlayground: (prompt: Prompt) => void;
}

export function PromptDetailDialog({
  promptId,
  hasVoted,
  onUpvote,
  onOpenChange,
  onTestInPlayground,
}: PromptDetailDialogProps) {
  const open = promptId !== null;
  const [prompt, setPrompt] = React.useState<Prompt | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [linkCopied, setLinkCopied] = React.useState(false);

  React.useEffect(() => {
    if (!promptId) {
      setPrompt(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPrompt(null);
    fetch(`/api/prompts/${promptId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Request failed (${r.status})`);
        const data = (await r.json()) as { prompt?: Prompt };
        return data.prompt ?? null;
      })
      .then((p) => {
        if (cancelled) return;
        if (!p) setError("Prompt not found.");
        else setPrompt(p);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load prompt");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleShareLink = async () => {
    if (!prompt) return;
    const url = `${window.location.origin}/?p=${prompt.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success("Shareable link copied", {
        description: "Paste it anywhere to link directly to this prompt.",
      });
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleExportMarkdown = () => {
    if (!prompt) return;
    const md = promptToMarkdown(prompt);
    downloadTextFile(`${slugify(prompt.title)}.md`, md, "text/markdown");
    toast.success("Downloaded Markdown", {
      description: `${slugify(prompt.title)}.md`,
    });
  };

  const handleExportJson = () => {
    if (!prompt) return;
    const json = promptToJson(prompt);
    downloadTextFile(`${slugify(prompt.title)}.json`, json, "application/json");
    toast.success("Downloaded JSON", {
      description: `${slugify(prompt.title)}.json`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              {prompt && (
                <Badge
                  variant="outline"
                  className={`mb-2 gap-1.5 ${categoryMeta(prompt.category).badge}`}
                >
                  {(() => {
                    const Icon = categoryMeta(prompt.category).icon;
                    return <Icon className="h-3 w-3" aria-hidden />;
                  })()}
                  {categoryMeta(prompt.category).label}
                </Badge>
              )}
              <DialogTitle className="text-xl font-bold leading-snug tracking-tight">
                {prompt ? prompt.title : loading ? "Loading…" : "Prompt"}
              </DialogTitle>
              <DialogDescription className="mt-1 line-clamp-2">
                {prompt?.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="pf-scroll flex-1 overflow-y-auto">
          <div className="px-6 py-5">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-foreground/60">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading prompt…
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : prompt ? (
              <div className="space-y-5">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground/60">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-medium text-foreground/80">
                      {prompt.authorName}
                    </span>
                    {prompt.authorGithub && (
                      <a
                        href={`https://github.com/${prompt.authorGithub}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-foreground/50 transition-colors hover:text-foreground"
                      >
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(prompt.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    {prompt.model}
                  </span>
                </div>

                {/* Prompt content */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                      Prompt
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCopy}
                      className="h-7 gap-1.5 text-xs"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <pre className="pf-prompt-content max-h-72 overflow-y-auto rounded-lg border bg-muted/40 p-4 pf-scroll">
                    <code>
                      {renderHighlightedPrompt(prompt.content).map((part, i) =>
                        typeof part === "string" ? (
                          <React.Fragment key={i}>{part}</React.Fragment>
                        ) : (
                          <span key={i} className="pf-var">
                            {`{{${part.name}}}`}
                          </span>
                        ),
                      )}
                    </code>
                  </pre>
                </div>

                {/* Example output */}
                {prompt.exampleOutput && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
                      Example output
                    </h3>
                    <pre className="pf-prompt-content max-h-64 overflow-y-auto rounded-lg border bg-muted/30 p-4 pf-scroll">
                      <code>{prompt.exampleOutput}</code>
                    </pre>
                  </div>
                )}

                {/* Tags */}
                {parseTags(prompt.tags).length > 0 && (
                  <div>
                    <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-foreground/50">
                      <Tag className="h-3.5 w-3.5" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {parseTags(prompt.tags).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested link to docs section */}
                <div className="rounded-lg border bg-muted/20 p-3 text-xs text-foreground/60">
                  Variables in{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-foreground/80">
                    {`{{double braces}}`}
                  </code>{" "}
                  are filled in automatically when you test this prompt in the
                  playground.
                  <a
                    href="#docs"
                    className="ml-1 inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                  >
                    Learn more <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        {/* Footer actions — upvote | share + export + copy + test */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 px-6 py-4">
          <Button
            variant={hasVoted ? "default" : "outline"}
            onClick={() => prompt && onUpvote(prompt.id)}
            disabled={!prompt}
            aria-pressed={hasVoted}
            className="gap-1.5"
          >
            <ArrowUp
              className={`h-4 w-4 ${hasVoted ? "fill-current" : ""}`}
              aria-hidden
            />
            {prompt?.upvotes ?? 0}
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareLink}
              disabled={!prompt}
              className="gap-1.5"
            >
              {linkCopied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {linkCopied ? "Link copied" : "Share"}
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prompt}
                  className="gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs">
                  <Share2 className="h-3.5 w-3.5" />
                  Export prompt
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExportMarkdown} className="gap-2">
                  <FileText className="h-4 w-4 text-foreground/70" />
                  <div className="flex flex-col">
                    <span>Markdown (.md)</span>
                    <span className="text-[10px] text-foreground/50">
                      For docs &amp; READMEs
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJson} className="gap-2">
                  <FileJson className="h-4 w-4 text-foreground/70" />
                  <div className="flex flex-col">
                    <span>JSON (.json)</span>
                    <span className="text-[10px] text-foreground/50">
                      Portable &amp; structured
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleCopy} className="gap-2">
                  <Copy className="h-4 w-4 text-foreground/70" />
                  <span>Copy prompt text</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              onClick={handleCopy}
              disabled={!prompt}
              className="gap-1.5"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button
              onClick={() => prompt && onTestInPlayground(prompt)}
              disabled={!prompt}
              className="gap-1.5"
            >
              <FlaskConical className="h-4 w-4" aria-hidden />
              Test in playground
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
