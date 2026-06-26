"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCatalogObjectById, TYPE_COLORS, TYPE_LABELS } from "@/lib/catalog";
import { useDriftspaceStore } from "@/lib/store";
import type { TopicBriefing } from "@/lib/store";
import NebulaSpinner from "@/components/NebulaSpinner";
import TopicChat from "@/components/TopicChat";
import { linkGlossaryTerms } from "@/lib/linkGlossaryTerms";

const HeroPlanet = dynamic(() => import("@/components/ui/HeroPlanet"), { ssr: false });

export default function ObjectPage() {
  const { id } = useParams<{ id: string }>();
  const obj = getCatalogObjectById(id);
  const { catalogBriefings, setCatalogBriefing, nerdLevel, contextNote, setContextNote } =
    useDriftspaceStore();
  const [briefing, setBriefingLocal] = useState<TopicBriefing | null>(
    catalogBriefings[id] ?? null
  );
  const [loading, setLoading] = useState(!catalogBriefings[id]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => { setContextNote(null); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!obj) return;
    if (catalogBriefings[id]) {
      setBriefingLocal(catalogBriefings[id]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/ai/catalog-briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objectName: obj.name,
        objectType: obj.type,
        parentBody: obj.parentBody,
        nerdLevel,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setCatalogBriefing(id, data);
        setBriefingLocal(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Signal lost in interstellar noise. Try refreshing.");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, nerdLevel]);

  if (!obj) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: 80 }}>
        <div className="text-6xl mb-4">🌑</div>
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fff" }}
        >
          Object not found
        </h1>
        <p style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
          That object isn&apos;t in the atlas yet.
        </p>
        <Link href="/catalog" className="mt-6 text-sm underline" style={{ color: "#64ffda" }}>
          ← Browse the Cosmic Atlas
        </Link>
      </div>
    );
  }

  const typeColor = TYPE_COLORS[obj.type];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── VISUAL HEADER ── */}
      <section className="relative" style={{ height: "min(65vh, 520px)", overflow: "hidden", background: "radial-gradient(ellipse at center, #0a0a20 0%, #050510 100%)" }}>
        <HeroPlanet
          primaryColor={obj.shaderPreset.color1}
          accentColor={obj.shaderPreset.color2}
          size={500}
          opacity={0.9}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,16,0.15) 0%, rgba(5,5,16,0.4) 50%, rgba(5,5,16,1) 100%)",
          }}
        />
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center"
          style={{ zIndex: 2 }}
        >
          {contextNote && (
            <div
              className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "rgba(100,255,218,0.1)",
                border: "1px solid rgba(100,255,218,0.3)",
                color: "#64ffda",
                fontFamily: "Inter, sans-serif",
                animation: "fadeInUp 400ms cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <span>✦</span>
              <span>{contextNote}</span>
            </div>
          )}
          <nav
            className="mb-4 flex items-center gap-2 text-sm flex-wrap justify-center"
            style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
          >
            <Link href="/catalog" className="hover:text-white" style={{ transition: "color 150ms ease" }}>
              Atlas
            </Link>
            <span>/</span>
            <span style={{ color: typeColor }}>{TYPE_LABELS[obj.type]}</span>
            {obj.parentBody && (
              <>
                <span>/</span>
                <span style={{ color: "#8892b0" }}>{obj.parentBody}</span>
              </>
            )}
            <span>/</span>
            <span style={{ color: "#fff" }}>{obj.name}</span>
          </nav>

          {/* Type badge */}
          <div
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: `${typeColor}18`,
              border: `1px solid ${typeColor}40`,
              color: typeColor,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {TYPE_LABELS[obj.type]}
            {obj.parentBody && <span style={{ opacity: 0.7 }}>· {obj.parentBody}</span>}
          </div>

          <h1
            className="font-semibold mb-4"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              letterSpacing: "-0.03em",
              color: "#fff",
              lineHeight: 1.05,
            }}
          >
            {obj.name}
          </h1>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#8892b0",
                fontFamily: "Inter, sans-serif",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              📍 {obj.distanceFromEarth}
            </span>
            {obj.discoveredYear && (
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#8892b0",
                  fontFamily: "Inter, sans-serif",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                🔭 Discovered {obj.discoveredYear}
                {obj.discoveredBy ? ` · ${obj.discoveredBy}` : ""}
              </span>
            )}
            {nerdLevel && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(123,47,255,0.15)",
                  color: "#b57bee",
                  border: "1px solid rgba(123,47,255,0.3)",
                }}
              >
                🧪 Nerd Mode
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Short fact callout */}
        <div
          className="rounded-xl p-6"
          style={{ background: `${typeColor}08`, border: `1px solid ${typeColor}25` }}
        >
          <p
            className="text-lg italic leading-relaxed"
            style={{ color: typeColor, fontFamily: "Space Grotesk, sans-serif", fontWeight: 300, letterSpacing: "-0.01em" }}
          >
            &ldquo;{obj.shortFact}&rdquo;
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {obj.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#8892b0",
                fontFamily: "Inter, sans-serif",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ── AI Briefing ── */}
        <section>
          <p
            className="text-xs font-medium tracking-widest uppercase mb-6"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            The AI Briefing
          </p>

          {loading && (
            <div className="flex flex-col items-center gap-4 py-16">
              <NebulaSpinner size={56} label="Consulting the cosmos…" />
            </div>
          )}

          {error && (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <p style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          {briefing && (
            <div className="space-y-10">
              {/* One-liner */}
              <p
                className="italic text-xl leading-relaxed"
                style={{
                  color: "#64ffda",
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  borderLeft: "2px solid rgba(100,255,218,0.3)",
                  paddingLeft: 20,
                }}
              >
                &ldquo;{briefing.oneLiner}&rdquo;
              </p>

              {/* Physics explained */}
              <div
                className="text-base leading-relaxed"
                style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif", lineHeight: 1.85, whiteSpace: "pre-line" }}
              >
                {linkGlossaryTerms(briefing.physicsExplained ?? "")}
              </div>

              {/* Key stats */}
              {briefing.keyStats?.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-semibold mb-4"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      color: "#8892b0",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Key Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {briefing.keyStats.map((stat, i) => (
                      <div
                        key={i}
                        className="metric-card text-center"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(100,255,218,0.08)",
                          borderRadius: 12,
                          padding: "16px 12px",
                        }}
                      >
                        <p
                          className="text-xl font-bold mb-1"
                          style={{ fontFamily: "Space Grotesk, sans-serif", color: typeColor }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs mb-0.5" style={{ color: "#8892b0" }}>{stat.unit}</p>
                        <p className="text-xs font-medium" style={{ color: "#fff" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unsolved mystery */}
              {briefing.unsolvedMystery && (
                <div
                  className="rounded-xl p-6"
                  style={{ background: "rgba(123,47,255,0.06)", border: "1px solid rgba(123,47,255,0.2)" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🔬</span>
                    <span
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "#b57bee", fontFamily: "Inter, sans-serif" }}
                    >
                      Open Question
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#e2e8f0", fontFamily: "Inter, sans-serif", lineHeight: 1.8 }}
                  >
                    {linkGlossaryTerms(briefing.unsolvedMystery)}
                  </p>
                </div>
              )}

              {/* Real missions */}
              {briefing.realMissions?.length > 0 && (
                <div>
                  <h3
                    className="text-sm font-semibold mb-4"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      color: "#8892b0",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Key Missions & Observations
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {briefing.realMissions.map((mission, i) => (
                      <div
                        key={i}
                        className="shrink-0 rounded-xl p-4"
                        style={{
                          width: 220,
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(100,255,218,0.1)",
                          borderLeft: `3px solid ${typeColor}`,
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#fff", fontFamily: "Space Grotesk, sans-serif" }}
                          >
                            {mission.name}
                          </span>
                          <span className="text-xs" style={{ color: typeColor }}>
                            {mission.year}
                          </span>
                        </div>
                        <p
                          className="text-xs mb-2"
                          style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
                        >
                          {mission.agency}
                        </p>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif", lineHeight: 1.6 }}
                        >
                          {mission.finding}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Back links */}
        <div className="flex items-center gap-4 pt-4 flex-wrap" style={{ borderTop: "1px solid rgba(100,255,218,0.08)" }}>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Cosmic Atlas
          </Link>
          {obj.type === "moon" && (
            <Link
              href="/catalog/moons"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "#93c5fd", fontFamily: "Inter, sans-serif" }}
            >
              🌙 Moon Atlas
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* AI Chat */}
      <TopicChat topicName={obj.name} topicSlug={`catalog-${obj.id}`} />
    </div>
  );
}
