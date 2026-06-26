"use client";
import { useState } from "react";
import Link from "next/link";
import { getTopicBySlug, PILLAR_COLORS } from "@/lib/topics";
import NebulaSpinner from "@/components/NebulaSpinner";
import { linkGlossaryTerms } from "@/lib/linkGlossaryTerms";

const SPARKS = [
  { id: "movie", emoji: "🎬", title: "A movie or TV show", description: "Interstellar, The Martian, Cosmos, Contact…" },
  { id: "news", emoji: "📰", title: "A news story", description: "James Webb images, Mars rover, first black hole photo…" },
  { id: "sky", emoji: "🌙", title: "Looking at the night sky", description: "Something about those lights just won't let go." },
  { id: "book", emoji: "📚", title: "A book or documentary", description: "Sagan, Tyson, Hawking, A Brief History of Time…" },
  { id: "curious", emoji: "💭", title: "Just always been curious", description: "The big questions have always been there." },
];

interface PathStep {
  slug: string;
  reason: string;
}

export default function BeginPage() {
  const [step, setStep] = useState<"spark" | "loading" | "path">("spark");
  const [path, setPath] = useState<PathStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSparkSelect(sparkId: string) {
    setStep("loading");
    setError(null);

    const spark = SPARKS.find((s) => s.id === sparkId);
    const sparkText = spark ? `${spark.title}: ${spark.description}` : sparkId;

    try {
      const res = await fetch("/api/ai/beginner-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spark: sparkText }),
      });
      const data = await res.json();
      if (data.path && Array.isArray(data.path)) {
        setPath(data.path);
        setStep("path");
      } else {
        throw new Error("Invalid path response");
      }
    } catch {
      setError("Something drifted off course. Let's try again.");
      setStep("spark");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: 80 }}>
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(100,255,218,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(123,47,255,0.05) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-16" style={{ zIndex: 1 }}>

        {step === "spark" && (
          <div className="w-full max-w-2xl" style={{ animation: "fadeInUp 500ms cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#64ffda", fontFamily: "Inter" }}>
                Beginner Path
              </p>
              <h1
                className="font-semibold mb-4"
                style={{ fontFamily: "Space Grotesk", fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.02em", color: "#fff" }}
              >
                What first made you curious about space?
              </h1>
              <p style={{ color: "#8892b0", fontFamily: "Inter", fontSize: 16 }}>
                We&apos;ll build your personal learning path from your spark.
              </p>
              {error && (
                <p className="mt-3 text-sm" style={{ color: "#f87171" }}>{error}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {SPARKS.map((spark, i) => (
                <button
                  key={spark.id}
                  onClick={() => handleSparkSelect(spark.id)}
                  className="topic-card flex items-center gap-5 p-5 rounded-xl text-left w-full"
                  style={{
                    background: "rgba(10,10,31,0.7)",
                    border: "1px solid rgba(100,255,218,0.08)",
                    animation: `fadeInUp ${400 + i * 80}ms cubic-bezier(0.34,1.56,0.64,1) forwards`,
                    opacity: 0,
                  }}
                >
                  <span className="text-4xl shrink-0">{spark.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-base mb-1" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>
                      {spark.title}
                    </h3>
                    <p className="text-sm" style={{ color: "#8892b0", fontFamily: "Inter" }}>
                      {spark.description}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0" style={{ color: "#64ffda" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="text-center" style={{ animation: "fadeInUp 400ms ease forwards" }}>
            <NebulaSpinner size={64} />
            <p className="mt-6 text-lg font-semibold" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>
              Charting your path through the cosmos…
            </p>
            <p className="mt-2 text-sm" style={{ color: "#8892b0", fontFamily: "Inter" }}>
              Claude is building a personalized journey just for you
            </p>
          </div>
        )}

        {step === "path" && path.length > 0 && (
          <div className="w-full max-w-2xl" style={{ animation: "fadeInUp 500ms cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#64ffda", fontFamily: "Inter" }}>
                Your Personal Path
              </p>
              <h1
                className="font-semibold mb-3"
                style={{ fontFamily: "Space Grotesk", fontSize: "clamp(26px, 4vw, 42px)", letterSpacing: "-0.02em", color: "#fff" }}
              >
                Your Cosmic Journey Awaits
              </h1>
              <p style={{ color: "#8892b0", fontFamily: "Inter" }}>
                5 steps, curated for your curiosity. Start whenever you&apos;re ready.
              </p>
            </div>

            {/* Path steps */}
            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-5 top-5 bottom-5 w-px"
                style={{ background: "linear-gradient(to bottom, #64ffda44, #7b2fff44)" }}
              />

              <div className="space-y-4">
                {path.map((step, i) => {
                  const topic = getTopicBySlug(step.slug);
                  if (!topic) return null;
                  const color = PILLAR_COLORS[topic.pillar];
                  const isFirst = i === 0;

                  return (
                    <div
                      key={step.slug}
                      className="flex gap-6 items-start"
                      style={{ animation: `fadeInUp ${200 + i * 120}ms cubic-bezier(0.34,1.56,0.64,1) forwards`, opacity: 0 }}
                    >
                      {/* Step indicator */}
                      <div
                        className="shrink-0 flex items-center justify-center rounded-full z-10"
                        style={{
                          width: 40,
                          height: 40,
                          background: isFirst ? "#64ffda" : `rgba(100,255,218,0.08)`,
                          border: `2px solid ${isFirst ? "#64ffda" : "rgba(100,255,218,0.2)"}`,
                          color: isFirst ? "#050510" : "#64ffda",
                          fontFamily: "Space Grotesk",
                          fontWeight: 700,
                          fontSize: 14,
                        }}
                      >
                        {i + 1}
                      </div>

                      {/* Card */}
                      <div
                        className="flex-1 rounded-xl p-5 topic-card"
                        style={{
                          background: isFirst ? "rgba(100,255,218,0.06)" : "rgba(10,10,31,0.7)",
                          border: isFirst ? "1px solid rgba(100,255,218,0.25)" : "1px solid rgba(100,255,218,0.08)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="text-xs font-medium" style={{ color, fontFamily: "Inter" }}>
                              {topic.pillar.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            </span>
                            <h3 className="font-semibold text-base" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>
                              {topic.icon} {topic.name}
                            </h3>
                          </div>
                          <span className="text-xs shrink-0" style={{ color: "#8892b0", fontFamily: "Inter" }}>
                            ~{topic.estimatedMinutes} min
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#8892b0", fontFamily: "Inter", lineHeight: 1.7 }}>
                          {linkGlossaryTerms(step.reason)}
                        </p>
                        {isFirst && (
                          <Link
                            href={`/topic/${step.slug}`}
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                            style={{ background: "#64ffda", color: "#050510", fontFamily: "Space Grotesk", boxShadow: "0 0 16px rgba(100,255,218,0.25)" }}
                          >
                            Begin with Step 1 →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex items-center gap-4 justify-center">
              <button
                onClick={() => { setStep("spark"); setPath([]); }}
                className="text-sm transition-colors"
                style={{ color: "#8892b0", fontFamily: "Inter" }}
              >
                ← Change my spark
              </button>
              <Link
                href="/explore"
                className="text-sm"
                style={{ color: "#64ffda", fontFamily: "Inter" }}
              >
                Or explore freely →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
