export default function SkeletonBriefing({
  streaming = false,
  streamChars = 0,
}: {
  streaming?: boolean;
  streamChars?: number;
}) {
  return (
    <div className="space-y-10 animate-pulse">
      {streaming && (
        <div className="flex items-center gap-2 text-xs" style={{ color: "#64ffda", fontFamily: "Inter" }}>
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#64ffda", animation: "ping 1s cubic-bezier(0,0,0.2,1) infinite" }}
          />
          Streaming… {streamChars > 0 && `(${streamChars.toLocaleString()} chars received)`}
        </div>
      )}

      {/* One-liner */}
      <div
        className="h-7 rounded-lg bg-white/5 w-3/4"
        style={{ borderLeft: "2px solid rgba(100,255,218,0.15)", paddingLeft: 20 }}
      />

      {/* Physics explained — 3 paragraph blocks */}
      <div className="space-y-2">
        {[1, 0.95, 1, 0.8, 1, 0.9, 1, 0.75, 1, 0.85].map((w, i) => (
          <div key={i} className="h-4 rounded bg-white/5" style={{ width: `${w * 100}%` }} />
        ))}
      </div>

      {/* Key stats — 5 cards */}
      <div>
        <div className="h-4 rounded bg-white/5 w-20 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 text-center space-y-2"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="h-6 rounded bg-white/5 w-16 mx-auto" />
              <div className="h-3 rounded bg-white/5 w-12 mx-auto" />
              <div className="h-3 rounded bg-white/5 w-14 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Unsolved mystery */}
      <div
        className="rounded-xl p-6 space-y-2"
        style={{ background: "rgba(123,47,255,0.04)", border: "1px solid rgba(123,47,255,0.12)" }}
      >
        <div className="h-4 rounded bg-white/5 w-1/3 mb-3" />
        <div className="h-4 rounded bg-white/5 w-full" />
        <div className="h-4 rounded bg-white/5 w-4/5" />
      </div>

      {/* Real missions */}
      <div>
        <div className="h-4 rounded bg-white/5 w-28 mb-4" />
        <div className="flex gap-4 overflow-x-hidden pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 rounded-xl p-4 space-y-2"
              style={{ width: 220, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="h-4 rounded bg-white/5 w-3/4" />
              <div className="h-3 rounded bg-white/5 w-1/2" />
              <div className="h-3 rounded bg-white/5 w-full" />
              <div className="h-3 rounded bg-white/5 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
