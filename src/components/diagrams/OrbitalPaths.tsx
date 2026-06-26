"use client";
import { useEffect, useRef, useState } from "react";

interface Planet {
  name: string;
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  size: number;
}

const PLANETS: Planet[] = [
  { name: "Mercury", radius: 0, orbitRadius: 55, speed: 4.74, color: "#b5b5b5", size: 3 },
  { name: "Venus", radius: 0, orbitRadius: 80, speed: 3.50, color: "#e8cda0", size: 5 },
  { name: "Earth", radius: 0, orbitRadius: 108, speed: 2.98, color: "#4fc3f7", size: 5 },
  { name: "Mars", radius: 0, orbitRadius: 140, speed: 2.41, color: "#ef5350", size: 4 },
  { name: "Jupiter", radius: 0, orbitRadius: 185, speed: 1.31, color: "#c88b3a", size: 10 },
  { name: "Saturn", radius: 0, orbitRadius: 228, speed: 0.97, color: "#e8d5a0", size: 8 },
];

export default function OrbitalPaths({ highlightSlug }: { highlightSlug?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [selected] = useState<string | null>(null);

  const highlighted = highlightSlug === "mars" ? "Mars"
    : highlightSlug === "jupiter" ? "Jupiter"
    : highlightSlug === "saturn" ? "Saturn"
    : highlightSlug === "europa" ? "Jupiter"
    : null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const startTime = performance.now();

    function draw(now: number) {
      if (!ctx) return;
      const elapsed = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, W, H);

      // Orbits
      for (const planet of PLANETS) {
        ctx.beginPath();
        ctx.arc(cx, cy, planet.orbitRadius, 0, Math.PI * 2);
        const isHl = planet.name === highlighted || planet.name === selected;
        ctx.strokeStyle = isHl ? "rgba(100,255,218,0.3)" : "rgba(255,255,255,0.06)";
        ctx.lineWidth = isHl ? 1.5 : 0.5;
        ctx.stroke();
      }

      // Sun
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
      sunGrad.addColorStop(0, "#FFFDE7");
      sunGrad.addColorStop(0.4, "#FFD600");
      sunGrad.addColorStop(1, "rgba(255,160,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 20, 0, Math.PI * 2);
      ctx.fillStyle = sunGrad;
      ctx.shadowColor = "#FFD600";
      ctx.shadowBlur = 30;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Planets
      for (const planet of PLANETS) {
        const angle = elapsed * planet.speed * 0.3;
        const px = cx + Math.cos(angle) * planet.orbitRadius;
        const py = cy + Math.sin(angle) * planet.orbitRadius;
        const isHl = planet.name === highlighted || planet.name === selected;

        if (isHl) {
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, planet.size * 3);
          glowGrad.addColorStop(0, planet.color);
          glowGrad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(px, py, planet.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(px, py, planet.size, 0, Math.PI * 2);
        ctx.fillStyle = isHl ? planet.color : planet.color + "bb";
        ctx.fill();

        if (isHl) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px Space Grotesk, sans-serif";
          ctx.fillText(planet.name, px + planet.size + 4, py - planet.size - 4);
        }

        // Saturn rings
        if (planet.name === "Saturn") {
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(1, 0.3);
          ctx.beginPath();
          ctx.arc(0, 0, planet.size + 8, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(232,213,160,0.6)";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [highlighted, selected]);

  return (
    <div className="relative w-full" style={{ borderRadius: 12, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={380}
        className="w-full cursor-pointer"
        style={{ display: "block", background: "#050510" }}
      />
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded"
        style={{ background: "rgba(100,255,218,0.1)", color: "#64ffda", border: "1px solid rgba(100,255,218,0.2)" }}
      >
        Solar System Orbits (live)
      </div>
    </div>
  );
}
