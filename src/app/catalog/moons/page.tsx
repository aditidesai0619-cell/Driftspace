"use client";
import Link from "next/link";
import { getCatalogObjectsByType, TYPE_COLORS } from "@/lib/catalog";

const MOON_PARENTS = ["Jupiter", "Saturn", "Uranus", "Neptune", "Mars", "Pluto"];

const PARENT_FACTS: Record<string, { count: string; icon: string; color: string }> = {
  Jupiter: { count: "95 known moons", icon: "🪐", color: "#C88B3A" },
  Saturn: { count: "145 known moons", icon: "🪐", color: "#C4A45E" },
  Uranus: { count: "28 known moons", icon: "🔵", color: "#66cccc" },
  Neptune: { count: "16 known moons", icon: "🔵", color: "#003380" },
  Mars: { count: "2 moons", icon: "🔴", color: "#8B2500" },
  Pluto: { count: "5 moons", icon: "⬜", color: "#aa8866" },
};

// Earth's Moon radius in km (reference)
const MOON_REFERENCE_RADIUS = 1737;
const MOON_RADII: Record<string, number> = {
  ganymede: 2634,
  titan: 2575,
  callisto: 2410,
  io: 1822,
  europa: 1561,
  triton: 1353,
  titania: 789,
  charon: 606,
  miranda: 236,
  phobos: 11,
  deimos: 6,
  enceladus: 252,
};

export default function MoonsPage() {
  const allMoons = getCatalogObjectsByType("moon");
  const moonColor = TYPE_COLORS.moon;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64 }}>
      {/* ── HERO ── */}
      <section
        className="relative py-20 px-6 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(147,197,253,0.06) 0%, transparent 60%), #050510",
          borderBottom: "1px solid rgba(100,255,218,0.08)",
        }}
      >
        <div
          className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(147,197,253,0.08)",
            border: "1px solid rgba(147,197,253,0.25)",
            color: moonColor,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: moonColor }} />
          Moon Atlas
        </div>

        <h1
          className="font-semibold mb-4"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(36px, 6vw, 68px)",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          Moons of the Solar System
        </h1>
        <p
          className="max-w-lg mx-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            color: "#8892b0",
            lineHeight: 1.6,
          }}
        >
          From Io&apos;s volcanos to Enceladus&apos; geysers — the most fascinating moons we&apos;ve mapped
        </p>

        <div className="mt-6">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            ← Back to Full Catalog
          </Link>
        </div>
      </section>

      {/* ── GROUPS ── */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {MOON_PARENTS.map((parent) => {
          const moons = allMoons.filter(
            (m) => m.parentBody?.toLowerCase() === parent.toLowerCase()
          );
          if (moons.length === 0) return null;
          const parentMeta = PARENT_FACTS[parent];

          return (
            <section key={parent}>
              {/* Group header */}
              <div
                className="flex items-center gap-4 mb-6 pb-4"
                style={{ borderBottom: "1px solid rgba(100,255,218,0.08)" }}
              >
                <span className="text-3xl">{parentMeta.icon}</span>
                <div>
                  <h2
                    className="font-bold text-xl"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {parent}&apos;s Moons
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
                  >
                    {parent} has{" "}
                    <span style={{ color: parentMeta.color }}>{parentMeta.count}</span>
                    . We&apos;ve mapped the most fascinating ones.
                  </p>
                </div>
              </div>

              {/* Horizontal scroll row */}
              <div
                className="flex gap-4 overflow-x-auto pb-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(100,255,218,0.2) transparent" }}
              >
                {moons.map((moon) => {
                  const radius = MOON_RADII[moon.id] ?? 400;
                  const relativeSize = Math.min(1, radius / MOON_REFERENCE_RADIUS);
                  const barWidth = Math.max(0.08, relativeSize);
                  const tc = TYPE_COLORS.moon;

                  return (
                    <Link
                      key={moon.id}
                      href={`/object/${moon.id}`}
                      className="shrink-0 rounded-xl p-5 group"
                      style={{
                        width: 220,
                        background: "rgba(10,10,31,0.85)",
                        border: "1px solid rgba(147,197,253,0.12)",
                        boxShadow: "0 2px 8px rgba(5,5,16,0.5)",
                        transition: "border-color 250ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(147,197,253,0.35)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(147,197,253,0.12)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Mini sphere */}
                      <div
                        className="rounded-full mb-4 mx-auto"
                        style={{
                          width: 48,
                          height: 48,
                          background: `radial-gradient(circle at 35% 35%, ${moon.shaderPreset.color1}cc, ${moon.shaderPreset.color2}88, #050510)`,
                          boxShadow: `0 0 16px ${moon.shaderPreset.color1}40`,
                        }}
                      />

                      <h3
                        className="font-bold text-sm mb-1"
                        style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff" }}
                      >
                        {moon.name}
                      </h3>

                      {/* Size bar vs Earth's moon */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className="text-xs"
                            style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
                          >
                            Size vs Moon
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{ color: tc, fontFamily: "Inter, sans-serif" }}
                          >
                            {radius > MOON_REFERENCE_RADIUS
                              ? `${(radius / MOON_REFERENCE_RADIUS).toFixed(1)}×`
                              : `${Math.round(relativeSize * 100)}%`}
                          </span>
                        </div>
                        <div
                          className="w-full rounded-full overflow-hidden"
                          style={{ height: 4, background: "rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, barWidth * 100)}%`,
                              background: `linear-gradient(to right, ${tc}cc, ${tc}66)`,
                            }}
                          />
                        </div>
                      </div>

                      <p
                        className="text-xs leading-relaxed mb-3"
                        style={{
                          color: "#8892b0",
                          fontFamily: "Inter, sans-serif",
                          lineHeight: 1.65,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {moon.shortFact}
                      </p>

                      <span
                        className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        style={{ color: tc, fontFamily: "Inter, sans-serif", transition: "opacity 200ms ease" }}
                      >
                        Explore
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
