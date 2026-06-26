"use client";
import { useState } from "react";
import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
} from "@/components/ui/mapcn-map-arc";
import type { MapArcDatum } from "@/components/ui/mapcn-map-arc";
import { getObservatoryById } from "@/lib/observatories";
import type { ObservatoryContribution } from "@/lib/topics";

interface ArcDatum extends MapArcDatum {
  observatoryId: string;
  year: number;
  instrument: string;
  finding: string;
}

interface Props {
  contributions: ObservatoryContribution[];
  topicName?: string;
}

// The sky anchor — a fixed "discovery target" above the equator
const SKY_TARGET: [number, number] = [0, 45];

export default function ObservatoryGlobeInner({ contributions }: Props) {
  const [hoveredArc, setHoveredArc] = useState<ArcDatum | null>(null);

  const arcs: ArcDatum[] = contributions
    .map((c, i) => {
      const obs = getObservatoryById(c.observatoryId);
      if (!obs || obs.status === "space") return null;
      return {
        id: `${c.observatoryId}-${i}`,
        from: [obs.longitude, obs.latitude] as [number, number],
        to: SKY_TARGET,
        observatoryId: c.observatoryId,
        year: c.year,
        instrument: c.instrument,
        finding: c.finding,
      };
    })
    .filter(Boolean) as ArcDatum[];

  const uniqueObsIds = Array.from(new Set(contributions.map((c) => c.observatoryId)));

  return (
    <div className="relative w-full" style={{ height: 440, borderRadius: 12, overflow: "hidden" }}>
      <Map
        theme="dark"
        projection={{ type: "globe" }}
        viewport={{ center: [0, 20] as [number, number], zoom: 1.2, bearing: 0, pitch: 0 }}
        className="w-full h-full"
      >
        <MapArc
          data={arcs}
          curvature={0.35}
          paint={{
            "line-color": "#64ffda",
            "line-width": 1.5,
            "line-opacity": 0.5,
          }}
          hoverPaint={{
            "line-opacity": 1,
            "line-width": 3,
            "line-color": "#64ffda",
          }}
          onHover={(e) => {
            setHoveredArc(e ? (e.arc as ArcDatum) : null);
          }}
        />

        {uniqueObsIds.map((id) => {
          const obs = getObservatoryById(id);
          if (!obs || obs.status === "space") return null;
          return (
            <MapMarker key={id} longitude={obs.longitude} latitude={obs.latitude}>
              <MarkerContent>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid #64ffda",
                    background: obs.status === "decommissioned" ? "#ef4444" : "#64ffda",
                    boxShadow: `0 0 8px ${obs.status === "decommissioned" ? "#ef4444" : "#64ffda"}`,
                    cursor: "pointer",
                  }}
                  title={obs.name}
                />
              </MarkerContent>
            </MapMarker>
          );
        })}
      </Map>

      {/* Hover tooltip */}
      {hoveredArc && (() => {
        const obs = getObservatoryById(hoveredArc.observatoryId);
        if (!obs) return null;
        return (
          <div
            className="absolute top-4 left-4 max-w-xs pointer-events-none z-10"
            style={{
              background: "rgba(10,10,31,0.95)",
              border: "1px solid rgba(100,255,218,0.2)",
              borderRadius: 8,
              padding: "12px 14px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#64ffda", fontFamily: "Space Grotesk" }}>{obs.name}</p>
            <p className="text-xs" style={{ color: "#8892b0" }}>{obs.country} · {hoveredArc.year}</p>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: "#fff" }}>{hoveredArc.finding}</p>
            <p className="text-xs mt-1" style={{ color: "#8892b0" }}>🔭 {hoveredArc.instrument}</p>
          </div>
        );
      })()}

      {/* Legend */}
      <div
        className="absolute bottom-4 right-4 text-xs"
        style={{
          background: "rgba(10,10,31,0.8)",
          border: "1px solid rgba(100,255,218,0.1)",
          borderRadius: 8,
          padding: "8px 12px",
          color: "#8892b0",
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#64ffda]" />
          <span>Active observatory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span>Decommissioned</span>
        </div>
      </div>
    </div>
  );
}
