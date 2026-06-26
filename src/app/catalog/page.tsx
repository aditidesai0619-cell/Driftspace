"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  catalogObjects,
  TYPE_COLORS,
  TYPE_LABELS,
  type CatalogObjectType,
} from "@/lib/catalog";

const ALL_TYPES: CatalogObjectType[] = [
  "star",
  "moon",
  "planet",
  "dwarf-planet",
  "nebula",
  "galaxy",
  "asteroid",
  "comet",
  "exoplanet",
  "spacecraft",
];

type SortOption = "name" | "distance" | "year";

function CatalogCard({ obj }: { obj: (typeof catalogObjects)[number] }) {
  const router = useRouter();
  const typeColor = TYPE_COLORS[obj.type];
  return (
    <Link
      href={`/object/${obj.id}`}
      className="group block rounded-xl p-5"
      style={{
        background: "rgba(10,10,31,0.85)",
        border: "1px solid rgba(100,255,218,0.1)",
        boxShadow: "0 2px 8px rgba(5,5,16,0.5), 0 8px 32px rgba(5,5,16,0.35)",
        transition: "border-color 250ms ease, transform 250ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 250ms ease",
      }}
      onMouseEnter={(e) => {
        router.prefetch(`/object/${obj.id}`);
        e.currentTarget.style.borderColor = `${typeColor}50`;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 4px 16px ${typeColor}18, 0 12px 40px rgba(5,5,16,0.5)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(100,255,218,0.1)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(5,5,16,0.5), 0 8px 32px rgba(5,5,16,0.35)";
      }}
    >
      {/* Shader thumbnail — CSS gradient approximation for performance */}
      <div
        className="w-16 h-16 rounded-full mb-4 shrink-0"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${obj.shaderPreset.color1}cc 0%, ${obj.shaderPreset.color2}88 50%, #050510 100%)`,
          boxShadow: `0 0 20px ${obj.shaderPreset.color1}40, inset 0 0 12px ${obj.shaderPreset.color2}30`,
        }}
      />

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: `${typeColor}18`,
            color: typeColor,
            border: `1px solid ${typeColor}35`,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {TYPE_LABELS[obj.type]}
        </span>
        {obj.parentBody && (
          <span
            className="text-xs"
            style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
          >
            of {obj.parentBody}
          </span>
        )}
      </div>

      {/* Name */}
      <h3
        className="font-bold text-base mb-2 leading-tight"
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          color: "#ffffff",
          letterSpacing: "-0.01em",
        }}
      >
        {obj.name}
      </h3>

      {/* Short fact */}
      <p
        className="text-xs leading-relaxed mb-4"
        style={{
          color: "#8892b0",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1.7,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {obj.shortFact}
      </p>

      {/* Distance */}
      <div
        className="flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(100,255,218,0.06)", paddingTop: 12 }}
      >
        <span
          className="text-xs"
          style={{ color: "#64ffda", fontFamily: "Inter, sans-serif", opacity: 0.8 }}
        >
          {obj.distanceFromEarth}
        </span>
        <span
          className="text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100"
          style={{ color: "#64ffda", fontFamily: "Inter, sans-serif", transition: "opacity 200ms ease" }}
        >
          Learn more
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function CatalogPage() {
  const [activeType, setActiveType] = useState<CatalogObjectType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let items = catalogObjects;
    if (activeType !== "all") items = items.filter((o) => o.type === activeType);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.shortFact.toLowerCase().includes(q) ||
          o.tags.some((t) => t.includes(q)) ||
          (o.parentBody?.toLowerCase().includes(q) ?? false)
      );
    }
    if (sortBy === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "year")
      items = [...items].sort((a, b) => (a.discoveredYear ?? 9999) - (b.discoveredYear ?? 9999));
    return items;
  }, [activeType, sortBy, searchQuery]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: catalogObjects.length };
    for (const t of ALL_TYPES) m[t] = catalogObjects.filter((o) => o.type === t).length;
    return m;
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64 }}>
      {/* ── HERO ── */}
      <section
        className="relative py-20 px-6 text-center"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(100,255,218,0.04) 0%, transparent 60%), #050510",
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
          {catalogObjects.length} objects catalogued
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
          The Cosmic Atlas
        </h1>
        <p
          className="mb-8 max-w-lg mx-auto"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            color: "#8892b0",
            lineHeight: 1.6,
          }}
        >
          Every world, star, and wonder we know of
        </p>

        {/* Search */}
        <div className="flex items-center gap-3 max-w-lg mx-auto p-2 pl-5 rounded-2xl" style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64ffda" strokeWidth="2" className="shrink-0">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by name, tag, or parent body…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#ffffff", fontFamily: "Inter, sans-serif", caretColor: "#64ffda" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ color: "#8892b0", background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Moon atlas link */}
        <div className="mt-6">
          <Link
            href="/catalog/moons"
            className="inline-flex items-center gap-2 text-sm font-medium"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            🌙 Open the Moon Atlas
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── FILTER + SORT BAR ── */}
      <div
        className="sticky top-16 z-10 px-6 py-3"
        style={{
          background: "rgba(5,5,16,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(100,255,218,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1">
          <div className="flex items-center gap-2 shrink-0 flex-1 overflow-x-auto">
            {/* All pill */}
            <button
              onClick={() => setActiveType("all")}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: activeType === "all" ? "rgba(100,255,218,0.15)" : "rgba(255,255,255,0.04)",
                border: activeType === "all" ? "1px solid rgba(100,255,218,0.4)" : "1px solid rgba(255,255,255,0.08)",
                color: activeType === "all" ? "#64ffda" : "#8892b0",
                fontFamily: "Inter, sans-serif",
                transition: "background 200ms ease, color 200ms ease",
              }}
            >
              All ({counts.all})
            </button>
            {ALL_TYPES.map((t) => {
              const tc = TYPE_COLORS[t];
              const active = activeType === t;
              return (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: active ? `${tc}18` : "rgba(255,255,255,0.04)",
                    border: active ? `1px solid ${tc}45` : "1px solid rgba(255,255,255,0.08)",
                    color: active ? tc : "#8892b0",
                    fontFamily: "Inter, sans-serif",
                    transition: "background 200ms ease, color 200ms ease",
                  }}
                >
                  {TYPE_LABELS[t]} ({counts[t] ?? 0})
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="shrink-0 flex items-center gap-2 ml-auto">
            <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>Sort:</span>
            {(["name", "year"] as SortOption[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{
                  background: sortBy === s ? "rgba(100,255,218,0.12)" : "transparent",
                  color: sortBy === s ? "#64ffda" : "#8892b0",
                  fontFamily: "Inter, sans-serif",
                  transition: "background 150ms ease, color 150ms ease",
                }}
              >
                {s === "name" ? "A–Z" : "Discovery Year"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4">🌑</div>
            <p style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
              No objects match your filter. Try a different search.
            </p>
          </div>
        ) : (
          <>
            <p
              className="text-xs mb-6"
              style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
            >
              Showing {filtered.length} object{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((obj) => (
                <CatalogCard key={obj.id} obj={obj} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
