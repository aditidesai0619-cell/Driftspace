"use client";
import { useEffect, useRef } from "react";

export default function AccretionDisk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#050510";
      ctx.fillRect(0, 0, W, H);

      // Accretion disk rings (outer → inner)
      const rings = [
        { r: 160, color: "#8B2500", speed: 0.3, opacity: 0.5, width: 18 },
        { r: 135, color: "#C84400", speed: 0.45, opacity: 0.6, width: 14 },
        { r: 112, color: "#FF6B00", speed: 0.6, opacity: 0.7, width: 12 },
        { r: 90, color: "#FF9A00", speed: 0.8, opacity: 0.8, width: 10 },
        { r: 70, color: "#FFD700", speed: 1.1, opacity: 0.85, width: 8 },
        { r: 52, color: "#FFF4C2", speed: 1.5, opacity: 0.9, width: 6 },
        { r: 38, color: "#FFFFFF", speed: 2.0, opacity: 0.95, width: 5 },
      ];

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.35); // perspective

      for (const ring of rings) {
        const rot = (time * 0.0008 * ring.speed) % (Math.PI * 2);
        ctx.save();
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.r, ring.r * 0.95, 0, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.globalAlpha = ring.opacity;
        ctx.lineWidth = ring.width;
        ctx.shadowColor = ring.color;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Relativistic jets
      const jetGrad = ctx.createLinearGradient(cx, cy - 170, cx, cy - 30);
      jetGrad.addColorStop(0, "rgba(100,255,218,0)");
      jetGrad.addColorStop(0.5, "rgba(100,255,218,0.4)");
      jetGrad.addColorStop(1, "rgba(100,255,218,0.7)");

      const jetGrad2 = ctx.createLinearGradient(cx, cy + 30, cx, cy + 170);
      jetGrad2.addColorStop(0, "rgba(100,255,218,0.7)");
      jetGrad2.addColorStop(0.5, "rgba(100,255,218,0.4)");
      jetGrad2.addColorStop(1, "rgba(100,255,218,0)");

      // Top jet
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy - 30);
      ctx.lineTo(cx - 10, cy - 170);
      ctx.lineTo(cx + 10, cy - 170);
      ctx.lineTo(cx + 4, cy - 30);
      ctx.fillStyle = jetGrad;
      ctx.fill();

      // Bottom jet
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy + 30);
      ctx.lineTo(cx - 10, cy + 170);
      ctx.lineTo(cx + 10, cy + 170);
      ctx.lineTo(cx + 4, cy + 30);
      ctx.fillStyle = jetGrad2;
      ctx.fill();

      // Central black hole
      const blackGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      blackGrad.addColorStop(0, "#000000");
      blackGrad.addColorStop(0.8, "#000000");
      blackGrad.addColorStop(1, "rgba(123,47,255,0.3)");
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = blackGrad;
      ctx.fill();

      // Photon sphere glow
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(123,47,255,0.5)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#7b2fff";
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.shadowBlur = 0;

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
        style={{ display: "block" }}
      />
      <div
        className="absolute top-3 right-3 text-xs px-2 py-1 rounded"
        style={{ background: "rgba(123,47,255,0.1)", color: "#b57bee", border: "1px solid rgba(123,47,255,0.2)" }}
      >
        Accretion Disk + Relativistic Jets
      </div>
    </div>
  );
}
