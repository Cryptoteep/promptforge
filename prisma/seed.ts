import { db } from "../src/lib/db";

// 14 high-quality, real, useful prompts across 7 categories.
// Each uses realistic {{variable}} placeholders in content.
const prompts = [
  // ---------- coding (2) ----------
  {
    title: "Refactor code for readability",
    description:
      "Take a working but messy function or module and produce a cleaner, idiomatic version with preserved behavior and clear comments.",
    content:
      "You are a senior software engineer who values readable, maintainable code over clever one-liners.\n\nRefactor the following {{language}} code for readability without changing its behavior. Apply the language's idiomatic conventions, extract well-named helpers where it reduces duplication, and add concise comments only where the intent is non-obvious.\n\nThen, briefly list (as bullet points) every change you made and why.\n\nCode:\n```\n{{code}}\n```",
    category: "coding",
    tags: "refactor,readability,clean-code,review",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "## Refactored code\n```ts\nfunction groupBy<T, K extends string>(items: T[], key: (item: T) => K) {\n  return items.reduce((acc, item) => {\n    (acc[key(item)] ??= []).push(item);\n    return acc;\n  }, {} as Record<K, T[]>);\n}\n```\n\n## Changes\n- Replaced nested loops with `reduce` for a single pass.\n- Used nullish assignment (`??=`) to lazily create arrays.\n- Added generics so the function is reusable and type-safe.",
  },
  {
    title: "Generate a commit message",
    description:
      "Turn a git diff into a clear, conventional-commits style message that reviewers will thank you for.",
    content:
      "You are a meticulous open-source maintainer who writes commit messages that future contributors can understand a year later.\n\nGiven the following git diff, write a single commit message in Conventional Commits format (type(scope): subject). The subject must be <= 72 chars, imperative mood, lowercase. Add a body only if the 'why' is not obvious from the subject. Do not invent details that are not in the diff.\n\nDiff:\n```\n{{diff}}\n```",
    category: "coding",
    tags: "git,commit,conventional-commits,workflow",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "feat(auth): support refresh token rotation\n\nRotate the stored refresh token on every use so a leaked token becomes\nuseless after one valid request. Invalid tokens now return 401 without\nre-issuing.",
  },

  // ---------- writing (2) ----------
  {
    title: "Summarize meeting notes into action items",
    description:
      "Convert raw meeting notes into a tight summary plus a table of action items with owners and due dates.",
    content:
      "You are an executive assistant who never lets an action item slip through the cracks.\n\nFrom the meeting notes below, produce:\n1. A 3-5 bullet summary of decisions made.\n2. A markdown table of action items with columns: Action, Owner, Due date, Priority (P0-P3). If an owner or date is not in the notes, write \"unassigned\" / \"TBD\" rather than guessing.\n3. A list of any open questions that were not resolved.\n\nMeeting notes:\n{{notes}}",
    category: "writing",
    tags: "meetings,summary,action-items,productivity",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "## Decisions\n- Ship the new onboarding flow on May 12.\n- Freeze feature work during the May 5-9 migration window.\n\n## Action items\n| Action | Owner | Due date | Priority |\n|---|---|---|---|\n| Draft onboarding rollout comms | unassigned | 2024-05-03 | P1 |\n\n## Open questions\n- Do we keep the legacy /signup route for two weeks as a fallback?",
  },
  {
    title: "Brainstorm blog post ideas",
    description:
      "Generate 10 unique, non-generic blog post ideas for a given niche, audience, and tone.",
    content:
      "You are a content strategist who has read too many listicles and refuses to add to the noise.\n\nGenerate 10 blog post ideas for the niche \"{{niche}}\" aimed at {{audience}}. Use a {{tone}} tone. Each idea must include:\n- A working title (<= 70 chars)\n- The specific angle (one sentence on why it is not generic)\n- The primary keyword it would target\n\nAvoid titles that start with a number unless the number is the actual point of the post.",
    category: "writing",
    tags: "blog,content,brainstorm,seo",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "1. **The hidden cost of zero-downtime deploys** — A post-mortem angle on the operational debt \"zero downtime\" creates. Keyword: deploy strategy.\n2. **Why your design system is secretly a product** — Frames DS work as PM work. Keyword: design systems.",
  },

  // ---------- analysis (2) ----------
  {
    title: "Analyze CSV data and surface insights",
    description:
      "Paste a small CSV and get back the three most important patterns, with plain-English explanations.",
    content:
      "You are a data analyst who writes for stakeholders, not for other analysts.\n\nHere is a small CSV:\n```\n{{csv}}\n```\n\nProduce:\n1. A one-paragraph plain-English description of what this data represents.\n2. The three most important patterns or anomalies, each with: the finding, why it matters, and a concrete next step.\n3. A short list of caveats (small sample size, missing columns, etc.).\n\nDo not hallucinate values that are not in the CSV. If something is unclear, say so.",
    category: "analysis",
    tags: "data,csv,insights,analytics",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "The data tracks weekly signups per channel for an 8-week period.\n\n1. **Referral signups tripled in week 6.** Likely the affiliate launch. Next step: confirm with the growth team and lock in the budget.\n2. **Organic is flat but cost-per-signup is rising** — see caveat: ad spend column is missing.",
  },
  {
    title: "Root-cause a production incident",
    description:
      "Given an incident timeline, identify the most likely root cause and three preventive actions.",
    content:
      "You are an SRE who has run hundreds of blameless post-mortems.\n\nGiven the incident timeline below, produce a post-mortem with:\n1. **Summary** — one paragraph a VP could read.\n2. **Impact** — duration, affected users, and any revenue/data impact (state \"unknown\" if not given).\n3. **Most likely root cause** — single most probable cause, with reasoning.\n4. **Timeline** — bulleted, only facts from the input.\n5. **Action items** — 3 preventive actions, each with a suggested owner type (e.g. \"platform team\").\n\nDo not invent facts. If the timeline is ambiguous, list the candidate causes and pick one with stated confidence.\n\nTimeline:\n{{timeline}}",
    category: "analysis",
    tags: "sre,incident,post-mortem,debugging",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "Most likely root cause: a misconfigured connection pool size that was changed in the morning deploy, which only surfaced under peak traffic.\n\nAction items: add pool-size to the deploy checklist (platform); add a load test to CI (QA); alert on pool wait time (SRE).",
  },

  // ---------- creative (2) ----------
  {
    title: "Write a short story in a specific voice",
    description:
      "A 500-word short story in any genre, voice, and with any constraint you choose.",
    content:
      "You are a published short-fiction writer with a strong, distinctive voice.\n\nWrite a short story (~500 words) in the genre \"{{genre}}\". The protagonist is a {{protagonist}}. Voice: {{voice}}.\n\nHard constraint: {{constraint}} (e.g. \"no adverbs\", \"told entirely in second person\", \"ends with a question\").\n\nDo not include a moral or a summary at the end. Trust the reader.",
    category: "creative",
    tags: "fiction,short-story,writing,voice",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "The lighthouse keeper had not spoken to anyone in forty-one days, which was fine, because the lighthouse had finally started speaking back...",
  },
  {
    title: "Generate a product name and tagline",
    description:
      "Get a short list of memorable, non-generic product names with matching taglines and a rationale.",
    content:
      "You are a brand strategist who has named 100+ startups and refuses to suggest anything with \"ly\", \"ify\", or a missing vowel.\n\nFor a product described as: \"{{description}}\"\nTarget customer: {{customer}}\nBrand vibe: {{vibe}}\n\nGenerate 8 name options, each with:\n- The name\n- A tagline (<= 6 words)\n- One sentence on why it fits the vibe\n- Whether the .com is plausibly available (your best guess)\n\nRank them from strongest to weakest.",
    category: "creative",
    tags: "branding,naming,tagline,startup",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "1. **Northwind** — \"Shipping, simplified.\" — Evokes reliable trade routes; fits a B2B logistics vibe. .com likely taken.\n2. **Cartographer** — \"Map every order.\" — Geographical, premium. .com likely taken.",
  },

  // ---------- education (2) ----------
  {
    title: "Explain a concept like I'm 5",
    description:
      "A genuine ELI5 explanation that uses an analogy a child would actually understand — no jargon, no condescension.",
    content:
      "You are a patient teacher who can explain anything to a curious 5-year-old without dumbing it down or using jargon.\n\nExplain the concept \"{{concept}}\" so that a 5-year-old can understand it.\n\nRules:\n- Start with a single concrete analogy a child already knows about.\n- Use no words longer than 3 syllables unless absolutely necessary.\n- End with one sentence that connects the analogy back to the real concept.\n- Do not say \"simply put\" or \"in other words\". Just say it once, well.",
    category: "education",
    tags: "explain,eli5,analogy,learning",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "Imagine you have a big box of crayons and you want to share them with your friend across the street. You can't walk over, so you put the crayons in a paper airplane and throw it. The internet is just a lot of very fast paper airplanes carrying pictures of crayons.",
  },
  {
    title: "Create a study plan for any exam",
    description:
      "A realistic, day-by-day study plan that fits the time you actually have — not the time you wish you had.",
    content:
      "You are a tutor who has helped hundreds of students pass exams they were sure they would fail.\n\nBuild a study plan for the {{exam}} exam. The student has {{hours_per_week}} hours per week for {{weeks}} weeks. Their current level is {{level}} (1=beginner, 5=expert).\n\nOutput:\n1. A week-by-week table with columns: Week, Focus, Topics, Suggested activity, Estimated hours.\n2. A list of 3 high-yield resources (free first, paid only if necessary).\n3. The single biggest mistake students make on this exam and how to avoid it.\n\nBe realistic: do not assign more hours than the student has.",
    category: "education",
    tags: "study,exam,plan,learning",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "| Week | Focus | Topics | Activity | Hours |\n|---|---|---|---|---|\n| 1 | Diagnostic | Full syllabus | Take a timed mock, score it | 6 |\n\nBiggest mistake: drilling easy topics for confidence. Avoid by tracking time-per-topic and forcing yourself onto weak areas.",
  },

  // ---------- productivity (2) ----------
  {
    title: "Turn a messy brain-dump into a weekly plan",
    description:
      "Paste your unstructured to-do brain-dump and get a realistic weekly plan with time blocks.",
    content:
      "You are a calm, realistic productivity coach who would rather you do 5 important things than 50 busy ones.\n\nTake the brain-dump below and produce a weekly plan (Mon-Fri) with these rules:\n- Identify the 3 things that actually matter this week; put them in the morning when energy is high.\n- Group small admin tasks into one 45-min \"admin block\" per day.\n- Leave one 90-min block per day unscheduled for the inevitable fire.\n- End each day with a 10-min shutdown ritual.\n\nOutput as a markdown table. Do not assign more than 6 hours of deep work per day.\n\nBrain-dump:\n{{braindump}}",
    category: "productivity",
    tags: "planning,weekly,time-blocking,prioritization",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "| Day | Morning (deep) | Midday | Afternoon |\n|---|---|---|---|\n| Mon | Q3 strategy doc | admin block | open block |",
  },
  {
    title: "Draft a professional out-of-office reply",
    description:
      "A polite, on-brand OOO message that sets clear expectations without sounding like a robot.",
    content:
      "You are a thoughtful professional who writes out-of-office replies that are warm but firm about boundaries.\n\nWrite an out-of-office email reply for {{name}}, who is out from {{start_date}} to {{end_date}}.\nContext: {{context}}\nBackup contact: {{backup_contact}}\nTone: {{tone}}\n\nThe reply must:\n- State the dates clearly.\n- Say whether they will have limited access or no access.\n- Point urgent matters to the backup contact without making that person sound like a gatekeeper.\n- Fit in <= 120 words.",
    category: "productivity",
    tags: "email,ooo,template,communication",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "Hi — thanks for writing. I'm out of the office from May 6 to May 10 with no email access. If something can't wait, reach out to Dana (dana@example.com) and they'll take great care of you. Otherwise I'll reply when I'm back on Monday. — Alex",
  },

  // ---------- business (2) ----------
  {
    title: "Write a one-page business model canvas",
    description:
      "Turn a one-line idea into a complete Business Model Canvas with all 9 building blocks filled in.",
    content:
      "You are a startup mentor who has filled out hundreds of Business Model Canvases and knows which blocks founders always under-think.\n\nFor the idea: \"{{idea}}\"\n\nProduce a one-page Business Model Canvas with these 9 blocks, each as a short bullet list (3-5 bullets):\n1. Customer segments\n2. Value propositions\n3. Channels\n4. Customer relationships\n5. Revenue streams\n6. Key resources\n7. Key activities\n8. Key partnerships\n9. Cost structure\n\nThen add a \"Riskiest assumption\" line: the single assumption that, if wrong, kills the business.",
    category: "business",
    tags: "startup,business-model,canvas,strategy",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "**Riskiest assumption:** that customers will pay a premium for same-day delivery of specialty groceries, rather than just ordering from the incumbent.",
  },
  {
    title: "Draft a cold outreach email that gets a reply",
    description:
      "A short, non-spammy cold email that respects the reader's time and earns a reply.",
    content:
      "You are a sales engineer who has a 40% reply rate on cold email because you never send a wall of text.\n\nWrite a cold outreach email from {{sender_name}} at {{sender_company}} to {{recipient_name}} at {{recipient_company}}.\n\nThe email must:\n- Be <= 90 words.\n- Open with a specific, true observation about the recipient's company (use the hint: {{observation}}).\n- Make exactly one ask: a 15-min call on a specific topic.\n- Not use the words \"revolutionary\", \"game-changing\", or \"synergy\".\n- End with a soft CTA that's easy to say no to.\n\nSubject line: <= 6 words, no clickbait.",
    category: "business",
    tags: "sales,cold-email,outreach,b2b",
    authorName: "PromptForge Community",
    authorGithub: "promptforge",
    model: "glm-4.6",
    exampleOutput:
      "Subject: your checkout flow\n\nHi {{recipient_name}} — noticed {{recipient_company}} added Apple Pay last week but the cart still requires an email before shipping. Worth a 15-min call on how we cut that drop-off for two DTC brands? If now's not the time, just say so. — {{sender_name}}",
  },
];

async function main() {
  console.log(`Seeding ${prompts.length} prompts...`);

  // Wipe existing prompts + votes for idempotency.
  await db.vote.deleteMany();
  await db.prompt.deleteMany();

  for (const p of prompts) {
    await db.prompt.create({
      data: {
        title: p.title,
        description: p.description,
        content: p.content,
        category: p.category,
        tags: p.tags,
        authorName: p.authorName,
        authorGithub: p.authorGithub,
        model: p.model,
        exampleOutput: p.exampleOutput,
        status: "approved",
        // Give a few prompts an initial upvote count so "Popular" sort has signal.
        upvotes: Math.floor(Math.random() * 40) + 5,
      },
    });
  }

  const count = await db.prompt.count();
  console.log(`Done. ${count} prompts in the database.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
