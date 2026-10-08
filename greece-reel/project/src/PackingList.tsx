// A packing-list card whose rows tick one after another, with a counter title. Use it to recap a set of items
// already shown; rows, title, colours and timing come from props.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "reelkit/frame";
import { springs } from "reelkit/kit";

export const packingTickFrames = (count: number, delay = 8, per = 6) => Array.from({ length: count }, (_, i) => delay + 6 + i * per);

export const PackingList: React.FC<{
  title: string;
  items: string[];
  hero: string;
  ink: string;
  card: string;
  accent: string;
  face: string;
  body: string;
  y: number;
  delay?: number;
  per?: number;
}> = ({ title, items, hero, ink, card, accent, face, body, y, delay = 0, per = 6 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const inn = spring({ frame: frame - delay, fps, config: springs.smooth });
  const ticks = packingTickFrames(items.length, delay, per);
  const box = width * 0.06;
  return (
    <div style={{ position: "absolute", left: width * 0.12, right: width * 0.12, top: y * height, direction: "rtl", background: card, borderRadius: width * 0.045, padding: `${width * 0.045}px ${width * 0.055}px`, boxShadow: "0 24px 70px rgba(0,0,0,.3)", opacity: Math.min(1, inn * 1.5), transform: `translateY(${(1 - inn) * height * 0.02}px) scale(${0.94 + 0.06 * inn})` }}>
      <div style={{ fontFamily: face, fontSize: width * 0.06, color: hero, marginBottom: width * 0.025, whiteSpace: "nowrap" }}>{title}</div>
      {items.map((it, i) => {
        const t = spring({ frame: frame - ticks[i], fps, config: springs.snappy });
        const done = frame >= ticks[i];
        return (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: width * 0.03, padding: `${width * 0.012}px 0`, opacity: interpolate(frame, [delay + i * 2, delay + i * 2 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
            <div style={{ width: box, height: box, flex: "none", borderRadius: box * 0.28, border: `${box * 0.09}px solid ${hero}`, background: done ? hero : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
              <svg width={box * 0.62} height={box * 0.62} viewBox="0 0 24 24" style={{ transform: `scale(${t})` }}>
                <path d="M4 12.5l5 5L20 6.5" fill="none" stroke={card} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontFamily: body, fontSize: width * 0.05, color: ink, whiteSpace: "nowrap", opacity: done ? 1 : 0.55 }}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};
