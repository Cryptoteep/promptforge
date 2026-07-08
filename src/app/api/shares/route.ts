import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/shares — record that a share link was copied.
 *
 * Privacy-friendly: we do NOT store who shared, only increment an aggregate
 * counter on the prompt. This gives the community a sense of which prompts
 * get passed around, without identifying anyone.
 *
 * Rate-limiting note: this is a public, unauthenticated endpoint. To prevent
 * trivial inflation, callers are expected to be real browsers clicking the
 * Share button. For a production deployment with abuse concerns, add IP-based
 * rate limiting here.
 */
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
    select: { id: true, status: true },
  });
  if (!prompt || prompt.status !== "approved") {
    return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
  }

  try {
    const updated = await db.prompt.update({
      where: { id: promptId },
      data: { shares: { increment: 1 } },
      select: { shares: true },
    });
    return NextResponse.json({ shares: updated.shares });
  } catch (err: unknown) {
    console.error("Share increment failed:", err);
    return NextResponse.json(
      { error: "Could not record share" },
      { status: 500 },
    );
  }
}
