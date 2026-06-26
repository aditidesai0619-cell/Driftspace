import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topicName, nerdLevel } = await req.json();

    const nerdAddition = nerdLevel
      ? " Include relevant equations (use LaTeX-style notation inline), technical terminology, and cite real papers with author names and years where appropriate."
      : " Keep explanations accessible to a general audience — no equations, minimal jargon.";

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble: "You are an expert astrophysicist and science communicator. Always return valid JSON only — no markdown, no code blocks, no preamble.",
      message: `Generate a structured briefing for the topic: "${topicName}". ${nerdAddition}

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
Return ONLY the JSON object, no markdown, no code blocks, no preamble.`,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
    }

    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Briefing error:", err);
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
