import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { objectName, objectType, parentBody, nerdLevel } = await req.json();

    const nerdAddition = nerdLevel
      ? " Include relevant equations, precise measurements, and cite specific missions and scientists."
      : " Keep explanations accessible — plain language, vivid analogies, no unnecessary jargon.";

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble:
        "You are an expert astrophysicist and science communicator. Always return valid JSON only — no markdown, no code blocks, no preamble.",
      message: `Generate a structured briefing for the space object: "${objectName}" (type: ${objectType}${parentBody ? `, parent body: ${parentBody}` : ""}).${nerdAddition}

Return ONLY a valid JSON object with this exact structure:
{
  "oneLiner": "One unforgettable sentence that captures the most mind-bending fact about this object",
  "physicsExplained": "3-4 paragraphs (separated by \\n\\n) explaining the physics, history, and significance of this object. Be accurate and vivid.",
  "keyStats": [
    { "label": "Stat name", "value": "123.4", "unit": "unit" }
  ],
  "unsolvedMystery": "One open scientific question or unsolved mystery about this object",
  "realMissions": [
    { "name": "Mission name", "agency": "Agency", "year": 2000, "finding": "Key discovery or contribution" }
  ]
}

Include 4-6 keyStats relevant to this specific object type. Include up to 4 real missions (or notable observations if no dedicated missions). No markdown, no code blocks, only valid JSON.`,
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error("Catalog briefing error:", err);
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
