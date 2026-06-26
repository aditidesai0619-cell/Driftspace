"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  glossaryTerms,
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  DIFFICULTY_COLORS,
  type GlossaryCategory,
  type GlossaryDifficulty,
} from "@/lib/glossary";
import { useDriftspaceStore } from "@/lib/store";

type SortOption = "name" | "category" | "difficulty";
const DIFFICULTY_ORDER: GlossaryDifficulty[] = ["beginner", "intermediate", "advanced"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");
  const [activeDifficulty, setActiveDifficulty] = useState<GlossaryDifficulty | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const setGlossaryModalTermId = useDriftspaceStore((s) => s.setGlossaryModalTermId);

  const filtered = useMemo(() => {
    let items = glossaryTerms;
    if (activeCategory !== "all") items = items.filter((t) => t.category === activeCategory);
    if (activeDifficulty !== "all") items = items.filter((t) => t.difficulty === activeDifficulty);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.oneLiner.toLowerCase().includes(q) ||
          t.deepDive.toLowerCase().includes(q)
      );
    }
    items = [...items].sort((a, b) => {
      if (sortBy === "name") return a.term.localeCompare(b.term);
      if (sortBy === "category") return a.category.localeCompare(b.category) || a.term.localeCompare(b.term);
      return DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty) || a.term.localeCompare(b.term);
    });
    return items;
  }, [activeCategory, activeDifficulty, sortBy, searchQuery]);

  const availableLetters = useMemo(() => {
    const s = new Set<string>();
    for (const t of filtered) s.add(t.term[0].toUpperCase());
    return s;
  }, [filtered]);

  function jumpToLetter(letter: string) {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let lastLetter = "";

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64 }}>
      {/* ── HERO ── */}
      <section
        className="relative py-20 px-6 text-center"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.04) 0%, transparent 60%), #050510",
          borderBottom: "1px solid rgba(100,255,218,0.08)",
        }}
      >
        <div
          className="mb-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(100,255,218,0.08)",
            border: "1px solid rgba(100,255,218,0.2)",
            color: "#64ffda",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
          {glossaryTerms.length} terms · {ALL_CATEGORIES.length} categories · beginner to expert
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
          Space Vocabulary
        </h1>
        <p className="mb-8 max-w-lg mx-auto" style={{ fontFamily: "Inter, sans-serif", fontSize: 18, color: "#8892b0", lineHeight: 1.6 }}>
          Every term explained simply, then deeply
        </p>

        <div className="flex items-center gap-3 max-w-lg mx-auto p-2 pl-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms or definitions…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#ffffff", fontFamily: "Inter, sans-serif", caretColor: "#64ffda" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs px-2 py-1 rounded-lg" style={{ color: "#8892b0", background: "rgba(255,255,255,0.05)" }}>
              ✕
            </button>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/glossary/explore"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            ✦ Try Explore Mode — terms drifting through space
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div
        className="sticky top-16 z-10 px-6 py-3"
        style={{ background: "rgba(5,5,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(100,255,218,0.06)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: activeCategory === "all" ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.04)",
                border: activeCategory === "all" ? "1px solid rgba(100,255,218,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: activeCategory === "all" ? "#64ffda" : "#8892b0",
              }}
            >
              All
            </button>
            {ALL_CATEGORIES.map((c) => {
              const cc = CATEGORY_COLORS[c];
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: active ? `${cc}18` : "rgba(255,255,255,0.04)",
                    border: active ? `1px solid ${cc}45` : "1px solid rgba(255,255,255,0.08)",
                    color: active ? cc : "#8892b0",
                  }}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-xs shrink-0" style={{ color: "#8892b0" }}>Difficulty:</span>
            {(["all", ...DIFFICULTY_ORDER] as const).map((d) => (
              <button
                key={d}
                onClick={() => setActiveDifficulty(d)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                style={{
                  background: activeDifficulty === d ? "rgba(100,255,218,0.1)" : "transparent",
                  color: activeDifficulty === d ? "#64ffda" : "#8892b0",
                }}
              >
                {d !== "all" && <span className="w-1.5 h-1.5 rounded-full" style={{ background: DIFFICULTY_COLORS[d] }} />}
                {d === "all" ? "All" : d}
              </button>
            ))}

            <span className="shrink-0 ml-auto text-xs" style={{ color: "#8892b0" }}>Sort:</span>
            {(["name", "category", "difficulty"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className="shrink-0 text-xs px-2.5 py-1 rounded-lg"
                style={{ background: sortBy === s ? "rgba(100,255,218,0.12)" : "transparent", color: sortBy === s ? "#64ffda" : "#8892b0" }}
              >
                {s === "name" ? "A–Z" : s === "category" ? "Category" : "Difficulty"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY: alphabet bar + grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-6">
        {sortBy === "name" && (
          <div className="hidden lg:flex flex-col gap-1 sticky shrink-0" style={{ top: 180, height: "fit-content" }}>
            {ALPHABET.map((letter) => {
              const enabled = availableLetters.has(letter);
              return (
                <button
                  key={letter}
                  disabled={!enabled}
                  onClick={() => jumpToLetter(letter)}
                  className="text-xs w-6 h-6 flex items-center justify-center rounded"
                  style={{ color: enabled ? "#64ffda" : "rgba(136,146,176,0.3)", cursor: enabled ? "pointer" : "default" }}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-4xl mb-4">🌑</div>
              <p style={{ color: "#8892b0" }}>No terms match your filter. Try a different search.</p>
            </div>
          ) : (
            <>
              <p className="text-xs mb-6" style={{ color: "#8892b0" }}>
                Showing {filtered.length} term{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((t) => {
                  const firstLetter = t.term[0].toUpperCase();
                  const showAnchor = sortBy === "name" && firstLetter !== lastLetter;
                  if (showAnchor) lastLetter = firstLetter;
                  return (
                    <div key={t.id} className="relative">
                      {showAnchor && (
                        <div id={`letter-${firstLetter}`} className="absolute -top-4" />
                      )}
                      <TermCard term={t} onOpen={() => setGlossaryModalTermId(t.id)} />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TermCard({ term, onOpen }: { term: (typeof glossaryTerms)[number]; onOpen: () => void }) {
  const catColor = CATEGORY_COLORS[term.category];
  const diffColor = DIFFICULTY_COLORS[term.difficulty];
  return (
    <button
      onClick={onOpen}
      className="text-left group block w-full rounded-xl p-5"
      style={{
        background: "rgba(10,10,31,0.85)",
        border: "1px solid rgba(100,255,218,0.1)",
        boxShadow: "0 2px 8px rgba(5,5,16,0.5), 0 8px 32px rgba(5,5,16,0.35)",
        transition: "border-color 250ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${catColor}50`;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(100,255,218,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}35` }}>
          {CATEGORY_LABELS[term.category]}
        </span>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: diffColor }} title={term.difficulty} />
      </div>

      <h3 className="font-bold text-base mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", letterSpacing: "-0.01em" }}>
        {term.term}
      </h3>

      <p
        className="text-xs leading-relaxed mb-4"
        style={{
          color: "#8892b0",
          lineHeight: 1.7,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {term.oneLiner}
      </p>

      <span
        className="text-xs font-medium flex items-center gap-1 opacity-70 group-hover:opacity-100"
        style={{ color: catColor, transition: "opacity 200ms ease" }}
      >
        Go deeper
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
