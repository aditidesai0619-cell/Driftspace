import { CohereClient } from "cohere-ai";
import { NextRequest } from "next/server";

const co = new CohereClient({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { topicName, messages, nerdLevel } = await req.json();

    const nerdNote = nerdLevel
      ? " Use technical terminology, equations where helpful, and cite real physicists and papers."
      : " Keep answers accessible — plain language, no equations.";

    // Separate the last user message from the history
    const allMessages: { role: string; content: string }[] = messages;
    const lastMessage = allMessages[allMessages.length - 1];
    const history = allMessages.slice(0, -1);

    const chatHistory = history.map((m) => ({
      role: m.role === "user" ? ("USER" as const) : ("CHATBOT" as const),
      message: m.content,
    }));

    const stream = await co.chatStream({
      model: "command-r-plus-08-2024",
      preamble: `You are an expert astrophysicist and science communicator. The user is reading about "${topicName}". Answer their questions specifically about this topic. Be detailed and accurate, cite real missions and scientists where relevant.${nerdNote} Keep answers under 200 words unless asked to go deeper. Never break character.`,
      message: lastMessage.content,
      chatHistory,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.eventType === "text-generation") {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return new Response("Signal lost in the cosmic noise. Try again.", { status: 500 });
  }
}
