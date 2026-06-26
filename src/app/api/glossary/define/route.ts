import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });
const CACHE_PATH = path.join(process.cwd(), "src", "lib", "glossary-cache.json");

// In-memory layer — checked first, avoids disk reads on repeat lookups
const memCache = new Map<string, unknown>();

function readCache(): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, unknown>) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch (err) {
    console.error("Failed to write glossary cache:", err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { term } = await req.json();
    if (!term?.trim()) {
      return NextResponse.json({ error: "Missing term" }, { status: 400 });
    }

    const key = term.trim().toLowerCase();

    if (memCache.has(key)) {
      return NextResponse.json(memCache.get(key));
    }

    const fileCache = readCache();
    if (fileCache[key]) {
      memCache.set(key, fileCache[key]);
      return NextResponse.json(fileCache[key]);
    }

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble:
        "You are a precise astronomy reference assistant. Return ONLY valid JSON — no markdown, no code blocks, no preamble.",
      message: `Define the space/astronomy term "${term}" for a curious learner. Return only valid JSON with these fields:
- term: string
- oneLiner: string (max 15 words, plain English)
- analogy: string (real-world comparison that makes it click)
- deepDive: string (2-3 paragraphs, accurate physics, written accessibly, separate paragraphs with \\n\\n)
- relatedTerms: string[] (3-4 related astronomy term names, lowercase, hyphenated, e.g. "event-horizon")
- difficulty: "beginner" | "intermediate" | "advanced"
- exampleUsage: string (a natural sentence using the term)
Return only valid JSON, no markdown, no preamble.`,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not generate a definition for that term." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const result = {
      id: key.replace(/\s+/g, "-"),
      term: parsed.term ?? term,
      category: "Fundamentals",
      oneLiner: parsed.oneLiner ?? "",
      analogy: parsed.analogy ?? "",
      deepDive: parsed.deepDive ?? "",
      relatedTerms: parsed.relatedTerms ?? [],
      appearsIn: [],
      difficulty: parsed.difficulty ?? "intermediate",
      exampleUsage: parsed.exampleUsage ?? "",
      aiGenerated: true,
    };

    memCache.set(key, result);
    fileCache[key] = result;
    writeCache(fileCache);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Glossary define error:", err);
    return NextResponse.json({ error: "Definition lookup failed." }, { status: 500 });
  }
}
