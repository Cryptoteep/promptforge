// Shared types for PromptForge client + API.

export type Category =
  | "coding"
  | "writing"
  | "analysis"
  | "creative"
  | "education"
  | "productivity"
  | "business";

export const CATEGORIES: Category[] = [
  "coding",
  "writing",
  "analysis",
  "creative",
  "education",
  "productivity",
  "business",
];

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string;
  authorName: string;
  authorGithub: string | null;
  model: string;
  exampleOutput: string | null;
  upvotes: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  authorName: string;
  authorGithub: string | null;
  model: string;
  upvotes: number;
  createdAt: string;
  // `content` / `exampleOutput` are omitted from the list endpoint to keep
  // payloads small; the detail endpoint returns them.
}

export type SortOption = "popular" | "newest";

export interface VoteResponse {
  upvotes: number;
  voted: boolean;
}

export interface TestResponse {
  output?: string;
  error?: string;
}
