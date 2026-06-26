"use client";
import { useEffect, useRef } from "react";

const ERAS = [
  { label: "Planck Epoch", time: "t = 0", color: "#ff4757", x: 0.04 },
  { label: "Inflation", time: "10⁻³² s", color: "#ff6b81", x: 0.14 },
  { label: "Quark Epoch", time: "10⁻¹² s", color: "#ff9f43", x: 0.24 },
  { label: "Nucleosynthesis", time: "3 min", color: "#ffd32a", x: 0.36 },
  { label: "Recombination", time: "380,000 yr", color: "#0abde3", x: 0.50 },
  { label: "First Stars", time: "200M yr", color: "#48dbfb", x: 0.63 },
  { label: "Galaxy Formation", time: "1B yr", color: "#7b2fff", x: 0.75 },
  { label: "Solar System", time: "9B yr", color: "#4fc3f7", x: 0.86 },
  { label: "Today", time: "13.8B yr", color: "#64ffda", x: 0.96 },
];

export default function BigBangTimeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, W, H);

      progressRef.current = Math.min(1, progressRef.current + 0.004);
      const prog = progressRef.current;

      // Expansion cone
      const coneGrad = ctx.createLinearGradient(0, midY, W, midY);
      ERAS.forEach((era) => {
        coneGrad.addColorStop(era.x, era.color + "44");
      });

      ctx.beginPath();
      ctx.moveTo(10, midY);
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        if (t > prog) break;
        const x = t * W;
        const spread = 8 + t * (H / 2 - 20);
        ctx.lineTo(x, midY - spread);
      }
      for (let i = 100; i >= 0; i--) {
        const t = i / 100;
        if (t > prog) continue;
        const x = t * W;
        const spread = 8 + t * (H / 2 - 20);
        ctx.lineTo(x, midY + spread);
      }
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();

      // Timeline spine
      ctx.beginPath();
      ctx.moveTo(10, midY);
      ctx.lineTo(prog * W, midY);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Era nodes
      for (const era of ERAS) {
        if (era.x > prog) break;
        const x = era.x * W;

        // Node glow
        const glow = ctx.createRadialGradient(x, midY, 0, x, midY, 20);
        glow.addColorStop(0, era.color + "88");
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, midY, 20, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(x, midY, 5, 0, Math.PI * 2);
        ctx.fillStyle = era.color;
        ctx.shadowColor = era.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        const above = era.x < 0.5;
        const labelY = above ? midY - 35 : midY + 35;
        ctx.fillStyle = era.color;
        ctx.font = "bold 10px Space Grotesk, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(era.label, x, labelY);
        ctx.fillStyle = "#8892b0";
        ctx.font = "9px Inter, sans-serif";
        ctx.fillText(era.time, x, labelY + 13);
      }

      ctx.textAlign = "left";

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative w-full" style={{ borderRadius: 12, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        width={700}
        height={280}
        className="w-full"
        style={{ display: "block" }}
      />
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded"
        style={{ background: "rgba(100,255,218,0.1)", color: "#64ffda", border: "1px solid rgba(100,255,218,0.2)" }}
      >
        Big Bang → Present
      </div>
    </div>
  );
}
