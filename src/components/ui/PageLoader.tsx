"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);
  const prevPath = useRef("");

  useEffect(() => {
    if (prevPath.current && prevPath.current !== pathname) {
      setAnimKey((k) => k + 1);
    }
    prevPath.current = pathname;
  }, [pathname]);

  if (!animKey) return null;

  return (
    <div
      key={animKey}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        pointerEvents: "none",
        background: "#64ffda",
        boxShadow: "0 0 10px rgba(100,255,218,0.7), 0 0 4px rgba(100,255,218,0.4)",
        transformOrigin: "left center",
        animation: "pageProgress 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
      }}
    >
      <style>{`
        @keyframes pageProgress {
          0%   { transform: scaleX(0);    opacity: 1; }
          60%  { transform: scaleX(0.85); opacity: 1; }
          85%  { transform: scaleX(1);    opacity: 1; }
          100% { transform: scaleX(1);    opacity: 0; }
        }
      `}</style>
    </div>
  );
}
