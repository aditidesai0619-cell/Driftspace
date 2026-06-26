"use client";
import dynamic from "next/dynamic";
import type { ShaderPreset } from "@/lib/topics";

const ShaderCanvas = dynamic(
  () => import("@/components/celestial-sphere-shader"),
  { ssr: false }
);

interface Props {
  preset?: ShaderPreset;
  /** "fullscreen" = position:fixed covering viewport; "contained" = fills parent div */
  mode?: "fullscreen" | "contained";
  className?: string;
}

const DEFAULT_PRESET: ShaderPreset = {
  color1: "#082f49",
  color2: "#7dd3fc",
  rotationSpeed: 0.08,
  cloudDensity: 2.5,
  glowIntensity: 1.5,
};

export default function CelestialShader({ preset = DEFAULT_PRESET, mode = "contained", className }: Props) {
  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <ShaderCanvas
        color1={preset.color1}
        color2={preset.color2}
        rotationSpeed={preset.rotationSpeed}
        cloudDensity={preset.cloudDensity}
        glowIntensity={preset.glowIntensity}
        contained={mode === "contained"}
      />
    </div>
  );
}
