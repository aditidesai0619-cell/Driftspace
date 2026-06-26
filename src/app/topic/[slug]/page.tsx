"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getTopicBySlug, PILLAR_COLORS, PILLAR_LABELS } from "@/lib/topics";
import type { Topic } from "@/lib/topics";
import { useDriftspaceStore } from "@/lib/store";
import type { TopicBriefing } from "@/lib/store";
import TopicChat from "@/components/TopicChat";
import SkeletonBriefing from "@/components/ui/SkeletonBriefing";
import { linkGlossaryTerms } from "@/lib/linkGlossaryTerms";

// Lazy load heavy components
const HeroPlanet = dynamic(() => import("@/components/ui/HeroPlanet"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(10,10,40,0.5) 0%, transparent 70%)" }} />
  ),
});
const ObservatoryGlobe = dynamic(() => import("@/components/ObservatoryGlobe"), { ssr: false });

// Diagrams
const HRDiagram = dynamic(() => import("@/components/diagrams/HRDiagram"), { ssr: false });
const AccretionDisk = dynamic(() => import("@/components/diagrams/AccretionDisk"), { ssr: false });
const OrbitalPaths = dynamic(() => import("@/components/diagrams/OrbitalPaths"), { ssr: false });
const GalaxyZoom = dynamic(() => import("@/components/diagrams/GalaxyZoom"), { ssr: false });
const BigBangTimeline = dynamic(() => import("@/components/diagrams/BigBangTimeline"), { ssr: false });

function DiagramSection({ topic }: { topic: Topic }) {
  const diagrams: Record<string, React.ReactNode> = {
    "hr-diagram": <HRDiagram topicSlug={topic.slug} />,
    "accretion-disk": <AccretionDisk />,
    "orbital": <OrbitalPaths highlightSlug={topic.slug} />,
    "galaxy-zoom": <GalaxyZoom />,
    "big-bang-timeline": <BigBangTimeline />,
  };

  const captions: Record<string, string> = {
    "hr-diagram": "The Hertzsprung–Russell diagram plots stars by luminosity vs. temperature. Watch the animated trail trace this star's evolution through the main sequence.",
    "accretion-disk": "Matter spiraling into a black hole heats to millions of degrees. The innermost ring glows white-hot; relativistic jets shoot perpendicular to the disk.",
    "orbital": "Planetary orbits to scale, with speeds proportional to actual velocities. Inner planets orbit faster due to stronger gravitational pull.",
    "galaxy-zoom": "Zoom out from Earth through increasingly vast cosmic scales. Click the buttons to navigate each level of the cosmic hierarchy.",
    "big-bang-timeline": "The universe's 13.8-billion-year history, from the Planck Epoch to today. Each era marks a fundamental change in how matter and energy behaved.",
  };

  return (
    <div>
      <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#64ffda", fontFamily: "Inter" }}>
        Visualizing the physics
      </p>
      {diagrams[topic.diagramType] ?? <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#8892b0" }}>Diagram loading…</div>}
      <p className="mt-3 text-sm" style={{ color: "#8892b0", fontFamily: "Inter", lineHeight: 1.7 }}>
        {captions[topic.diagramType]}
      </p>
    </div>
  );
}

function RelatedTopicCard({ slug }: { slug: string }) {
  const router = useRouter();
  const topic = getTopicBySlug(slug);
  if (!topic) return null;
  const color = PILLAR_COLORS[topic.pillar];

  return (
    <Link
      href={`/topic/${slug}`}
      className="topic-card block rounded-xl p-5 transition-all duration-400"
      style={{ background: "rgba(10,10,31,0.8)", border: "1px solid rgba(100,255,218,0.1)" }}
      onMouseEnter={() => router.prefetch(`/topic/${slug}`)}
    >
      <div className="mb-3 text-2xl">{topic.icon}</div>
      <p className="text-xs mb-1 font-medium" style={{ color, fontFamily: "Inter" }}>
        {PILLAR_LABELS[topic.pillar]}
      </p>
      <h3 className="font-semibold mb-2 text-sm" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>
        {topic.name}
      </h3>
      <p className="text-xs" style={{ color: "#8892b0" }}>~{topic.estimatedMinutes} min</p>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: "#64ffda", fontFamily: "Inter" }}>
        Explore
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
      </div>
    </Link>
  );
}

