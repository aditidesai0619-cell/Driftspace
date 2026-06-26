"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { glossaryTerms, CATEGORY_COLORS, type GlossaryTerm } from "@/lib/glossary";
import { useDriftspaceStore } from "@/lib/store";

interface FloatTerm {
  term: GlossaryTerm;
  topPct: number;
  leftPct: number;
  dx: number[];
  dy: number[];
  duration: number;
  fontSize: number;
}

const DIFFICULTY_SIZE: Record<string, number> = {
  beginner: 13,
  intermediate: 17,
  advanced: 22,
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function GlossaryExplorePage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const setGlossaryModalTermId = useDriftspaceStore((s) => s.setGlossaryModalTermId);

  useEffect(() => setMounted(true), []);

  const floatTerms: FloatTerm[] = useMemo(() => {
    const rand = seededRandom(42);
    return glossaryTerms.map((term, i) => {
      const fontSize = DIFFICULTY_SIZE[term.difficulty] ?? 16;
      return {
        term,
        topPct: 8 + rand() * 80,
        leftPct: 6 + rand() * 84,
        dx: [0, (rand() - 0.5) * 120, (rand() - 0.5) * 120, 0],
        dy: [0, (rand() - 0.5) * 100, (rand() - 0.5) * 100, 0],
        duration: 15 + (i % 26),
        fontSize,
      };
    });
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const updateLines = useCallback(() => {
    if (!hoveredId || !containerRef.current) {
      setLines([]);
      rafRef.current = null;
      return;
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    const hoveredEl = nodeRefs.current[hoveredId];
    const hoveredTerm = glossaryTerms.find((t) => t.id === hoveredId);
    if (!hoveredEl || !hoveredTerm) {
      rafRef.current = requestAnimationFrame(updateLines);
      return;
    }
    const hRect = hoveredEl.getBoundingClientRect();
    const x1 = hRect.left + hRect.width / 2 - containerRect.left;
    const y1 = hRect.top + hRect.height / 2 - containerRect.top;
    const color = CATEGORY_COLORS[hoveredTerm.category];

    const newLines: typeof lines = [];
    for (const relId of hoveredTerm.relatedTerms) {
      const relEl = nodeRefs.current[relId];
      if (!relEl) continue;
      const rRect = relEl.getBoundingClientRect();
      newLines.push({
        x1,
        y1,
        x2: rRect.left + rRect.width / 2 - containerRect.left,
        y2: rRect.top + rRect.height / 2 - containerRect.top,
        color,
      });
    }
    setLines(newLines);
    rafRef.current = requestAnimationFrame(updateLines);
  }, [hoveredId]);

  useEffect(() => {
    if (hoveredId) {
      rafRef.current = requestAnimationFrame(updateLines);
    } else {
      setLines([]);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [hoveredId, updateLines]);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64 }}>
      <section className="px-6 pt-10 pb-6 text-center relative z-20">
        <div className="mb-4 flex items-center justify-center gap-3 flex-wrap">
          <h1 className="font-semibold" style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(28px, 4vw, 44px)", color: "#fff", letterSpacing: "-0.02em" }}>
            Drifting Through Vocabulary
          </h1>
        </div>
        <p className="mb-6" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
          Hover a term to pause it and see related concepts connect. Click to go deeper.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 max-w-md w-full p-2 pl-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" className="shrink-0">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search to highlight terms…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#ffffff", fontFamily: "Inter, sans-serif", caretColor: "#64ffda" }}
            />
          </div>
          <Link href="/glossary" className="text-sm font-medium" style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}>
            ← Grid View
          </Link>
        </div>
      </section>

      <div
        ref={containerRef}
        className="relative overflow-hidden mx-4 mb-10 rounded-2xl"
        style={{
          height: "70vh",
          minHeight: 480,
          background: "radial-gradient(ellipse at 50% 50%, rgba(100,255,218,0.03) 0%, transparent 60%), #050510",
          border: "1px solid rgba(100,255,218,0.08)",
        }}
      >
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", zIndex: 5 }}>
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth={1} strokeOpacity={0.5} strokeDasharray="4 4" />
          ))}
        </svg>

        {mounted &&
          floatTerms.map(({ term, topPct, leftPct, dx, dy, duration, fontSize }) => {
            const color = CATEGORY_COLORS[term.category];
            const matches = !query || term.term.toLowerCase().includes(query) || term.oneLiner.toLowerCase().includes(query);
            const isHovered = hoveredId === term.id;
            return (
              <motion.div
                key={term.id}
                ref={(el) => { nodeRefs.current[term.id] = el; }}
                className="absolute select-none"
                style={{ top: `${topPct}%`, left: `${leftPct}%`, zIndex: isHovered ? 20 : 10 }}
                animate={isHovered ? { x: 0, y: 0 } : { x: dx, y: dy }}
                transition={isHovered ? { duration: 0.3 } : { duration, repeat: Infinity, ease: "easeInOut" }}
              >
                <div
                  onMouseEnter={() => setHoveredId(term.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setGlossaryModalTermId(term.id)}
                  className="cursor-pointer whitespace-nowrap px-3 py-1.5 rounded-full"
                  style={{
                    fontSize,
                    fontFamily: "Space Grotesk, sans-serif",
                    fontWeight: 600,
                    color,
                    background: `${color}12`,
                    border: `1px solid ${color}${isHovered ? "80" : "30"}`,
                    boxShadow: isHovered ? `0 0 24px ${color}50` : `0 0 12px ${color}20`,
                    opacity: matches ? (isHovered ? 1 : 0.85) : 0.1,
                    transition: "opacity 300ms ease, border-color 200ms ease, box-shadow 200ms ease",
                  }}
                >
                  {term.term}
                  {isHovered && (
                    <div
                      className="absolute left-1/2 mt-2 px-3 py-2 rounded-lg text-left"
                      style={{
                        transform: "translateX(-50%)",
                        width: 220,
                        fontSize: 11,
                        fontWeight: 400,
                        background: "rgba(5,5,16,0.95)",
                        border: `1px solid ${color}40`,
                        color: "#cbd5e1",
                        lineHeight: 1.5,
                        whiteSpace: "normal",
                      }}
                    >
                      {term.oneLiner}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
