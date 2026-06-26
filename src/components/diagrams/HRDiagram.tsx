"use client";
import { useEffect, useRef } from "react";

interface Props {
  topicSlug: string;
}

const STAR_POSITIONS: Record<string, { x: number; y: number; label: string; color: string; size: number }> = {
  "stellar-evolution": { x: 0.45, y: 0.4, label: "Sun (G-type)", color: "#FFD700", size: 8 },
  "neutron-stars": { x: 0.75, y: 0.85, label: "Neutron Star Precursor", color: "#a8edea", size: 6 },
  "white-dwarfs": { x: 0.78, y: 0.82, label: "White Dwarf", color: "#e0f7fa", size: 5 },
  "supernovae": { x: 0.1, y: 0.08, label: "Supergiant (pre-SN)", color: "#FF6B35", size: 16 },
  "pulsars": { x: 0.76, y: 0.86, label: "Pulsar Progenitor", color: "#90e0ef", size: 6 },
};

const EVOLUTION_PATHS: Record<string, Array<{ x: number; y: number }>> = {
  "stellar-evolution": [
    { x: 0.45, y: 0.4 },
    { x: 0.35, y: 0.3 },
    { x: 0.25, y: 0.15 },
    { x: 0.12, y: 0.1 },
    { x: 0.15, y: 0.5 },
    { x: 0.65, y: 0.7 },
    { x: 0.78, y: 0.82 },
  ],
  "supernovae": [
    { x: 0.1, y: 0.08 },
    { x: 0.05, y: 0.05 },
    { x: 0.3, y: 0.4 },
    { x: 0.7, y: 0.9 },
  ],
};

export default function HRDiagram({ topicSlug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);

  const starPos = STAR_POSITIONS[topicSlug] ?? STAR_POSITIONS["stellar-evolution"];
  const path = EVOLUTION_PATHS[topicSlug] ?? EVOLUTION_PATHS["stellar-evolution"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Background stars (HR diagram background)
    const bgStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      color: `hsl(${200 + Math.random() * 160},${50 + Math.random() * 50}%,${50 + Math.random() * 40}%)`,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);

      // Background
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#050510");
      grad.addColorStop(1, "#0a0520");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "rgba(100,255,218,0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * W / 10, 0);
        ctx.lineTo(i * W / 10, H);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * H / 10);
        ctx.lineTo(W, i * H / 10);
        ctx.stroke();
      }

      // Axis labels
      ctx.fillStyle = "#8892b0";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText("← Hotter (Blue)   Surface Temperature   Cooler (Red) →", 10, H - 12);
      ctx.save();
      ctx.translate(14, H / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText("Luminosity (↑ Brighter)", -60, 0);
      ctx.restore();

      // Main sequence band
      ctx.beginPath();
      ctx.moveTo(0.05 * W, 0.02 * H);
      ctx.bezierCurveTo(0.2 * W, 0.15 * H, 0.45 * W, 0.4 * H, 0.85 * W, 0.95 * H);
      ctx.strokeStyle = "rgba(100,255,218,0.15)";
      ctx.lineWidth = 18;
      ctx.stroke();

      // Giant branch
      ctx.beginPath();
      ctx.moveTo(0.45 * W, 0.4 * H);
      ctx.bezierCurveTo(0.3 * W, 0.25 * H, 0.15 * W, 0.12 * H, 0.08 * W, 0.08 * H);
      ctx.strokeStyle = "rgba(255,107,53,0.12)";
      ctx.lineWidth = 14;
      ctx.stroke();

      // BG stars
      for (const s of bgStars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(")", `,${s.alpha})`).replace("hsl", "hsla");
        ctx.fill();
      }

      // Evolution path
      progressRef.current = Math.min(1, progressRef.current + 0.003);
      const totalPoints = path.length - 1;
      const prog = progressRef.current * totalPoints;
      const pathIdx = Math.floor(prog);
      const t = prog - pathIdx;

      if (path.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path[0].x * W, path[0].y * H);
        for (let i = 1; i <= Math.min(pathIdx + 1, path.length - 1); i++) {
          const px = i === pathIdx + 1 ? path[pathIdx].x + (path[Math.min(pathIdx + 1, path.length - 1)].x - path[pathIdx].x) * t : path[i].x;
          const py = i === pathIdx + 1 ? path[pathIdx].y + (path[Math.min(pathIdx + 1, path.length - 1)].y - path[pathIdx].y) * t : path[i].y;
          ctx.lineTo(px * W, py * H);
        }
        ctx.strokeStyle = "rgba(100,255,218,0.7)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Star dot
      const sx = starPos.x * W;
      const sy = starPos.y * H;
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, starPos.size * 3);
      glow.addColorStop(0, starPos.color);
      glow.addColorStop(0.4, starPos.color + "88");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(sx, sy, starPos.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx, sy, starPos.size, 0, Math.PI * 2);
      ctx.fillStyle = starPos.color;
      ctx.fill();

      // Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 12px Space Grotesk, sans-serif";
      ctx.fillText(starPos.label, sx + starPos.size + 6, sy + 4);

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [topicSlug, starPos, path]);

  return (
    <div className="relative w-full" style={{ borderRadius: 12, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={380}
        className="w-full"
        style={{ display: "block", background: "#050510" }}
      />
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded"
        style={{ background: "rgba(100,255,218,0.1)", color: "#64ffda", border: "1px solid rgba(100,255,218,0.2)" }}
      >
        Hertzsprung–Russell Diagram
      </div>
    </div>
  );
}
