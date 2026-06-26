import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const { topicName } = await req.json();

    const cacheKey = JSON.stringify({ topicName });
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble:
        "You are a science communicator writing for a space learning platform. Be concise, wonder-inducing, and accurate. Return only plain text — no markdown, no JSON.",
      message: `Write a 3-sentence teaser for the topic "${topicName}" that will appear in a space learning platform sidebar.

Make it intriguing, wonder-inducing, and accurate. Start with the most surprising or counterintuitive fact. End with a question that makes the reader want to explore more. Plain English, no jargon.

Return ONLY the 3 sentences as plain text, no JSON, no markdown.`,
      maxTokens: 300,
    });

    const text = response.text?.trim() ?? "";
    const result = { teaser: text };
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return NextResponse.json(result);
  } catch (err) {
    console.error("Teaser error:", err);
    return NextResponse.json({
      teaser: "An incredible cosmic mystery awaits. The universe has secrets that will change how you see everything. Ready to dive in?",
    });
  }
}
