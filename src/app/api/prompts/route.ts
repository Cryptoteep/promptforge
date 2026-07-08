import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// GET /api/prompts
// Query: category, q (search title/description/tags), sort (popular|newest)
// Returns only status==="approved" prompts. Omits content/exampleOutput to
// keep the list payload small (the detail endpoint returns them).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.trim() || "";
  const q = searchParams.get("q")?.trim() || "";
  const sort = searchParams.get("sort") === "newest" ? "newest" : "popular";

  const where: Prisma.PromptWhereInput = { status: "approved" };
  if (category) where.category = category;
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { tags: { contains: q } },
    ];
  }

  const orderBy: Prisma.PromptOrderByWithRelationInput =
    sort === "newest" ? { createdAt: "desc" } : { upvotes: "desc" };

  const rows = await db.prompt.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      tags: true,
      authorName: true,
      authorGithub: true,
      model: true,
      upvotes: true,
      createdAt: true,
    },
    take: 200,
  });

  return NextResponse.json({ prompts: rows });
}

// POST /api/prompts — community submission. Always creates with status="pending".
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const content = String(body.content ?? "");
  const category = String(body.category ?? "").trim();
  const tags = String(body.tags ?? "").trim();
  const authorName = String(body.authorName ?? "").trim();
  const authorGithubRaw = body.authorGithub;
  const authorGithub = authorGithubRaw
    ? String(authorGithubRaw).trim().replace(/^@/, "")
    : null;
  const model = String(body.model ?? "glm-4.6").trim() || "glm-4.6";
  const exampleOutputRaw = body.exampleOutput;
  const exampleOutput = exampleOutputRaw ? String(exampleOutputRaw).trim() : null;

  // Validate required fields.
  const errors: Record<string, string> = {};
  if (!title) errors.title = "Title is required";
  else if (title.length > 120) errors.title = "Title is too long (120 chars max)";
  if (!description) errors.description = "Description is required";
  else if (description.length > 280)
    errors.description = "Description is too long (280 chars max)";
  if (!content || content.trim().length < 20)
    errors.content = "Content is required (at least 20 characters)";
  if (!category) errors.category = "Category is required";
  if (!authorName) errors.authorName = "Author name is required";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }

  const created = await db.prompt.create({
    data: {
      title,
      description,
      content,
      category,
      tags,
      authorName,
      authorGithub: authorGithub || null,
      model,
      exampleOutput: exampleOutput || null,
      status: "pending",
      upvotes: 0,
    },
  });

  return NextResponse.json({ prompt: created }, { status: 201 });
}
