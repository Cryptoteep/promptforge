"use client";

import * as React from "react";
import { Upload, Loader2, Github, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, type Category } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SubmitFormProps {
  /** Bumped by parent to reset the form after a successful external action. */
  onSubmitSuccess: () => void;
}

interface FormState {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorGithub: string;
  model: string;
  exampleOutput: string;
}

const EMPTY: FormState = {
  title: "",
  description: "",
  content: "",
  category: "",
  tags: "",
  authorName: "",
  authorGithub: "",
  model: "glm-4.6",
  exampleOutput: "",
};

export function SubmitForm({ onSubmitSuccess }: SubmitFormProps) {
  const [form, setForm] = React.useState<FormState>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim()) next.title = "Title is required";
    else if (form.title.trim().length > 120)
      next.title = "Keep the title under 120 characters";

    if (!form.description.trim())
      next.description = "A short description helps others find your prompt";
    else if (form.description.trim().length > 280)
      next.description = "Keep the description under 280 characters";

    if (!form.content.trim()) next.content = "The prompt content is required";
    else if (form.content.trim().length < 20)
      next.content = "That prompt looks too short to be useful";

    if (!form.category) next.category = "Pick a category";
    if (!form.authorName.trim())
      next.authorName = "Tell us who to credit (use a handle if you like)";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        content: form.content,
        category: form.category,
        tags: form.tags.trim(),
        authorName: form.authorName.trim(),
        authorGithub: form.authorGithub.trim() || null,
        model: form.model || "glm-4.6",
        exampleOutput: form.exampleOutput.trim() || null,
      };
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setForm(EMPTY);
      setErrors({});
      toast.success("Thanks! Your prompt is pending review.", {
        description:
          "Want it live faster? Open a PR → github.com/Cryptoteep/promptforge",
        duration: 7000,
      });
      onSubmitSuccess();
    } catch (err: unknown) {
      toast.error("Couldn't submit your prompt", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="submit"
      aria-labelledby="submit-heading"
      className="scroll-mt-20 border-t"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-6 flex flex-col gap-1">
          <div className="inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="h-4 w-4" aria-hidden />
            </span>
            <h2
              id="submit-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Submit a prompt
            </h2>
          </div>
          <p className="text-sm text-foreground/60">
            Share a prompt that actually works. Submissions are reviewed before
            going live — no signup required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
          aria-label="Submit a new prompt"
        >
          {/* Title */}
          <Field
            id="title"
            label="Title"
            required
            error={errors.title}
            hint="A clear, specific name for the prompt."
          >
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Refactor code for readability"
              maxLength={120}
              aria-invalid={!!errors.title}
            />
          </Field>

          {/* Description */}
          <Field
            id="description"
            label="Description"
            required
            error={errors.description}
            hint="One or two sentences on what it does and when to use it."
          >
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="e.g. Takes a messy function and returns a cleaner, idiomatic version with a list of changes."
              maxLength={280}
              rows={2}
              aria-invalid={!!errors.description}
            />
          </Field>

          {/* Content */}
          <Field
            id="content"
            label="Prompt content"
            required
            error={errors.content}
            hint={
              <>
                The actual prompt text. Use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-[11px] text-foreground/70">
                  {`{{variables}}`}
                </code>{" "}
                for dynamic values.
              </>
            }
          >
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder={"You are a senior engineer.\n\nRefactor the following {{language}} code:\n```\n{{code}}\n```"}
              rows={7}
              className="pf-scroll resize-y font-mono text-sm"
              aria-invalid={!!errors.content}
            />
          </Field>

          {/* Category + Tags */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id="category"
              label="Category"
              required
              error={errors.category}
            >
              <Select
                value={form.category}
                onValueChange={(v) => update("category", v)}
              >
                <SelectTrigger
                  id="category"
                  className="w-full"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="Choose a category…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c: Category) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              id="tags"
              label="Tags"
              hint="Comma-separated. e.g. refactor, clean-code, review"
            >
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="refactor, clean-code, review"
              />
            </Field>
          </div>

          {/* Author + Github */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id="authorName"
              label="Your name / handle"
              required
              error={errors.authorName}
              hint="Shown publicly on the prompt card."
            >
              <Input
                id="authorName"
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
                placeholder="e.g. ada-lovelace"
                aria-invalid={!!errors.authorName}
              />
            </Field>

            <Field
              id="authorGithub"
              label="GitHub handle"
              hint="Optional — links to your GitHub profile."
            >
              <Input
                id="authorGithub"
                value={form.authorGithub}
                onChange={(e) => update("authorGithub", e.target.value)}
                placeholder="e.g. ada-lovelace (without the @)"
                autoCorrect="off"
                autoCapitalize="none"
              />
            </Field>
          </div>

          {/* Model + Example output */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="model" label="Suggested model" hint="Defaults to GLM-4.6.">
              <Select
                value={form.model}
                onValueChange={(v) => update("model", v)}
              >
                <SelectTrigger id="model" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glm-4.6">GLM-4.6</SelectItem>
                  <SelectItem value="glm-4.5">GLM-4.5</SelectItem>
                  <SelectItem value="glm-4-plus">GLM-4-Plus</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field
              id="exampleOutput"
              label="Example output"
              hint="Optional — a short sample of what the prompt produces."
            >
              <Textarea
                id="exampleOutput"
                value={form.exampleOutput}
                onChange={(e) => update("exampleOutput", e.target.value)}
                placeholder="Paste a sample of the output here…"
                rows={2}
                className="pf-scroll resize-y text-sm"
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              By submitting, you agree your prompt is MIT-licensed and free to share.
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setForm(EMPTY);
                  setErrors({});
                }}
                disabled={submitting}
              >
                Clear
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-1.5"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {submitting ? "Submitting…" : "Submit prompt"}
              </Button>
            </div>
          </div>

          {/* Contributing note */}
          <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3 text-xs text-foreground/60">
            <Github className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
            <span>
              Prefer code review? Open a PR against the{" "}
              <a
                href="https://github.com/Cryptoteep/promptforge/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
              >
                contributing guide <ExternalLink className="h-3 w-3" />
              </a>{" "}
              to add your prompt directly to the seed file.
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && (
            <span className="ml-0.5 text-primary" aria-hidden>
              *
            </span>
          )}
        </Label>
        {error && (
          <span className="text-xs font-medium text-destructive">{error}</span>
        )}
      </div>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs text-foreground/50">{hint}</p>
      )}
    </div>
  );
}