export default function TopicPage() {
  const { slug } = useParams<{ slug: string }>();
  const topic = getTopicBySlug(slug);
  const { briefings, setBriefing, nerdLevel, contextNote, setContextNote } = useDriftspaceStore();

  // Clear contextNote after mount so it doesn't persist across navigations
  useEffect(() => {
    return () => { setContextNote(null); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);
  const [briefing, setBriefingLocal] = useState<TopicBriefing | null>(briefings[slug] ?? null);
  const [loading, setLoading] = useState(!briefings[slug]);
  const [error, setError] = useState<string | null>(null);
  const [streamChars, setStreamChars] = useState(0);

  useEffect(() => {
    if (!topic) return;
    if (briefings[slug]) {
      setBriefingLocal(briefings[slug]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setStreamChars(0);
    fetch("/api/ai/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, topicName: topic.name, nerdLevel }),
    })
      .then(async (r) => {
        const ct = r.headers.get("Content-Type") ?? "";
        if (ct.includes("application/json")) {
          return r.json();
        }
        // Streaming response — read chunks and accumulate
        const reader = r.body!.getReader();
        const decoder = new TextDecoder();
        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setStreamChars(text.length);
        }
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid stream response");
        return JSON.parse(jsonMatch[0]);
      })
      .then((data) => {
        setBriefing(slug, data);
        setBriefingLocal(data);
        setLoading(false);
        setStreamChars(0);
      })
      .catch(() => {
        setError("The signal was lost in interstellar space. Try refreshing.");
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, nerdLevel]);

  if (!topic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ paddingTop: 80 }}>
        <div className="text-6xl mb-4">🌑</div>
        <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: "Space Grotesk", color: "#fff" }}>Topic not found</h1>
        <p style={{ color: "#8892b0", fontFamily: "Inter" }}>
          The cosmos is vast — we couldn&apos;t find that. Try searching for &apos;black holes&apos; or &apos;dark matter&apos;.
        </p>
        <Link href="/" className="mt-6 text-sm underline" style={{ color: "#64ffda" }}>← Back to home</Link>
      </div>
    );
  }

  const pillarColor = PILLAR_COLORS[topic.pillar];
  const difficultyColors: Record<string, string> = {
    beginner: "#4ade80",
    intermediate: "#fbbf24",
    advanced: "#f87171",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── SECTION A: Visual Header ── */}
      <section className="relative" style={{ height: "min(70vh, 560px)", overflow: "hidden", background: "radial-gradient(ellipse at center, #0a0a20 0%, #050510 100%)" }}>
        <HeroPlanet
          primaryColor={topic.shaderPreset.color1}
          accentColor={topic.shaderPreset.color2}
          size={500}
          opacity={0.9}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(5,5,16,0.2) 0%, rgba(5,5,16,0.4) 50%, rgba(5,5,16,1) 100%)" }}
        />
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center" style={{ zIndex: 2 }}>
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
          <nav className="mb-4 flex items-center gap-2 text-sm" style={{ color: "#8892b0", fontFamily: "Inter" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: pillarColor }}>{PILLAR_LABELS[topic.pillar]}</span>
            <span>/</span>
            <span style={{ color: "#fff" }}>{topic.name}</span>
          </nav>
          <h1
            className="font-semibold mb-4"
            style={{ fontFamily: "Space Grotesk", fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.05 }}
          >
            {topic.name}
          </h1>
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: `${difficultyColors[topic.difficulty]}18`, color: difficultyColors[topic.difficulty], border: `1px solid ${difficultyColors[topic.difficulty]}40` }}
            >
              {topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
            </span>
            <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter" }}>~{topic.estimatedMinutes} min read</span>
            {nerdLevel && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(123,47,255,0.15)", color: "#b57bee", border: "1px solid rgba(123,47,255,0.3)" }}>
                🧪 Nerd Mode
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* ── SECTION B: AI Briefing ── */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase mb-6" style={{ color: "#64ffda", fontFamily: "Inter" }}>
            The AI Briefing
          </p>

          {loading && (
            <SkeletonBriefing streaming={streamChars > 0} streamChars={streamChars} />
          )}

          {error && (
            <div className="rounded-xl p-6 text-center" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
              <p style={{ color: "#f87171" }}>{error}</p>
            </div>
          )}

          {briefing && (
            <div className="space-y-10">
              {/* One-liner */}
              <p
                className="italic text-xl leading-relaxed"
                style={{ color: "#64ffda", fontFamily: "Space Grotesk", fontWeight: 300, letterSpacing: "-0.01em", borderLeft: "2px solid rgba(100,255,218,0.3)", paddingLeft: 20 }}
              >
                &ldquo;{briefing.oneLiner}&rdquo;
              </p>

              {/* Physics explained */}
              <div
                className="text-base leading-relaxed"
                style={{ color: "#cbd5e1", fontFamily: "Inter", lineHeight: 1.85, whiteSpace: "pre-line" }}
              >
                {linkGlossaryTerms(briefing.physicsExplained ?? "")}
              </div>

              {/* Key stats */}
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "Space Grotesk", color: "#8892b0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Key Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {briefing.keyStats?.map((stat, i) => (
                    <div key={i} className="metric-card text-center">
                      <p className="text-xl font-bold mb-1" style={{ fontFamily: "Space Grotesk", color: "#64ffda" }}>
                        {stat.value}
                      </p>
                      <p className="text-xs mb-0.5" style={{ color: "#8892b0", fontFamily: "Inter" }}>{stat.unit}</p>
                      <p className="text-xs font-medium" style={{ color: "#fff", fontFamily: "Inter" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unsolved mystery */}
              <div
                className="rounded-xl p-6"
                style={{ background: "rgba(123,47,255,0.06)", border: "1px solid rgba(123,47,255,0.2)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🔬</span>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#b57bee", fontFamily: "Inter" }}>
                    Open Question
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0", fontFamily: "Inter", lineHeight: 1.8 }}>
                  {linkGlossaryTerms(briefing.unsolvedMystery ?? "")}
                </p>
              </div>

              {/* Real missions */}
              <div>
                <h3 className="text-sm font-semibold mb-4" style={{ fontFamily: "Space Grotesk", color: "#8892b0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Real Missions
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {briefing.realMissions?.map((mission, i) => (
                    <div
                      key={i}
                      className="shrink-0 rounded-xl p-4"
                      style={{
                        width: 220,
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(100,255,218,0.1)",
                        borderLeft: `3px solid ${pillarColor}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold" style={{ color: "#fff", fontFamily: "Space Grotesk" }}>{mission.name}</span>
                        <span className="text-xs" style={{ color: pillarColor }}>{mission.year}</span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: "#8892b0", fontFamily: "Inter" }}>{mission.agency}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "#cbd5e1", fontFamily: "Inter", lineHeight: 1.6 }}>
                        {mission.finding}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── SECTION C: Animated Diagram ── */}
        <section>
          <DiagramSection topic={topic} />
        </section>

        {/* ── SECTION D: Observatory Globe ── */}
        {topic.observatoryContributions.length > 0 && (
          <section>
            <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#64ffda", fontFamily: "Inter" }}>
              Where on Earth this was discovered
            </p>
            <p className="text-sm mb-6" style={{ color: "#8892b0", fontFamily: "Inter" }}>
              Hover over the arcs to see which observatory contributed to our understanding of {topic.name}.
            </p>
            <ObservatoryGlobe contributions={topic.observatoryContributions} topicName={topic.name} />
          </section>
        )}

        {/* ── SECTION F: Go Deeper ── */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: "#64ffda", fontFamily: "Inter" }}>
            Go Deeper
          </p>
          <h2 className="text-2xl font-semibold mb-8" style={{ fontFamily: "Space Grotesk", color: "#fff", letterSpacing: "-0.02em" }}>
            Where would you like to go next?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topic.relatedSlugs.slice(0, 3).map((s) => (
              <RelatedTopicCard key={s} slug={s} />
            ))}
          </div>
        </section>
      </div>

      {/* ── SECTION E: Chat Panel ── */}
      <TopicChat topicName={topic.name} topicSlug={topic.slug} />
    </div>
  );
}
