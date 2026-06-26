"use client";
import { useEffect, useRef, useState } from "react";
import { useDriftspaceStore } from "@/lib/store";

interface Props {
  topicName: string;
  topicSlug: string;
  autoOpen?: boolean;
  autoPrompt?: string;
  position?: "left" | "right";
}

const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  default: [
    "What's the biggest unsolved mystery here?",
    "How does this connect to everyday life?",
    "What would Einstein think about this?",
  ],
};

export default function TopicChat({ topicName, topicSlug, autoOpen, autoPrompt, position = "right" }: Props) {
  const [open, setOpen] = useState(!!autoOpen);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [suggestions] = useState<string[]>(SUGGESTED_QUESTIONS.default);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { chatHistories, addMessage, nerdLevel } = useDriftspaceStore();
  const messages = chatHistories[topicSlug] ?? [];
  const messageCount = messages.length;
  const autoSentRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCount, streaming]);

  useEffect(() => {
    if (autoPrompt && !autoSentRef.current && messages.length === 0) {
      autoSentRef.current = true;
      sendMessage(autoPrompt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPrompt]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;
    setInput("");
    addMessage(topicSlug, { role: "user", content: text });
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName,
          nerdLevel,
          messages: [...messages, { role: "user", content: text }],
        }),
      });

      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        addMessage(topicSlug, { role: "assistant", content: full });
      }

      if (!full) throw new Error("Empty response");
    } catch {
      addMessage(topicSlug, {
        role: "assistant",
        content: "The signal was lost in the cosmic noise. Try again?",
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const displayMessages = messages.reduce<Array<typeof messages[0]>>((acc, msg) => {
    if (msg.role === "assistant" && acc.length > 0 && acc[acc.length - 1].role === "assistant") {
      acc[acc.length - 1] = msg;
    } else {
      acc.push(msg);
    }
    return acc;
  }, []);

  return (
    <div
      className={`fixed bottom-6 ${position === "left" ? "left-6" : "right-6"} z-50 flex flex-col`}
      style={{ width: open ? 380 : "auto", alignItems: position === "left" ? "flex-start" : "flex-end" }}
    >
      {open && (
        <div
          className="mb-3 flex flex-col"
          style={{
            background: "rgba(10,10,31,0.97)",
            border: "1px solid rgba(100,255,218,0.15)",
            borderRadius: 12,
            boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
            maxHeight: 480,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 shrink-0"
            style={{ borderBottom: "1px solid rgba(100,255,218,0.08)" }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>
                Ask about {topicName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#8892b0" }}>
                Expert astrophysicist • instant answers
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded transition-colors"
              style={{ color: "#8892b0" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 200, maxHeight: 280 }}>
            {displayMessages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">🔭</div>
                <p className="text-sm" style={{ color: "#8892b0" }}>
                  Ask anything about {topicName}
                </p>
              </div>
            )}
            {displayMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed"
                  style={{
                    background: msg.role === "user"
                      ? "rgba(100,255,218,0.12)"
                      : "rgba(255,255,255,0.05)",
                    border: msg.role === "user"
                      ? "1px solid rgba(100,255,218,0.2)"
                      : "1px solid rgba(255,255,255,0.06)",
                    color: msg.role === "user" ? "#64ffda" : "#e2e8f0",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {streaming && displayMessages[displayMessages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-lg flex gap-1"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#64ffda]"
                      style={{ animation: `breathe 1.4s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {displayMessages.length < 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-2.5 py-1 rounded-full transition-colors duration-200"
                  style={{
                    background: "rgba(100,255,218,0.05)",
                    border: "1px solid rgba(100,255,218,0.15)",
                    color: "#64ffda",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="p-3 shrink-0"
            style={{ borderTop: "1px solid rgba(100,255,218,0.08)" }}
          >
            <div
              className="flex items-end gap-2 rounded-lg p-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(100,255,218,0.1)" }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question…"
                rows={1}
                className="flex-1 bg-transparent outline-none resize-none text-sm"
                style={{
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1.5,
                  maxHeight: 80,
                }}
                disabled={streaming}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || streaming}
                className="shrink-0 p-1.5 rounded-md transition-colors duration-200"
                style={{
                  background: input.trim() && !streaming ? "#64ffda" : "rgba(100,255,218,0.1)",
                  color: input.trim() && !streaming ? "#050510" : "#64ffda",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m22 2-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300"
        style={{
          background: open ? "rgba(100,255,218,0.1)" : "#64ffda",
          color: open ? "#64ffda" : "#050510",
          border: "1px solid rgba(100,255,218,0.3)",
          boxShadow: open ? "none" : "0 0 24px rgba(100,255,218,0.35)",
          fontFamily: "Space Grotesk",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {open ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}
