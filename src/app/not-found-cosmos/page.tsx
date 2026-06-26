"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDriftspaceStore } from "@/lib/store";
import { getTopicBySlug } from "@/lib/topics";
import { getCatalogObjectById, TYPE_COLORS, TYPE_LABELS } from "@/lib/catalog";

const ShaderCanvas = dynamic(() => import("@/components/celestial-sphere-shader"), { ssr: false });

const RANDOM_PRESETS = [
  { color1: "#240046", color2: "#9b5de5", rotationSpeed: 0.06, cloudDensity: 3.8, glowIntensity: 1.6 },
  { color1: "#082f49", color2: "#7dd3fc", rotationSpeed: 0.08, cloudDensity: 2.5, glowIntensity: 1.5 },
  { color1: "#ff006e", color2: "#8338ec", rotationSpeed: 0.08, cloudDensity: 3.0, glowIntensity: 2.0 },
  { color1: "#10002b", color2: "#e0aaff", rotationSpeed: 0.04, cloudDensity: 4.5, glowIntensity: 1.2 },
];

export default function NotFoundCosmosPage() {
  const router = useRouter();
  const { notFoundSearch, setNotFoundSearch } = useDriftspaceStore();
  const [preset] = useState(
    () => RANDOM_PRESETS[Math.floor(Math.random() * RANDOM_PRESETS.length)]
  );

  // If someone navigates directly without search data, redirect home
  useEffect(() => {
    if (!notFoundSearch) {
      router.replace("/");
    }
  }, [notFoundSearch, router]);

  if (!notFoundSearch) return null;

  const { query, type, parentBody, description, relatedSlugs, relatedCatalogIds } = notFoundSearch;

  const relatedTopics = relatedSlugs
    .map((s) => getTopicBySlug(s))
    .filter(Boolean);
  const relatedCatalog = relatedCatalogIds
    .map((id) => getCatalogObjectById(id))
    .filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* Background shader */}
      <div className="fixed inset-0" style={{ zIndex: 0, opacity: 0.35 }}>
        <ShaderCanvas
          color1={preset.color1}
          color2={preset.color2}
          rotationSpeed={preset.rotationSpeed}
          cloudDensity={preset.cloudDensity}
          glowIntensity={preset.glowIntensity}
          contained={true}
        />
      </div>

      <div
        className="relative max-w-3xl mx-auto px-6 py-32 text-center"
        style={{ zIndex: 1 }}
      >
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl"
          style={{
            background: "rgba(100,255,218,0.06)",
            border: "1px solid rgba(100,255,218,0.2)",
            boxShadow: "0 0 40px rgba(100,255,218,0.1)",
          }}
        >
          🌌
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
          style={{
            background: "rgba(100,255,218,0.08)",
            border: "1px solid rgba(100,255,218,0.2)",
            color: "#64ffda",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#64ffda] animate-pulse" />
          Not in our atlas yet
        </div>

        <h1
          className="font-semibold mb-4"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          &ldquo;{query}&rdquo;
        </h1>

        {parentBody && (
          <p
            className="text-sm mb-6"
            style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} of {parentBody}
          </p>
        )}

        {description && (
          <p
            className="text-base mb-10 mx-auto"
            style={{
              color: "#cbd5e1",
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.85,
              maxWidth: 560,
            }}
          >
            {description}
          </p>
        )}

        {/* Coming soon notice */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm mb-14"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#8892b0",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <span>🔭</span>
          <span>
            We&apos;re expanding the atlas —{" "}
            <span style={{ color: "#e2e8f0" }}>{query}</span> is coming soon
          </span>
        </div>

        {/* Related content */}
        {(relatedTopics.length > 0 || relatedCatalog.length > 0) && (
          <div className="text-left">
            <p
              className="text-xs font-medium tracking-widest uppercase mb-6 text-center"
              style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
            >
              Related topics you can explore
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTopics.map((topic) => (
                <Link
                  key={topic!.slug}
                  href={`/topic/${topic!.slug}`}
                  onClick={() => setNotFoundSearch(null)}
                  className="block rounded-xl p-5 group"
                  style={{
                    background: "rgba(10,10,31,0.85)",
                    border: "1px solid rgba(100,255,218,0.1)",
                    boxShadow: "0 2px 8px rgba(13,27,42,0.5)",
                    transition: "border-color 250ms ease, transform 250ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,255,218,0.3)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(100,255,218,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="text-2xl mb-2">{topic!.icon}</div>
                  <p
                    className="text-xs mb-1 font-medium"
                    style={{ color: "#64ffda", fontFamily: "Inter, sans-serif" }}
                  >
                    Learning Topic
                  </p>
                  <p
                    className="font-semibold text-sm mb-3"
                    style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff" }}
                  >
                    {topic!.name}
                  </p>
                  <span
                    className="text-xs font-medium flex items-center gap-1"
                    style={{ color: "#64ffda" }}
                  >
                    Explore
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              ))}

              {relatedCatalog.map((obj) => {
                const typeColor = TYPE_COLORS[obj!.type];
                return (
                  <Link
                    key={obj!.id}
                    href={`/object/${obj!.id}`}
                    onClick={() => setNotFoundSearch(null)}
                    className="block rounded-xl p-5"
                    style={{
                      background: "rgba(10,10,31,0.85)",
                      border: "1px solid rgba(100,255,218,0.1)",
                      boxShadow: "0 2px 8px rgba(13,27,42,0.5)",
                      transition: "border-color 250ms ease, transform 250ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(100,255,218,0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(100,255,218,0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-3 flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${obj!.shaderPreset.color1}80, ${obj!.shaderPreset.color2}40)`,
                        border: `1px solid ${typeColor}30`,
                        color: typeColor,
                      }}
                    >
                      {obj!.name.charAt(0)}
                    </div>
                    <p
                      className="text-xs mb-1 font-medium"
                      style={{ color: typeColor, fontFamily: "Inter, sans-serif" }}
                    >
                      {TYPE_LABELS[obj!.type]}
                    </p>
                    <p
                      className="font-semibold text-sm mb-3"
                      style={{ fontFamily: "Space Grotesk, sans-serif", color: "#ffffff" }}
                    >
                      {obj!.name}
                    </p>
                    <span
                      className="text-xs font-medium flex items-center gap-1"
                      style={{ color: "#64ffda" }}
                    >
                      View in atlas
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/catalog"
            onClick={() => setNotFoundSearch(null)}
            className="px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "#64ffda",
              color: "#050510",
              fontFamily: "Space Grotesk, sans-serif",
              boxShadow: "0 0 24px rgba(100,255,218,0.3)",
              transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(100,255,218,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 24px rgba(100,255,218,0.3)";
            }}
          >
            Browse the full Cosmic Atlas →
          </Link>
          <Link
            href="/"
            onClick={() => setNotFoundSearch(null)}
            className="px-6 py-3 rounded-xl font-semibold text-sm"
            style={{
              background: "transparent",
              color: "#64ffda",
              border: "1px solid rgba(100,255,218,0.3)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
