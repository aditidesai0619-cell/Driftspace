"use client";
import { useEffect, useRef, useState } from "react";

const STAGES = [
  { label: "Earth", scale: 1, color: "#4fc3f7" },
  { label: "Solar System", scale: 0.0001, color: "#FFD600" },
  { label: "Milky Way Arm", scale: 1e-8, color: "#a8dadc" },
  { label: "Milky Way Galaxy", scale: 1e-10, color: "#7b2fff" },
  { label: "Local Group", scale: 1e-12, color: "#4361ee" },
  { label: "Observable Universe", scale: 1e-16, color: "#64ffda" },
];

export default function GalaxyZoom() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const transRef = useRef(0);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    function drawStars(count: number, maxR: number, color: string, alpha: number) {
      if (!ctx) return;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * maxR;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        const s = Math.random() * 1.5 + 0.3;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }
    }

    function draw(now: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Zoom background
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, W, H);

      const s = stageRef.current;
      transRef.current = Math.min(1, transRef.current + 0.008);

      // Background galaxy smear
      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) / 2);
      bgGrad.addColorStop(0, STAGES[s].color + "22");
      bgGrad.addColorStop(0.4, STAGES[s].color + "08");
      bgGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Stage-specific drawing
      if (s === 0) {
        // Earth
        const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
        earthGrad.addColorStop(0, "#1a6b9a");
        earthGrad.addColorStop(0.5, "#2e8b57");
        earthGrad.addColorStop(0.8, "#4fc3f7");
        earthGrad.addColorStop(1, "rgba(79,195,247,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fillStyle = earthGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx, cy, 82, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(79,195,247,0.3)";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (s === 1) {
        // Solar System
        const sun = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
        sun.addColorStop(0, "#FFFDE7");
        sun.addColorStop(1, "rgba(255,200,0,0)");
        ctx.fillStyle = sun;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
        const orbits = [40, 65, 90, 120, 155];
        for (const r of orbits) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        drawStars(6, 0, "#ffffff", 0.8);
      } else if (s === 2) {
        // Milky Way arm
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate((i * Math.PI * 2) / 3 + (now * 0.00005));
          const armGrad = ctx.createLinearGradient(0, 0, 200, 0);
          armGrad.addColorStop(0, "rgba(255,255,200,0.5)");
          armGrad.addColorStop(1, "rgba(255,255,200,0)");
          ctx.fillStyle = armGrad;
          ctx.beginPath();
          ctx.ellipse(100, 0, 160, 20, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        drawStars(300, 180, "#ffffff", 0.4);
      } else if (s === 3) {
        // Full galaxy
        const galGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 160);
        galGrad.addColorStop(0, "rgba(255,255,200,0.7)");
        galGrad.addColorStop(0.3, "rgba(180,150,255,0.3)");
        galGrad.addColorStop(1, "transparent");
        ctx.fillStyle = galGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 160, 60, 0.2, 0, Math.PI * 2);
        ctx.fill();
        drawStars(400, 140, "#ffffff", 0.3);
      } else if (s === 4) {
        // Local group
        const positions = [
          { dx: 0, dy: 0, r: 60 },
          { dx: 110, dy: -30, r: 40 },
          { dx: -80, dy: 50, r: 25 },
          { dx: 50, dy: 80, r: 15 },
          { dx: -60, dy: -70, r: 10 },
        ];
        for (const p of positions) {
          const gal = ctx.createRadialGradient(cx + p.dx, cy + p.dy, 0, cx + p.dx, cy + p.dy, p.r);
          gal.addColorStop(0, "rgba(200,200,255,0.5)");
          gal.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(cx + p.dx, cy + p.dy, p.r, 0, Math.PI * 2);
          ctx.fillStyle = gal;
          ctx.fill();
        }
        drawStars(50, 170, "#8892b0", 0.3);
      } else {
        // Observable universe
        for (let r = 20; r <= 180; r += 30) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          const alpha = 0.05 + (0.15 * (180 - r)) / 180;
          ctx.strokeStyle = `rgba(100,255,218,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        drawStars(500, 180, "#ffffff", 0.2);
        ctx.fillStyle = "rgba(100,255,218,0.1)";
        ctx.beginPath();
        ctx.arc(cx, cy, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      // Stage label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Scale: ${STAGES[s].label}`, cx, H - 20);
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
        width={600}
        height={380}
        className="w-full"
        style={{ display: "block", background: "#050510" }}
      />
      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
        {STAGES.map((st, i) => (
          <button
            key={i}
            onClick={() => setStage(i)}
            className="text-xs px-2 py-0.5 rounded transition-all duration-200"
            style={{
              background: stage === i ? `rgba(100,255,218,0.15)` : "rgba(255,255,255,0.05)",
              border: stage === i ? "1px solid rgba(100,255,218,0.4)" : "1px solid rgba(255,255,255,0.08)",
              color: stage === i ? "#64ffda" : "#8892b0",
            }}
          >
            {st.label}
          </button>
        ))}
      </div>
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded"
        style={{ background: "rgba(100,255,218,0.1)", color: "#64ffda", border: "1px solid rgba(100,255,218,0.2)" }}
      >
        Cosmic Zoom
      </div>
    </div>
  );
}
