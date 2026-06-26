"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDriftspaceStore } from "@/lib/store";
import { topics } from "@/lib/topics";
import { ALL_CATALOG_NAMES } from "@/lib/catalog";
import { ALL_GLOSSARY_NAMES } from "@/lib/glossary";

const MAX_RESULTS_PER_SECTION = 4;

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    nerdLevel,
    toggleNerdLevel,
    setContextNote,
    setNotFoundSearch,
    setGlossaryModalTermId,
  } = useDriftspaceStore();

  const liveResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const topicMatches = topics
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS_PER_SECTION);
    const catalogMatches = ALL_CATALOG_NAMES
      .filter((o) => o.name.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS_PER_SECTION);
    const glossaryMatches = ALL_GLOSSARY_NAMES
      .filter((g) => g.term.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS_PER_SECTION);
    return { topicMatches, catalogMatches, glossaryMatches };
  }, [query]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      setMenuOpen(false);
    }
  }, [searchOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSearchOpen(false);
      setQuery("");

      if (data.found) {
        if (data.source === "glossary") {
          setGlossaryModalTermId(data.id);
        } else {
          if (data.contextNote) setContextNote(data.contextNote);
          if (data.source === "topic") {
            router.push(`/topic/${data.slug}`);
          } else if (data.source === "catalog") {
            router.push(`/object/${data.id}`);
          }
        }
      } else {
        setNotFoundSearch({
          query: data.query ?? query,
          type: data.type ?? "other",
          parentBody: data.parentBody,
          description: data.description ?? "",
          relatedSlugs: data.relatedSlugs ?? [],
          relatedCatalogIds: data.relatedCatalogIds ?? [],
        });
        router.push("/not-found-cosmos");
      }
    } catch {
      // silent
    } finally {
      setSearching(false);
    }
  }

  const links = [
    { href: "/explore", label: "Explore" },
    { href: "/#roadmap", label: "Roadmap" },
    { href: "/catalog", label: "Catalog" },
    { href: "/news", label: "News" },
    { href: "/glossary", label: "Glossary" },
    { href: "/begin", label: "Begin Here" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? "rgba(5,5,16,0.9)" : "rgba(5,5,16,0.3)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled
            ? "1px solid rgba(100,255,218,0.1)"
            : "1px solid transparent",
          transition: "background 400ms ease, border-color 400ms ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-xl tracking-tight flex items-center gap-2.5 shrink-0"
            style={{ color: "#ffffff" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Driftspace"
              style={{ height: 36, width: "auto", mixBlendMode: "screen" }}
            />
            <span style={{ fontFamily: "Cinzel, serif" }}>Driftspace</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium"
                style={{
                  color:
                    pathname === l.href ||
                    (l.href !== "/" && pathname.startsWith(l.href.split("?")[0].split("#")[0]) && l.href !== "/#roadmap")
                      ? "#64ffda"
                      : "#8892b0",
                  fontFamily: "Inter, sans-serif",
                  transition: "color 200ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#64ffda")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    pathname === l.href ||
                    (l.href !== "/" && pathname.startsWith(l.href.split("?")[0].split("#")[0]) && l.href !== "/#roadmap")
                      ? "#64ffda"
                      : "#8892b0")
                }
              >
                {l.label}
              </Link>
            ))}

            {/* Nerd level toggle */}
            <button
              onClick={toggleNerdLevel}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: nerdLevel
                  ? "rgba(123,47,255,0.2)"
                  : "rgba(255,255,255,0.05)",
                border: nerdLevel
                  ? "1px solid rgba(123,47,255,0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                color: nerdLevel ? "#b57bee" : "#8892b0",
                transition: "background 300ms ease, border-color 300ms ease, color 300ms ease",
              }}
              title="Toggle Nerd Level"
            >
              <span>🧪</span>
              <span>{nerdLevel ? "Nerd ON" : "Nerd OFF"}</span>
            </button>

            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg"
              style={{ color: "#8892b0", transition: "color 200ms ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#64ffda")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b0")}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>

          {/* Mobile right controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2"
              style={{ color: "#8892b0" }}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 flex flex-col gap-1.5 justify-center items-center"
              aria-label="Menu"
              style={{ color: "#8892b0" }}
            >
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: menuOpen ? "#64ffda" : "#8892b0",
                  borderRadius: 2,
                  transform: menuOpen ? "translateY(5px) rotate(45deg)" : "none",
                  transition: "transform 250ms ease, background 250ms ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: "#8892b0",
                  borderRadius: 2,
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 200ms ease",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: 20,
                  height: 2,
                  background: menuOpen ? "#64ffda" : "#8892b0",
                  borderRadius: 2,
                  transform: menuOpen ? "translateY(-5px) rotate(-45deg)" : "none",
                  transition: "transform 250ms ease, background 250ms ease",
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              background: "rgba(5,5,16,0.97)",
              borderColor: "rgba(100,255,218,0.1)",
              animation: "slideDown 200ms ease",
            }}
          >
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-3 text-sm font-medium border-b"
                  style={{
                    color:
                      pathname === l.href ||
                      (l.href !== "/" && pathname.startsWith(l.href.split("?")[0].split("#")[0]) && l.href !== "/#roadmap")
                        ? "#64ffda"
                        : "#8892b0",
                    borderColor: "rgba(100,255,218,0.06)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={toggleNerdLevel}
                className="mt-3 py-2 flex items-center gap-2 text-sm"
                style={{ color: nerdLevel ? "#b57bee" : "#8892b0" }}
              >
                <span>🧪</span>
                <span>{nerdLevel ? "Nerd Mode: ON" : "Nerd Mode: OFF"}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
          style={{
            background: "rgba(5,5,16,0.85)",
            backdropFilter: "blur(20px)",
            animation: "fadeIn 150ms ease",
          }}
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl"
            style={{
              background: "rgba(10,10,31,0.98)",
              border: "1px solid rgba(100,255,218,0.15)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(100,255,218,0.05)",
              animation: "scaleIn 200ms cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <style>{`@keyframes scaleIn{from{transform:scale(0.96);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
            <div className="flex items-center gap-3 p-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64ffda"
                strokeWidth="2"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the cosmos — try 'Ganymede', 'Betelgeuse', 'dark matter'…"
                className="flex-1 bg-transparent outline-none text-base"
                style={{
                  color: "#ffffff",
                  fontFamily: "Inter, sans-serif",
                  caretColor: "#64ffda",
                }}
                disabled={searching}
              />
              {searching && (
                <div className="w-4 h-4 rounded-full border-2 border-[#64ffda] border-t-transparent animate-spin shrink-0" />
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="shrink-0"
                style={{ color: "#8892b0", transition: "color 150ms ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8892b0")}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            {liveResults && (liveResults.topicMatches.length > 0 || liveResults.catalogMatches.length > 0 || liveResults.glossaryMatches.length > 0) ? (
              <div
                className="px-4 pb-3 pt-2 max-h-80 overflow-y-auto"
                style={{ borderTop: "1px solid rgba(100,255,218,0.08)" }}
              >
                {liveResults.topicMatches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#64ffda" }}>Learn about:</p>
                    {liveResults.topicMatches.map((t) => (
                      <button
                        key={t.slug}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                          router.push(`/topic/${t.slug}`);
                        }}
                        className="block w-full text-left text-sm py-1.5 px-2 rounded-lg"
                        style={{ color: "#e2e8f0" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(100,255,218,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
                {liveResults.catalogMatches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#64ffda" }}>In the atlas:</p>
                    {liveResults.catalogMatches.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                          router.push(`/object/${o.id}`);
                        }}
                        className="block w-full text-left text-sm py-1.5 px-2 rounded-lg"
                        style={{ color: "#e2e8f0" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(100,255,218,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {o.name}
                        {o.parentBody && <span style={{ color: "#8892b0" }}> · {o.parentBody}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {liveResults.glossaryMatches.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-1.5" style={{ color: "#64ffda" }}>Define:</p>
                    {liveResults.glossaryMatches.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery("");
                          setGlossaryModalTermId(g.id);
                        }}
                        className="block w-full text-left text-sm py-1.5 px-2 rounded-lg"
                        style={{ color: "#e2e8f0" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(100,255,218,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span className="font-medium">{g.term}</span>
                        <span style={{ color: "#8892b0" }}> — {g.oneLiner}</span>
                      </button>
                    ))}
                  </div>
                )}
                <button
                  type="submit"
                  className="block w-full text-left text-sm py-1.5 px-2 rounded-lg"
                  style={{ color: "#64ffda" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(100,255,218,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Ask AI: search &ldquo;{query}&rdquo; →
                </button>
              </div>
            ) : (
              <div
                className="px-4 pb-3 pt-2"
                style={{ borderTop: "1px solid rgba(100,255,218,0.08)" }}
              >
                {query.trim() ? (
                  <button
                    type="submit"
                    className="text-xs"
                    style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
                  >
                    No instant matches — Ask AI: search &ldquo;{query}&rdquo; →
                  </button>
                ) : (
                  <p className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
                    Searches topics{" "}
                    <span style={{ color: "#64ffda" }}>·</span>{" "}
                    Catalog objects{" "}
                    <span style={{ color: "#64ffda" }}>·</span>{" "}
                    Glossary terms{" "}
                    <span style={{ color: "#64ffda" }}>·</span>{" "}
                    AI fallback
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
}
