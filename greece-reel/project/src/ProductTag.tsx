// A shoppable-style product tag: a pulsing dot on the item, a short leader line, and a numbered label card.
// Use it over a photo to name one item at a time; all text, colours and positions come from props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "reelkit/frame";
import { springs } from "reelkit/kit";

export const ProductTag: React.FC<{
  index: string;
  label: string;
  dot: { x: number; y: number };
  cardY: number;
  hero: string;
  ink: string;
  card: string;
  accent: string;
  face: string;
  delay?: number;
  exitAt?: number;
  rtl?: boolean;
}> = ({ index, label, dot, cardY, hero, ink, card, accent, face, delay = 0, exitAt, rtl = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const f = frame - delay;
  const pop = spring({ frame: f, fps, config: springs.snappy });
  const cardIn = spring({ frame: f - 5, fps, config: springs.smooth });
  const out = exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ring = ((Math.max(f, 0) % 24) / 24);
  const dotPx = width * 0.034;
  const dx = dot.x * width;
  const dy = dot.y * height;
  const cy = cardY * height;
  const lineTop = Math.min(dy, cy);
  const lineLen = Math.abs(cy - dy) * interpolate(cardIn, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", left: dx - 1.5, top: cy > dy ? dy : cy + (Math.abs(cy - dy) - lineLen), width: 3, height: lineLen, background: card, opacity: 0.9, boxShadow: "0 0 8px rgba(0,0,0,.35)" }} data-top={lineTop} />
      <div style={{ position: "absolute", left: dx - dotPx * 1.6, top: dy - dotPx * 1.6, width: dotPx * 3.2, height: dotPx * 3.2, borderRadius: "50%", border: `3px solid ${card}`, opacity: pop * (1 - ring) * 0.9, transform: `scale(${0.4 + ring * 0.6})` }} />
      <div style={{ position: "absolute", left: dx - dotPx / 2, top: dy - dotPx / 2, width: dotPx, height: dotPx, borderRadius: "50%", background: card, border: `${dotPx * 0.22}px solid ${hero}`, boxSizing: "border-box", transform: `scale(${pop})`, boxShadow: "0 4px 14px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: cy, display: "flex", justifyContent: "center", opacity: Math.min(1, cardIn * 1.6), transform: `translateY(${(1 - cardIn) * height * 0.018}px) scale(${0.92 + 0.08 * cardIn})` }}>
        <div style={{ direction: rtl ? "rtl" : "ltr", display: "flex", alignItems: "center", gap: width * 0.028, background: card, padding: `${width * 0.022}px ${width * 0.036}px`, borderRadius: width * 0.04, boxShadow: "0 18px 50px rgba(0,0,0,.28)", whiteSpace: "nowrap" }}>
          <div style={{ direction: "ltr", fontFamily: face, fontSize: width * 0.042, color: card, background: hero, width: width * 0.085, height: width * 0.085, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{index}</div>
          <div style={{ fontFamily: face, fontSize: width * 0.062, color: ink, lineHeight: 1.1 }}>{label}</div>
          <div style={{ width: width * 0.012, height: width * 0.07, borderRadius: 99, background: accent }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
