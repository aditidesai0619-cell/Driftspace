"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import type { NewsArticle, UpcomingLaunch } from "@/app/api/news/feed/route";
import NebulaSpinner from "@/components/NebulaSpinner";
import { linkGlossaryTerms } from "@/lib/linkGlossaryTerms";

const ShaderCanvas = dynamic(() => import("@/components/celestial-sphere-shader"), { ssr: false });

const TYPE_BADGE_COLORS: Record<string, string> = {
  launch: "#fbbf24",
  discovery: "#34d399",
  mission: "#60a5fa",
  science: "#c084fc",
};

const LAUNCH_STATUS_COLORS: Record<string, string> = {
  go: "#4ade80",
  tbd: "#fbbf24",
  hold: "#f87171",
  success: "#34d399",
  failure: "#f87171",
};

function useCountdown(net: string) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function calc() {
      const diff = new Date(net).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Launched"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [net]);

  return remaining;
}

function LaunchCard({ launch }: { launch: UpcomingLaunch }) {
  const countdown = useCountdown(launch.net);
  const statusColor = LAUNCH_STATUS_COLORS[launch.status] ?? "#8892b0";

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{
        background: "rgba(10,10,31,0.8)",
        border: "1px solid rgba(100,255,218,0.1)",
        borderLeft: `3px solid ${statusColor}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3
          className="text-sm font-semibold leading-tight"
          style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff" }}
        >
          {launch.name}
        </h3>
        <span
          className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: `${statusColor}18`,
            color: statusColor,
            border: `1px solid ${statusColor}40`,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {launch.statusName}
        </span>
      </div>
      <p className="text-xs mb-1" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
        {launch.rocket} · {launch.agency}
      </p>
      <p className="text-xs mb-3" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
        📍 {launch.launchSite}
      </p>
      <div
        className="flex items-center gap-2 rounded-lg p-2"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>T–</span>
        <span
          className="text-sm font-bold font-mono"
          style={{ color: statusColor, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.02em" }}
        >
          {countdown}
        </span>
      </div>
    </div>
  );
}

function ArticleCard({ article, featured = false }: { article: NewsArticle; featured?: boolean }) {
  const typeColor = TYPE_BADGE_COLORS[article.type] ?? "#8892b0";
  const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl overflow-hidden mb-6 group"
        style={{
          background: "rgba(10,10,31,0.85)",
          border: "1px solid rgba(100,255,218,0.12)",
          boxShadow: "0 2px 8px rgba(5,5,16,0.5), 0 8px 32px rgba(5,5,16,0.35)",
          transition: "border-color 250ms ease, transform 250ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(100,255,218,0.3)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(100,255,218,0.12)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {article.imageUrl && (
          <div
            className="relative h-56 overflow-hidden"
            style={{
              background: `url(${article.imageUrl}) center/cover no-repeat, #0a0a1f`,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(10,10,31,0.9) 0%, rgba(10,10,31,0.2) 60%)" }}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: `${typeColor}18`,
                color: typeColor,
                border: `1px solid ${typeColor}35`,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
            </span>
            <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
              {article.newsSite} · {date}
            </span>
          </div>
          <h2
            className="font-bold text-xl mb-3"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", letterSpacing: "-0.02em", lineHeight: 1.25 }}
          >
            {article.title}
          </h2>
          <p
            className="text-sm mb-4"
            style={{
              color: "#8892b0",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.75,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {article.summary}
          </p>
          <span
            className="text-sm font-medium flex items-center gap-1 group-hover:gap-2"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif", transition: "gap 150ms ease" }}
          >
            Read more →
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl p-4 mb-3 group"
      style={{
        background: "rgba(10,10,31,0.8)",
        border: "1px solid rgba(100,255,218,0.08)",
        transition: "border-color 200ms ease, transform 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(100,255,218,0.25)";
        e.currentTarget.style.transform = "translateX(2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(100,255,218,0.08)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div className="flex items-start gap-3">
        {article.imageUrl && (
          <div
            className="shrink-0 rounded-lg w-16 h-16"
            style={{
              background: `url(${article.imageUrl}) center/cover no-repeat, #0a0a1f`,
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-1.5 py-0.5 rounded font-medium"
              style={{
                background: `${typeColor}18`,
                color: typeColor,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {article.type}
            </span>
            <span className="text-xs" style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
              {article.newsSite} · {date}
            </span>
          </div>
          <h3
            className="text-sm font-semibold mb-1 leading-snug"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff" }}
          >
            {article.title}
          </h3>
          <p
            className="text-xs"
            style={{
              color: "#8892b0",
              fontFamily: "Inter, sans-serif",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6,
            }}
          >
            {article.summary}
          </p>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [launches, setLaunches] = useState<UpcomingLaunch[]>([]);
  const [apod, setApod] = useState<{
    title: string;
    explanation: string;
    url: string;
    hdurl?: string;
    mediaType: string;
    date: string;
  } | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [digestText, setDigestText] = useState<string | null>(null);
  const [digestLoading, setDigestLoading] = useState(false);
  const [apodExplain, setApodExplain] = useState<string | null>(null);
  const [apodLoading, setApodLoading] = useState(false);

  useEffect(() => {
    fetch("/api/news/feed")
      .then((r) => r.json())
      .then((d) => {
        setArticles(d.articles ?? []);
        setLaunches(d.launches ?? []);
        setApod(d.apod ?? null);
      })
      .catch(() => {})
      .finally(() => setFeedLoading(false));
  }, []);

  const generateDigest = useCallback(async () => {
    if (articles.length === 0) return;
    setDigestLoading(true);
    try {
      const headlines = articles
        .slice(0, 10)
        .map((a, i) => `${i + 1}. ${a.title}`)
        .join("\n");
      const res = await fetch("/api/ai/teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName: `This week in space. Here are the top 10 headlines:\n${headlines}\n\nWrite a 200-word nerdy but accessible weekly digest in the voice of an enthusiastic astrophysicist. Mention specific missions or discoveries from the headlines. End with one thought-provoking question about what these events mean for humanity's understanding of the cosmos.`,
        }),
      });
      const data = await res.json();
      setDigestText(data.teaser ?? "");
    } catch {
      setDigestText("The cosmos had a busy week — from new discoveries to upcoming launches pushing humanity further into the void.");
    } finally {
      setDigestLoading(false);
    }
  }, [articles]);

  const explainApod = useCallback(async () => {
    if (!apod) return;
    setApodLoading(true);
    try {
      const res = await fetch("/api/ai/teaser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicName: `NASA Astronomy Picture of the Day: "${apod.title}". The official description: "${apod.explanation}". Now write a deeper, more exciting explanation — 3-4 sentences — bringing out the most mind-bending physics or astronomy behind this image. Speak directly to the viewer.`,
        }),
      });
      const data = await res.json();
      setApodExplain(data.teaser ?? "");
    } catch {
      setApodExplain("This image captures a moment in the cosmic story — one that took billions of years to compose.");
    } finally {
      setApodLoading(false);
    }
  }, [apod]);

  const [featured, ...rest] = articles;

  return (
    <div style={{ minHeight: "100vh", paddingTop: 64 }}>
      {/* ── HERO ── */}
      <section
        className="py-16 px-6 text-center"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(96,165,250,0.05) 0%, transparent 60%), #050510",
          borderBottom: "1px solid rgba(100,255,218,0.08)",
        }}
      >
        <div
          className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
          style={{
            background: "rgba(96,165,250,0.08)",
            border: "1px solid rgba(96,165,250,0.25)",
            color: "#60a5fa",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" />
          Live from the cosmos
        </div>
        <h1
          className="font-semibold mb-3"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(32px, 5vw, 60px)",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            lineHeight: 1.05,
          }}
        >
          Space News
        </h1>
        <p style={{ color: "#8892b0", fontFamily: "Inter, sans-serif", fontSize: 16 }}>
          Latest missions, discoveries, and launches — with AI context
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── THIS WEEK IN SPACE ── */}
        <section className="mb-12">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(10,10,31,0.9)",
              border: "1px solid rgba(100,255,218,0.12)",
            }}
          >
            <div className="absolute inset-0" style={{ opacity: 0.12 }}>
              <ShaderCanvas
                color1="#082f49"
                color2="#7dd3fc"
                rotationSpeed={0.04}
                cloudDensity={2.0}
                glowIntensity={1.2}
                contained={true}
              />
            </div>
            <div className="relative p-8">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-widest uppercase mb-3"
                    style={{
                      background: "rgba(100,255,218,0.08)",
                      border: "1px solid rgba(100,255,218,0.2)",
                      color: "#64ffda",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ✦ AI Edition
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", letterSpacing: "-0.02em" }}
                  >
                    This Week in Space
                  </h2>
                </div>
                {!digestText && (
                  <button
                    onClick={generateDigest}
                    disabled={digestLoading || articles.length === 0}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm"
                    style={{
                      background: digestLoading ? "rgba(100,255,218,0.3)" : "#64ffda",
                      color: "#050510",
                      fontFamily: "Space Grotesk, sans-serif",
                      boxShadow: "0 0 20px rgba(100,255,218,0.25)",
                      transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease",
                      cursor: digestLoading ? "wait" : "pointer",
                    }}
                    onMouseEnter={(e) => { if (!digestLoading) { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 0 36px rgba(100,255,218,0.4)"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(100,255,218,0.25)"; }}
                  >
                    {digestLoading ? (
                      <span className="flex items-center gap-2"><NebulaSpinner size={16} /> Generating…</span>
                    ) : (
                      "Generate this week's digest ↗"
                    )}
                  </button>
                )}
              </div>
              {digestText ? (
                <p
                  className="text-base leading-relaxed max-w-3xl"
                  style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif", lineHeight: 1.85 }}
                >
                  {linkGlossaryTerms(digestText)}
                </p>
              ) : (
                !digestLoading && (
                  <p
                    className="text-sm"
                    style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}
                  >
                    Click to generate an AI summary of this week&apos;s top space stories — written like an enthusiastic astrophysicist.
                  </p>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── APOD ── */}
        {apod && apod.mediaType === "image" && (
          <section className="mb-12">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
            >
              Astronomy Picture of the Day — {apod.date}
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(10,10,31,0.9)",
                border: "1px solid rgba(100,255,218,0.1)",
              }}
            >
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={apod.hdurl ?? apod.url}
                  alt={apod.title}
                  className="w-full object-cover"
                  style={{ maxHeight: 480 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,10,31,0.8) 0%, transparent 50%)" }}
                />
              </div>
              <div className="p-6">
                <h2
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff", letterSpacing: "-0.02em" }}
                >
                  {apod.title}
                </h2>
                <p
                  className="text-sm mb-5"
                  style={{
                    color: "#8892b0",
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.75,
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {apod.explanation}
                </p>

                {apodExplain ? (
                  <div
                    className="rounded-xl p-4 mb-4"
                    style={{ background: "rgba(100,255,218,0.05)", border: "1px solid rgba(100,255,218,0.15)" }}
                  >
                    <p
                      className="text-xs font-medium tracking-widest uppercase mb-2"
                      style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
                    >
                      AI Deep Dive
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif", lineHeight: 1.75 }}
                    >
                      {linkGlossaryTerms(apodExplain ?? "")}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={explainApod}
                    disabled={apodLoading}
                    className="text-sm font-medium px-4 py-2 rounded-xl"
                    style={{
                      background: "rgba(100,255,218,0.08)",
                      border: "1px solid rgba(100,255,218,0.2)",
                      color: "#64ffda",
                      fontFamily: "Inter, sans-serif",
                      cursor: apodLoading ? "wait" : "pointer",
                      transition: "background 200ms ease",
                    }}
                    onMouseEnter={(e) => { if (!apodLoading) e.currentTarget.style.background = "rgba(100,255,218,0.14)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(100,255,218,0.08)"; }}
                  >
                    {apodLoading ? (
                      <span className="flex items-center gap-2"><NebulaSpinner size={14} /> Generating…</span>
                    ) : (
                      "Ask AI about this image ✦"
                    )}
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── MAIN TWO-COLUMN LAYOUT ── */}
        {feedLoading ? (
          <div className="flex justify-center py-20">
            <NebulaSpinner size={56} label="Fetching latest from the cosmos…" />
          </div>
        ) : (
          <div className="flex gap-8 items-start">
            {/* Left: articles (70%) */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium tracking-widest uppercase mb-6"
                style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
              >
                Latest from the cosmos
              </p>

              {articles.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ background: "rgba(10,10,31,0.8)", border: "1px solid rgba(100,255,218,0.08)" }}
                >
                  <p style={{ color: "#8892b0", fontFamily: "Inter, sans-serif" }}>
                    Could not load articles right now — the cosmos is briefly unreachable.
                  </p>
                </div>
              ) : (
                <>
                  {featured && <ArticleCard article={featured} featured />}
                  <div>
                    {rest.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right: launches (30%) */}
            <div className="w-72 shrink-0 hidden lg:block">
              <div className="sticky top-24">
                <p
                  className="text-xs font-medium tracking-widest uppercase mb-4"
                  style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
                >
                  Upcoming Launches
                </p>
                {launches.length === 0 ? (
                  <div
                    className="rounded-xl p-5 text-center"
                    style={{ background: "rgba(10,10,31,0.8)", border: "1px solid rgba(100,255,218,0.08)" }}
                  >
                    <p className="text-xs" style={{ color: "#8892b0" }}>No launch data available.</p>
                  </div>
                ) : (
                  <>
                    {launches.map((launch) => (
                      <LaunchCard key={launch.id} launch={launch} />
                    ))}
                    <div className="flex gap-3 mt-3 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
                      {[["go", "Confirmed"], ["tbd", "TBD"], ["hold", "Hold"]].map(([s, label]) => (
                        <span key={s} className="flex items-center gap-1" style={{ color: "#8892b0" }}>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: LAUNCH_STATUS_COLORS[s] }}
                          />
                          {label}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile launches */}
        {launches.length > 0 && (
          <div className="lg:hidden mt-10">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-4"
              style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
            >
              Upcoming Launches
            </p>
            {launches.slice(0, 3).map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
