import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";
import { topics } from "@/lib/topics";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { spark } = await req.json();

    const topicSummaries = topics.map(t => `${t.slug} (${t.name}, ${t.pillar})`).join(", ");

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble: "You are a personalized learning path designer for a space science platform. Return ONLY valid JSON — no markdown, no code blocks.",
      message: `A complete beginner is starting their space science journey. Their initial spark of interest was: "${spark}".

Create a personalized 5-topic learning path from the available topics below. Choose topics that:
1. Start easy and build naturally in complexity
2. Connect to their specific spark of curiosity
3. Form a coherent narrative progression

Available topics: ${topicSummaries}

Return ONLY this JSON:
{
  "path": [
    { "slug": "topic-slug", "reason": "One sentence explaining why this topic is perfect for them given their spark" },
    { "slug": "topic-slug", "reason": "..." },
    { "slug": "topic-slug", "reason": "..." },
    { "slug": "topic-slug", "reason": "..." },
    { "slug": "topic-slug", "reason": "..." }
  ]
}

No markdown, no code blocks, only valid JSON.`,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({
        path: [
          { slug: "the-sun", reason: "Start with what you see every day." },
          { slug: "stellar-evolution", reason: "Learn how stars live and die." },
          { slug: "milky-way", reason: "Zoom out to your galactic home." },
          { slug: "big-bang", reason: "Discover where everything came from." },
          { slug: "dark-energy", reason: "The universe's greatest mystery." },
        ],
      });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("Beginner path error:", err);
    return NextResponse.json({ error: "Failed to generate path" }, { status: 500 });
  }
}
