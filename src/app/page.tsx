"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { topics, PILLARS, PILLAR_COLORS, PILLAR_LABELS, PILLAR_ICONS, getTopicsByPillar } from "@/lib/topics";
import type { Topic } from "@/lib/topics";
import NebulaSpinner from "@/components/NebulaSpinner";
import { useDriftspaceStore } from "@/lib/store";

const HeroPlanet = dynamic(() => import("@/components/ui/HeroPlanet"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at center, rgba(26,68,128,0.15) 0%, transparent 60%)" }}
    />
  ),
});
const StarField = dynamic(() => import("@/components/ui/StarField"), {
  ssr: false,
  loading: () => null,
});

const PLACEHOLDER_QUERIES = [
  "How do black holes form?",
  "What is dark matter?",
  "Is there life on Europa?",
  "How big is the observable universe?",
  "What happens inside a neutron star?",
];

function useTypewriter() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = PLACEHOLDER_QUERIES[idx];
    if (typing) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2200);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 28);
        return () => clearTimeout(t);
      } else {
        setIdx((i) => (i + 1) % PLACEHOLDER_QUERIES.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, idx]);

  return displayed;
}

function RoadmapDrawer({ slug, onClose }: { slug: string; onClose: () => void }) {
  const topic = topics.find((t) => t.slug === slug);
  const [teaser, setTeaser] = useState<string | null>(null);

  useEffect(() => {
    if (!topic) return;
    setTeaser(null);
    fetch("/api/ai/teaser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: topic.slug, topicName: topic.name }),
    })
      .then((r) => r.json())
      .then((d) => setTeaser(d.teaser))
      .catch(() => setTeaser("Explore this fascinating topic to discover incredible cosmic secrets."));
  }, [topic]);

  if (!topic) return null;

  const pillarColor = PILLAR_COLORS[topic.pillar];
  const difficultyColor: Record<string, string> = {
    beginner: "#4ade80",
    intermediate: "#fbbf24",
    advanced: "#f87171",
  };

  return (
    <div className="fixed inset-0 z-40 flex" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex-1" onClick={onClose} style={{ background: "rgba(5,5,16,0.6)", backdropFilter: "blur(6px)" }} />
      <div
        className="w-full max-w-sm h-full overflow-y-auto"
        style={{
          background: "#0a0a1f",
          borderLeft: "1px solid rgba(100,255,218,0.12)",
          boxShadow: "-12px 0 60px rgba(0,0,0,0.7)",
          animation: "slideInRight 350ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

        <div className="p-6 pb-4" style={{ borderBottom: "1px solid rgba(100,255,218,0.08)" }}>
          <button onClick={onClose} className="mb-4 flex items-center gap-1.5 text-sm" style={{ color: "#8892b0" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Close
          </button>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3" style={{ background: `${pillarColor}20`, color: pillarColor, border: `1px solid ${pillarColor}40` }}>
            {PILLAR_LABELS[topic.pillar]}
          </span>
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>{topic.name}</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded font-medium" style={{ background: `${difficultyColor[topic.difficulty]}18`, color: difficultyColor[topic.difficulty] }}>
              {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
            </span>
            <span className="text-xs" style={{ color: "#8892b0" }}>~{topic.estimatedMinutes} min deep dive</span>
          </div>
        </div>

        <div className="p-6">
          {teaser ? (
            <p className="text-sm leading-relaxed" style={{ color: "#8892b0", lineHeight: 1.8 }}>{teaser}</p>
          ) : (
            <div className="flex justify-center py-6"><NebulaSpinner size={36} label="Generating teaser…" /></div>
          )}
          <Link
            href={`/topic/${topic.slug}`}
            onClick={onClose}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm"
            style={{ background: "#64ffda", color: "#050510", fontFamily: "Space Grotesk", boxShadow: "0 0 24px rgba(100,255,218,0.3)", marginTop: 24 }}
          >
            Explore this topic
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ConstellationNode({ topic, onClick }: { topic: Topic; onClick: () => void }) {
  const color = PILLAR_COLORS[topic.pillar];
  const diff: Record<string, number> = { beginner: 12, intermediate: 14, advanced: 16 };
  const size = diff[topic.difficulty] ?? 12;
  return (
    <button onClick={onClick} title={topic.name} className="group flex flex-col items-center gap-1" style={{ outline: "none" }}>
      <div className="relative" style={{ width: size + 12, height: size + 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className="rounded-full transition-all duration-300 group-hover:scale-125"
          style={{
            width: size,
            height: size,
            background: color,
            boxShadow: `0 0 ${size}px ${color}60`,
            animation: "breathe 3s ease-in-out infinite",
          }}
        />
      </div>
      <span
        className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
        style={{ color: "#fff", background: "rgba(10,10,31,0.9)", border: "1px solid rgba(100,255,218,0.15)", padding: "2px 6px", borderRadius: 4, fontFamily: "Inter", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", display: "block" }}
      >
        {topic.name}
      </span>
    </button>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [drawerSlug, setDrawerSlug] = useState<string | null>(null);
  const placeholder = useTypewriter();
  const { setContextNote, setNotFoundSearch, setGlossaryModalTermId } = useDriftspaceStore();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.found) {
        if (data.source === "glossary") {
          setGlossaryModalTermId(data.id);
        } else {
          if (data.contextNote) setContextNote(data.contextNote);
          if (data.source === "topic") router.push(`/topic/${data.slug}`);
          else if (data.source === "catalog") router.push(`/object/${data.id}`);
        }
      } else {
        setNotFoundSearch({
          query: data.query ?? searchQuery,
          type: data.type ?? "other",
          parentBody: data.parentBody,
          description: data.description ?? "",
          relatedSlugs: data.relatedSlugs ?? [],
          relatedCatalogIds: data.relatedCatalogIds ?? [],
        });
        router.push("/not-found-cosmos");
      }
    } finally {
      setSearching(false);
    }
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col" style={{ overflow: "hidden", background: "radial-gradient(ellipse at center, #0a1628 0%, #050510 60%, #000008 100%)" }}>
        <style>{`
          @keyframes nebulaDrift {
            from { transform: translate(0, 0) scale(1); }
            to { transform: translate(30px, 20px) scale(1.05); }
          }
        `}</style>

        {/* z-index 0: section background gradient (on the section itself) */}

        {/* z-index 1: starfield canvas — local/absolute, sits above the gradient */}
        <StarField />

        {/* z-index 2: nebula glow blobs */}
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "#1a4480", filter: "blur(80px)", opacity: 0.15, top: "-10%", left: "-5%", animation: "nebulaDrift 20s ease-in-out infinite alternate", zIndex: 2 }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#2d1b69", filter: "blur(80px)", opacity: 0.15, bottom: "5%", right: "-5%", animation: "nebulaDrift 25s ease-in-out infinite alternate-reverse", zIndex: 2 }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#0d3d2e", filter: "blur(80px)", opacity: 0.15, top: "30%", right: "15%", animation: "nebulaDrift 18s ease-in-out infinite alternate", zIndex: 2 }} />

        {/* z-index 3: Three.js planet, centered fullscreen */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          <HeroPlanet />
        </div>

        {/* z-index 4: bottom fade to page background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(5,5,16,0.98) 100%)", zIndex: 4 }} />

        {/* z-index 10: text content, search, buttons — centered */}
        <div className="relative flex flex-col items-center justify-center flex-1 text-center px-6" style={{ zIndex: 10, paddingTop: 96 }}>
          <div
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
            style={{ background: "rgba(100,255,218,0.08)", border: "1px solid rgba(100,255,218,0.2)", color: "#64ffda", fontFamily: "Inter" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
            AI-Powered Space Learning
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Driftspace"
            className="h-12 md:h-16 w-auto mb-6"
            style={{ mixBlendMode: "screen" }}
          />

          <h1
            className="font-light mb-4"
            style={{ fontFamily: "Space Grotesk", fontSize: "clamp(42px, 8vw, 82px)", letterSpacing: "-0.03em", lineHeight: 1.05, color: "#ffffff", maxWidth: 900 }}
          >
            Understand the<br />
            <span className="text-gradient-teal">Universe</span>
          </h1>

          <p className="mb-10 max-w-md" style={{ fontFamily: "Inter", fontSize: 20, color: "#8892b0", lineHeight: 1.6 }}>
            From your first question to the edge of spacetime.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8">
            <div
              className="flex items-center gap-3 p-2 pl-5 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" className="shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholder || "What are you curious about?"}
                className="flex-1 bg-transparent outline-none text-base"
                style={{ color: "#ffffff", fontFamily: "Inter", caretColor: "#64ffda" }}
              />
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm shrink-0 transition-all duration-300"
                style={{ background: searching ? "rgba(100,255,218,0.3)" : "#64ffda", color: "#050510", fontFamily: "Space Grotesk", boxShadow: "0 0 16px rgba(100,255,218,0.25)" }}
              >
                {searching ? <NebulaSpinner size={20} /> : "Search"}
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <a href="#roadmap" className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300" style={{ background: "#64ffda", color: "#050510", fontFamily: "Space Grotesk", boxShadow: "0 0 24px rgba(100,255,218,0.3)" }}>
              Start Learning →
            </a>
            <Link href="/begin" className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300" style={{ background: "transparent", color: "#64ffda", border: "1px solid rgba(100,255,218,0.3)", fontFamily: "Space Grotesk" }}>
              I&apos;m a complete beginner
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center pb-10" style={{ zIndex: 10 }}>
          <a href="#roadmap" className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter" }}>Discover more</span>
            <div style={{ animation: "drift 2s ease-in-out infinite" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </a>
        </div>
      </section>

      {/* ── ROADMAP ── */}
      <section id="roadmap" className="relative py-24 px-6" style={{ background: "linear-gradient(to bottom, #050510 0%, #06061a 50%, #050510 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(100,255,218,0.03) 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "#64ffda", fontFamily: "Inter" }}>Learning Roadmap</p>
            <h2 className="font-semibold mb-4" style={{ fontFamily: "Space Grotesk", fontSize: "clamp(30px, 5vw, 50px)", letterSpacing: "-0.02em", color: "#ffffff" }}>
              Your Path Through the Cosmos
            </h2>
            <p style={{ color: "#8892b0", fontFamily: "Inter", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
              Five pillars of space science. Click any node to preview — then dive in.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {PILLARS.map((pillar) => {
              const pillarTopics = getTopicsByPillar(pillar);
              const color = PILLAR_COLORS[pillar];
              return (
                <div key={pillar} className="flex flex-col items-center">
                  <div className="text-center mb-6">
                    <div className="text-2xl mb-2">{PILLAR_ICONS[pillar]}</div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "Space Grotesk", color }}>
                      {PILLAR_LABELS[pillar]}
                    </h3>
                  </div>
                  <div className="flex flex-col items-center">
                    {pillarTopics.map((topic, i) => (
                      <div key={topic.slug} className="flex flex-col items-center">
                        <ConstellationNode topic={topic} onClick={() => setDrawerSlug(topic.slug)} />
                        {i < pillarTopics.length - 1 && (
                          <div className="w-px my-1" style={{ height: 16, background: `linear-gradient(to bottom, ${color}50, ${color}15)` }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{ background: "rgba(100,255,218,0.05)", border: "1px solid rgba(100,255,218,0.18)", color: "#64ffda", fontFamily: "Space Grotesk" }}
            >
              Or explore freely in 2D space →
            </Link>
          </div>
        </div>
      </section>

      {drawerSlug && <RoadmapDrawer slug={drawerSlug} onClose={() => setDrawerSlug(null)} />}
    </>
  );
}
