import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topicName } = await req.json();

    const response = await co.chat({
      model: "command-r-plus-08-2024",
      preamble: "You are a science communicator writing for a space learning platform. Be concise, wonder-inducing, and accurate. Return only plain text — no markdown, no JSON.",
      message: `Write a 3-sentence teaser for the topic "${topicName}" that will appear in a space learning platform sidebar.

Make it intriguing, wonder-inducing, and accurate. Start with the most surprising or counterintuitive fact. End with a question that makes the reader want to explore more. Plain English, no jargon.

Return ONLY the 3 sentences as plain text, no JSON, no markdown.`,
    });

    const text = response.text?.trim() ?? "";
    return NextResponse.json({ teaser: text });
  } catch (err) {
    console.error("Teaser error:", err);
    return NextResponse.json({ teaser: "An incredible cosmic mystery awaits. The universe has secrets that will change how you see everything. Ready to dive in?" });
  }
}
