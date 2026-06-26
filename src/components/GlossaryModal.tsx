"use client";
import Link from "next/link";
import { useEffect } from "react";
import {
  getGlossaryTermById,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  DIFFICULTY_COLORS,
} from "@/lib/glossary";
import { getTopicBySlug, PILLAR_COLORS } from "@/lib/topics";
import { getCatalogObjectById, TYPE_COLORS } from "@/lib/catalog";
import { useDriftspaceStore } from "@/lib/store";
import TopicChat from "@/components/TopicChat";

export default function GlossaryModal() {
  const {
    glossaryModalTermId,
    setGlossaryModalTermId,
    glossaryChatActive,
    setGlossaryChatActive,
  } = useDriftspaceStore();

  const term = glossaryModalTermId ? getGlossaryTermById(glossaryModalTermId) : null;

  useEffect(() => {
    if (term) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [term]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setGlossaryModalTermId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setGlossaryModalTermId]);

  const chatTerm = glossaryChatActive ? getGlossaryTermById(glossaryChatActive) : null;

  return (
    <>
      {term && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6"
          style={{
            background: "rgba(5,5,16,0.85)",
            backdropFilter: "blur(12px)",
            animation: "fadeIn 200ms ease",
          }}
          onClick={(e) => e.target === e.currentTarget && setGlossaryModalTermId(null)}
        >
          <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUpModal { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
          `}</style>
          <div
            className="w-full sm:max-w-2xl sm:rounded-2xl overflow-y-auto"
            style={{
              background: "rgba(10,10,31,0.98)",
              border: "1px solid rgba(100,255,218,0.15)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              height: "100%",
              maxHeight: "100vh",
              animation: "slideUpModal 280ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <GlossaryModalContent
              termId={term.id}
              onClose={() => setGlossaryModalTermId(null)}
              onNavigate={(id) => setGlossaryModalTermId(id)}
              onAskAI={() => {
                setGlossaryModalTermId(null);
                setGlossaryChatActive(term.id);
              }}
            />
          </div>
        </div>
      )}

      {chatTerm && (
        <TopicChat
          topicName={chatTerm.term}
          topicSlug={`glossary-${chatTerm.id}`}
          position="left"
          autoOpen
          autoPrompt={`Explain ${chatTerm.term} to me in detail`}
        />
      )}
    </>
  );
}

function GlossaryModalContent({
  termId,
  onClose,
  onNavigate,
  onAskAI,
}: {
  termId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onAskAI: () => void;
}) {
  const term = getGlossaryTermById(termId);
  if (!term) return null;

  const catColor = CATEGORY_COLORS[term.category];
  const diffColor = DIFFICULTY_COLORS[term.difficulty];

  const contextTopics = term.appearsIn
    .map((slug) => getTopicBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => !!t);
  const contextCatalog = term.appearsIn
    .map((id) => getCatalogObjectById(id))
    .filter((o): o is NonNullable<typeof o> => !!o);

  const exampleParts = term.exampleUsage.split(new RegExp(`(${term.term})`, "i"));

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: `${catColor}18`, color: catColor, border: `1px solid ${catColor}40` }}
          >
            {CATEGORY_LABELS[term.category]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "#8892b0" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: diffColor }} />
            {term.difficulty}
          </span>
          {term.aiGenerated && (
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(123,47,255,0.15)", color: "#b57bee", border: "1px solid rgba(123,47,255,0.3)" }}>
              ✦ AI Generated
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg"
          style={{ color: "#8892b0" }}
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <h2
        className="font-semibold mb-8"
        style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(28px, 5vw, 40px)", color: "#fff", letterSpacing: "-0.02em" }}
      >
        {term.term}
      </h2>

      <div className="space-y-8">
        {/* Simply put */}
        <section>
          <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: catColor }}>
            Simply put
          </p>
          <p
            className="italic leading-relaxed"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 300, fontSize: 22, color: "#fff", letterSpacing: "-0.01em" }}
          >
            &ldquo;{term.oneLiner}&rdquo;
          </p>
        </section>

        {/* Analogy */}
        <section
          className="rounded-xl p-5"
          style={{ background: `${catColor}0a`, borderLeft: `3px solid ${catColor}` }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: catColor }}>
            Think of it like this
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0", lineHeight: 1.7 }}>
            {term.analogy}
          </p>
        </section>

        {/* Deep dive */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8892b0" }}>
            The real physics
          </p>
          <div className="space-y-3">
            {term.deepDive.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed" style={{ color: "#cbd5e1", lineHeight: 1.85 }}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Example usage */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8892b0" }}>
            Hear it used
          </p>
          <p className="text-sm leading-relaxed italic" style={{ color: "#cbd5e1" }}>
            {exampleParts.map((part, i) =>
              part.toLowerCase() === term.term.toLowerCase() ? (
                <span key={i} style={{ color: catColor, fontWeight: 500 }}>
                  {part}
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </section>

        {/* Related terms */}
        {term.relatedTerms.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8892b0" }}>
              Related terms
            </p>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((rid) => {
                const r = getGlossaryTermById(rid);
                if (!r) return null;
                const rc = CATEGORY_COLORS[r.category];
                return (
                  <button
                    key={rid}
                    onClick={() => onNavigate(rid)}
                    className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors duration-150"
                    style={{ background: `${rc}14`, color: rc, border: `1px solid ${rc}35` }}
                  >
                    {r.term}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* See it in context */}
        {(contextTopics.length > 0 || contextCatalog.length > 0) && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#8892b0" }}>
              See it in context
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {contextTopics.map((t) => (
                <Link
                  key={t.slug}
                  href={`/topic/${t.slug}`}
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-3 flex items-center gap-3"
                  style={{ width: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,255,218,0.1)" }}
                >
                  <div
                    className="rounded-full shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      background: `radial-gradient(circle at 35% 35%, ${t.shaderPreset.color1}cc, ${t.shaderPreset.color2}88, #050510)`,
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold truncate" style={{ color: "#fff" }}>{t.name}</p>
                    <p className="text-xs truncate" style={{ color: PILLAR_COLORS[t.pillar] }}>Topic</p>
                  </div>
                </Link>
              ))}
              {contextCatalog.map((o) => (
                <Link
                  key={o.id}
                  href={`/object/${o.id}`}
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-3 flex items-center gap-3"
                  style={{ width: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(100,255,218,0.1)" }}
                >
                  <div
                    className="rounded-full shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      background: `radial-gradient(circle at 35% 35%, ${o.shaderPreset.color1}cc, ${o.shaderPreset.color2}88, #050510)`,
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold truncate" style={{ color: "#fff" }}>{o.name}</p>
                    <p className="text-xs truncate" style={{ color: TYPE_COLORS[o.type] }}>Atlas</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Ask AI */}
        <div className="pt-2">
          <button
            onClick={onAskAI}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-transform duration-200"
            style={{
              background: "#64ffda",
              color: "#050510",
              fontFamily: "Space Grotesk, sans-serif",
              boxShadow: "0 0 24px rgba(100,255,218,0.3)",
            }}
          >
            Ask AI about {term.term}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
