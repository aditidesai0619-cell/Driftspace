"use client";

interface Props {
  size?: number;
  label?: string;
}

export default function NebulaSpinner({ size = 48, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[#64ffda]/20 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full border-2 border-t-[#64ffda] border-transparent animate-spin"
          style={{
            inset: 4,
            animationDuration: "2s",
            animationDirection: "reverse",
          }}
        />
        {/* Inner glow */}
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: "#64ffda",
            boxShadow: "0 0 12px #64ffda, 0 0 24px rgba(100,255,218,0.4)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />
      </div>
      {label && (
        <p className="text-sm" style={{ color: "#8892b0" }}>
          {label}
        </p>
      )}
    </div>
  );
}
