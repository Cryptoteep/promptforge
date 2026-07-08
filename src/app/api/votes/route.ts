import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import crypto from "node:crypto";

export const dynamic = "force-dynamic";

// A stable per-deploy salt so voter hashes don't compare across instances.
// Not a secret — its only job is to make the hash non-trivially reversible.
const VOTER_SALT = process.env.VOTER_SALT || "promptforge-v1";

/**
 * Build a stable, opaque voter fingerprint from request metadata.
 * We deliberately do NOT store IP or user-agent — only a one-way hash of
 * their combination. This dedupes votes per browser without identifying
 * anyone.
 */
function voterHashFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]!.trim() : "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  return crypto
    .createHash("sha256")
    .update(`${VOTER_SALT}:${ip}:${ua}`)
    .digest("hex");
}

// POST /api/votes — upvote a prompt. Idempotent per voter.
export async function POST(request: Request) {
  let body: { promptId?: string };
  try {
    body = (await request.json()) as { promptId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const promptId = body.promptId?.trim();
  if (!promptId) {
    return NextResponse.json({ error: "promptId is required" }, { status: 400 });
  }

  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true, status: true, upvotes: true },
  });
  if (!prompt || prompt.status !== "approved") {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  const voterHash = voterHashFromRequest(request);

  try {
    // Creating the vote will throw P2002 if this voter already voted on this
    // prompt (unique [promptId, voterHash]). That's our dedupe signal.
    await db.vote.create({
      data: { promptId, voterHash },
    });
    const updated = await db.prompt.update({
      where: { id: promptId },
      data: { upvotes: { increment: 1 } },
      select: { upvotes: true },
    });
    return NextResponse.json({ upvotes: updated.upvotes, voted: true });
  } catch (err: unknown) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      // Already voted — return the current count, voted:false.
      return NextResponse.json({ upvotes: prompt.upvotes, voted: false });
    }
    // Unexpected error — surface a generic message, don't leak internals.
    console.error("Vote failed:", err);
    return NextResponse.json(
      { error: "Could not register vote" },
      { status: 500 },
    );
  }
}
