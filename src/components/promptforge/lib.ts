import {
  Code2,
  PenLine,
  Microscope,
  Sparkles,
  GraduationCap,
  ListChecks,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "./types";

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for the badge — warm/distinctive, never indigo/blue. */
  badge: string;
  /** Soft tint used for the category overview card background. */
  tint: string;
  /** Gradient bar shown on the left edge of a prompt card for quick scanning. */
  bar: string;
  blurb: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  coding: {
    label: "Coding",
    icon: Code2,
    badge:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
    tint:
      "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/20",
    bar: "from-emerald-500 to-teal-500",
    blurb: "Refactor, review, commit messages, debugging help.",
  },
  writing: {
    label: "Writing",
    icon: PenLine,
    badge:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25",
    tint:
      "bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/20",
    bar: "from-amber-500 to-yellow-500",
    blurb: "Summaries, blog ideas, drafts, editing.",
  },
  analysis: {
    label: "Analysis",
    icon: Microscope,
    badge:
      "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/25",
    tint:
      "bg-teal-500/10 hover:bg-teal-500/15 border-teal-500/20",
    bar: "from-teal-500 to-cyan-500",
    blurb: "Data insights, post-mortems, root-cause analysis.",
  },
  creative: {
    label: "Creative",
    icon: Sparkles,
    badge:
      "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25",
    tint:
      "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/20",
    bar: "from-rose-500 to-pink-500",
    blurb: "Stories, naming, taglines, world-building.",
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    badge:
      "bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/25",
    tint:
      "bg-lime-500/10 hover:bg-lime-500/15 border-lime-500/20",
    bar: "from-lime-500 to-green-500",
    blurb: "Explanations, study plans, tutoring.",
  },
  productivity: {
    label: "Productivity",
    icon: ListChecks,
    badge:
      "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/25",
    tint:
      "bg-orange-500/10 hover:bg-orange-500/15 border-orange-500/20",
    bar: "from-orange-500 to-red-500",
    blurb: "Planning, email templates, weekly reviews.",
  },
  business: {
    label: "Business",
    icon: Briefcase,
    badge:
      "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/25",
    tint:
      "bg-cyan-500/10 hover:bg-cyan-500/15 border-cyan-500/20",
    bar: "from-cyan-500 to-sky-500",
    blurb: "Strategy, canvases, outreach, positioning.",
  },
};

export function categoryMeta(category: string): CategoryMeta {
  return (
    CATEGORY_META[category as Category] ?? {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      icon: Sparkles,
      badge:
        "bg-muted text-muted-foreground border-border",
      tint: "bg-muted/40 hover:bg-muted/60 border-border",
      bar: "from-muted-foreground/50 to-muted-foreground/50",
      blurb: "",
    }
  );
}

/** Parse comma-separated tags into a clean array. */
export function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Extract unique {{variable}} names from a prompt string, in order of
 * first appearance. e.g. "Hello {{name}}, {{name}} is from {{city}}" -> ["name","city"]
 */
export function extractVariables(prompt: string): string[] {
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/g;
  const seen = new Set<string>();
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt)) !== null) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

/** Replace {{variables}} with values from the map. Unfilled ones stay as-is. */
export function fillVariables(
  prompt: string,
  variables: Record<string, string>,
): string {
  return prompt.replace(
    /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/g,
    (_, name: string) => {
      const v = variables[name];
      return v !== undefined && v !== "" ? v : `{{${name}}}`;
    },
  );
}

/**
 * Render a prompt string as React with {{variables}} highlighted.
 * Returns an array of React nodes suitable for use inside a <pre> or <code>.
 */
export function renderHighlightedPrompt(
  prompt: string,
): Array<string | { type: "var"; name: string }> {
  const parts: Array<string | { type: "var"; name: string }> = [];
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_-]*)\s*\}\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prompt)) !== null) {
    if (m.index > last) parts.push(prompt.slice(last, m.index));
    parts.push({ type: "var", name: m[1] });
    last = m.index + m[0].length;
  }
  if (last < prompt.length) parts.push(prompt.slice(last));
  return parts;
}

/** Format an ISO date as e.g. "Mar 4, 2024". */
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Truncate text to a max length with an ellipsis. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

/**
 * Build a Markdown representation of a prompt, suitable for export/sharing.
 * Front-matter style metadata + the prompt body + example output.
 */
export function promptToMarkdown(p: {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorGithub?: string | null;
  model: string;
  exampleOutput?: string | null;
  upvotes?: number;
  createdAt?: string;
}): string {
  const meta = categoryMeta(p.category);
  const lines: string[] = [
    `# ${p.title}`,
    "",
    `> ${p.description}`,
    "",
    "| Field | Value |",
    "| --- | --- |",
    `| Category | ${meta.label} |`,
    `| Author | ${p.authorName}${p.authorGithub ? ` ([@${p.authorGithub}](https://github.com/${p.authorGithub}))` : ""} |`,
    `| Suggested model | \`${p.model}\` |`,
    `| Tags | ${parseTags(p.tags).map((t) => `\`${t}\``).join(", ") || "—"} |`,
  ];
  if (typeof p.upvotes === "number") lines.push(`| Upvotes | ${p.upvotes} |`);
  if (p.createdAt) lines.push(`| Added | ${formatDate(p.createdAt)} |`);
  lines.push("");
  lines.push("## Prompt", "");
  lines.push("```text", p.content, "```", "");
  if (p.exampleOutput) {
    lines.push("## Example output", "");
    lines.push("```text", p.exampleOutput, "```", "");
  }
  lines.push("---", "");
  lines.push(
    `_Exported from [PromptForge](https://github.com/Cryptoteep/promptforge) — the open-source AI prompt library. MIT licensed._`,
  );
  return lines.join("\n");
}

/**
 * Build a JSON representation of a prompt for export. Omits internal fields
 * (id, status, voterHash) so the export is portable and shareable.
 */
export function promptToJson(p: {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorGithub?: string | null;
  model: string;
  exampleOutput?: string | null;
}): string {
  return JSON.stringify(
    {
      title: p.title,
      description: p.description,
      content: p.content,
      category: p.category,
      tags: parseTags(p.tags),
      author: {
        name: p.authorName,
        github: p.authorGithub ?? null,
      },
      model: p.model,
      exampleOutput: p.exampleOutput ?? null,
      source: "PromptForge",
      sourceUrl: "https://github.com/Cryptoteep/promptforge",
      license: "MIT",
    },
    null,
    2,
  );
}

/** Trigger a browser download of a text blob with the given filename. */
export function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Slugify a string for use in a filename (e.g. "Refactor code!" -> "refactor-code"). */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "prompt";
}
