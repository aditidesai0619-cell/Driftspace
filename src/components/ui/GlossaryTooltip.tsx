"use client";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getGlossaryTermById } from "@/lib/glossary";
import { useDriftspaceStore } from "@/lib/store";

interface Props {
  termId: string;
  children: React.ReactNode;
}

export default function GlossaryTooltip({ termId, children }: Props) {
  const term = getGlossaryTermById(termId);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setGlossaryModalTermId = useDriftspaceStore((s) => s.setGlossaryModalTermId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!term) return <>{children}</>;

  function computePosition() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.top, left: rect.left + rect.width / 2 });
  }

  function scheduleShow() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => {
      computePosition();
      setVisible(true);
    }, 200);
  }

  function scheduleHide() {
    if (showTimer.current) clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 300);
  }

  function cancelHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }

  function handleTap(e: React.MouseEvent) {
    e.preventDefault();
    if (visible) {
      setVisible(false);
    } else {
      computePosition();
      setVisible(true);
    }
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
        onClick={handleTap}
        style={{ borderBottom: "1px dashed #64ffda", cursor: "help" }}
      >
        {children}
      </span>

      {mounted && visible && createPortal(
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          className="fixed z-[300]"
          style={{
            top: coords.top,
            left: coords.left,
            transform: "translate(-50%, calc(-100% - 10px))",
            width: 280,
            maxWidth: "calc(100vw - 24px)",
            background: "rgba(5,5,16,0.95)",
            border: "1px solid rgba(100,255,218,0.2)",
            borderRadius: 10,
            padding: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            animation: "tooltipFadeIn 150ms ease",
          }}
        >
          <style>{`@keyframes tooltipFadeIn{from{opacity:0;transform:translate(-50%,calc(-100% - 4px))}to{opacity:1;transform:translate(-50%,calc(-100% - 10px))}}`}</style>
          <p
            className="mb-1.5"
            style={{ fontSize: 13, fontWeight: 500, color: "#64ffda", fontFamily: "Space Grotesk, sans-serif" }}
          >
            {term.term}
          </p>
          <p
            className="mb-2"
            style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.5, fontFamily: "Inter, sans-serif" }}
          >
            {term.oneLiner}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setVisible(false);
              setGlossaryModalTermId(term.id);
            }}
            className="hover:underline"
            style={{ fontSize: 11, color: "#64ffda", fontFamily: "Inter, sans-serif" }}
          >
            Learn more →
          </button>
        </div>,
        document.body
      )}
    </>
  );
}
