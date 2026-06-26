"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { topics, PILLAR_COLORS } from "@/lib/topics";
import type { Topic } from "@/lib/topics";

interface NodeDatum {
  id: string;
  topic: Topic;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PILLAR_SIZES: Record<string, number> = {
  "the-sun": 36,
  "milky-way": 38,
  "big-bang": 40,
  "dark-matter": 34,
  "supermassive-black-holes": 36,
  "stellar-evolution": 32,
  "andromeda": 30,
  "dark-energy": 34,
};

function getNodeRadius(t: Topic): number {
  if (PILLAR_SIZES[t.slug]) return PILLAR_SIZES[t.slug];
  if (t.difficulty === "beginner") return 26;
  if (t.difficulty === "intermediate") return 22;
  return 18;
}

export default function ExplorePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<NodeDatum[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const pillarFilters = [
    { id: "all", label: "All", color: "#64ffda" },
    { id: "solar-system", label: "🌍 Solar System", color: "#4ade80" },
    { id: "stars", label: "⭐ Stars", color: "#fbbf24" },
    { id: "galaxies", label: "🌌 Galaxies", color: "#60a5fa" },
    { id: "black-holes", label: "🕳️ Black Holes", color: "#c084fc" },
    { id: "cosmology", label: "🔭 Cosmology", color: "#64ffda" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = window.innerHeight - 64;

    // Initialize nodes
    const filteredTopics = selectedFilter === "all"
      ? topics
      : topics.filter((t) => t.pillar === selectedFilter);

    nodesRef.current = filteredTopics.map((topic) => ({
      id: topic.slug,
      topic,
      x: W * 0.1 + Math.random() * W * 0.8,
      y: H * 0.1 + Math.random() * H * 0.8,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: getNodeRadius(topic),
    }));

    function tick() {
      const nodes = nodesRef.current;
      const DAMPING = 0.98;
      const REPULSION = 1800;
      const ATTRACTION = 0.0006;
      const cx = W / 2;
      const cy = H / 2;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // Gravity to center
        a.vx += (cx - a.x) * ATTRACTION;
        a.vy += (cy - a.y) * ATTRACTION;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.r + b.r + 20;
          const force = REPULSION / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;

          // Collision resolution
          if (dist < minDist) {
            const overlap = minDist - dist;
            a.x += (dx / dist) * overlap * 0.5;
            a.y += (dy / dist) * overlap * 0.5;
            b.x -= (dx / dist) * overlap * 0.5;
            b.y -= (dy / dist) * overlap * 0.5;
          }
        }

        a.vx *= DAMPING;
        a.vy *= DAMPING;
        a.x += a.vx;
        a.y += a.vy;

        // Boundary
        const pad = a.r + 10;
        if (a.x < pad) { a.x = pad; a.vx *= -0.5; }
        if (a.x > W - pad) { a.x = W - pad; a.vx *= -0.5; }
        if (a.y < pad) { a.y = pad; a.vy *= -0.5; }
        if (a.y > H - pad) { a.y = H - pad; a.vy *= -0.5; }
      }
    }

    function draw() {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(5,5,16,0)";
      ctx.fillRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      let newHover: string | null = null;

      for (const node of nodesRef.current) {
        const dx = mx - node.x;
        const dy = my - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < node.r + 8;
        if (isHovered) newHover = node.id;

        const color = PILLAR_COLORS[node.topic.pillar];
        const displayR = isHovered ? node.r * 1.2 : node.r;

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, displayR * 2.5);
        glow.addColorStop(0, color + (isHovered ? "55" : "25"));
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, displayR, 0, Math.PI * 2);
        ctx.fillStyle = color + (isHovered ? "55" : "22");
        ctx.fill();
        ctx.strokeStyle = color + (isHovered ? "ff" : "88");
        ctx.lineWidth = isHovered ? 2 : 1;
        ctx.shadowColor = color;
        ctx.shadowBlur = isHovered ? 20 : 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Emoji
        ctx.font = `${Math.round(displayR * 0.7)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.topic.icon, node.x, node.y);

        // Label
        if (isHovered || displayR > 28) {
          ctx.font = `${isHovered ? "bold " : ""}${Math.max(10, Math.round(displayR * 0.38))}px Space Grotesk, sans-serif`;
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#000";
          ctx.shadowBlur = 6;
          ctx.fillText(
            node.topic.name.length > 18 ? node.topic.name.slice(0, 16) + "…" : node.topic.name,
            node.x,
            node.y + displayR + 14
          );
          ctx.shadowBlur = 0;
        }
      }

      setHoveredId(newHover);
      tick();
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    function onResize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 64;
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (const node of nodesRef.current) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.r + 10) {
          router.push(`/topic/${node.id}`);
          return;
        }
      }
    }

    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [selectedFilter, router]);

  return (
    <div className="relative" style={{ height: "100vh", paddingTop: 64, overflow: "hidden" }}>
      {/* Filter bar */}
      <div
        className="absolute top-16 left-0 right-0 flex justify-center gap-2 flex-wrap px-4 pt-4 pb-2 z-20"
      >
        {pillarFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: selectedFilter === f.id ? `${f.color}20` : "rgba(5,5,16,0.7)",
              border: `1px solid ${selectedFilter === f.id ? f.color + "60" : "rgba(255,255,255,0.1)"}`,
              color: selectedFilter === f.id ? f.color : "#8892b0",
              backdropFilter: "blur(8px)",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Title */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
        <p className="text-xs" style={{ color: "rgba(136,146,176,0.5)", fontFamily: "Inter" }}>
          Hover to discover • Click to explore • Nodes drift with cosmic physics
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 top-16"
        style={{ cursor: hoveredId ? "pointer" : "default", zIndex: 1 }}
      />
    </div>
  );
}
