"use client";
import dynamic from "next/dynamic";
import type { ObservatoryContribution } from "@/lib/topics";

const ObservatoryGlobeInner = dynamic(
  () => import("./ObservatoryGlobeInner"),
  { ssr: false, loading: () => (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 440, borderRadius: 12, background: "rgba(10,10,31,0.5)", border: "1px solid rgba(100,255,218,0.1)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#64ffda]/30 border-t-[#64ffda] animate-spin" />
        <p className="text-sm" style={{ color: "#8892b0" }}>Spinning up the globe…</p>
      </div>
    </div>
  )}
);

interface Props {
  contributions: ObservatoryContribution[];
  topicName: string;
}

export default function ObservatoryGlobe({ contributions, topicName }: Props) {
  return <ObservatoryGlobeInner contributions={contributions} topicName={topicName} />;
}
