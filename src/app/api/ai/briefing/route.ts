import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const { topicName, nerdLevel } = await req.json();

    const cacheKey = JSON.stringify({ topicName, nerdLevel });
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const nerdAddition = nerdLevel
      ? " Include relevant equations (use LaTeX-style notation inline), technical terminology, and cite real papers with author names and years where appropriate."
      : " Keep explanations accessible to a general audience — no equations, minimal jargon.";

    const message = `Generate a structured briefing for the topic: "${topicName}". ${nerdAddition}

Return ONLY a valid JSON object with exactly these fields:
{
  "oneLiner": "string (one sentence, plain English, max 120 chars)",
  "physicsExplained": "string (3-4 paragraphs separated by \\n\\n, clear but detailed, mention real physics)",
  "keyStats": [
    { "label": "string", "value": "string", "unit": "string" }
  ],
  "unsolvedMystery": "string (one real open question scientists actively debate)",
  "realMissions": [
    { "name": "string", "agency": "string", "year": number, "finding": "string (1 sentence)" }
  ]
}

The keyStats array must have exactly 5 items. The realMissions array must have exactly 3 items.
Return ONLY the JSON object, no markdown, no code blocks, no preamble.`;

    const stream = await co.chatStream({
      model: "command-r-plus-08-2024",
      preamble:
        "You are an expert astrophysicist and science communicator. Always return valid JSON only — no markdown, no code blocks, no preamble.",
      message,
      maxTokens: 1000,
    });

    let accumulated = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of stream) {
              if (chunk.eventType === "text-generation") {
                accumulated += chunk.text;
                controller.enqueue(encoder.encode(chunk.text));
              } else if (chunk.eventType === "stream-end") {
                const jsonMatch = accumulated.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  try {
                    cache.set(cacheKey, { data: JSON.parse(jsonMatch[0]), timestamp: Date.now() });
                  } catch {}
                }
              }
            }
          } finally {
            controller.close();
          }
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  } catch (err) {
    console.error("Briefing error:", err);
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
