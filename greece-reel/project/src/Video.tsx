import React from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "reelkit/frame";
import { Camera, Grain, Icon, SceneFrame, Vignette, font, springs } from "reelkit/kit";
import type { VideoProps } from "reelkit/kit";
import { ProductTag } from "./ProductTag";
import { PackingList } from "./PackingList";

const display = font("secularOne");
const body = font("assistant");
const palette = { hero: "#0B4FA8", ink: "#10233F", card: "#FFFFFF", accent: "#C9A24A", dim: "#5B6B82" };

// One whole Hebrew line that rises into place (no masks, no wrapping).
const Line: React.FC<{ text: string; delay: number; size: number; color: string; face: string; exitAt?: number }> = ({ text, delay, size, color, face, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: springs.smooth });
  const out = exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ direction: "rtl", whiteSpace: "nowrap", fontFamily: face, fontSize: size, lineHeight: 1.12, color, opacity: Math.min(1, s * 2) * out, transform: `translateY(${(1 - s) * height * 0.015}px)` }}>{text}</div>
  );
};

const TitleCard: React.FC<{ lines: string[]; kicker: React.ReactNode; y: number; exitAt?: number }> = ({ lines, kicker, y, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const s = spring({ frame, fps, config: springs.smooth });
  const out = exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y * height, display: "flex", flexDirection: "column", alignItems: "center", gap: width * 0.03, opacity: out }}>
      <div style={{ background: palette.card, borderRadius: width * 0.05, padding: `${width * 0.035}px ${width * 0.06}px`, boxShadow: "0 24px 70px rgba(0,0,0,.25)", display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1.12 - 0.12 * s})`, opacity: Math.min(1, s * 2) }}>
        {lines.map((l, i) => <Line key={l} text={l} delay={3 + i * 4} size={width * 0.105} color={palette.hero} face={display} />)}
      </div>
      <div style={{ opacity: interpolate(frame, [14, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [14, 24], [height * 0.012, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }}>{kicker}</div>
    </div>
  );
};

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width } = useVideoConfig();
  return (
    <div style={{ direction: "rtl", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: width * 0.02, background: palette.hero, color: palette.card, fontFamily: body, fontWeight: 800, fontSize: width * 0.056, padding: `${width * 0.014}px ${width * 0.04}px`, borderRadius: 999 }}>{children}</div>
  );
};

export const Video: React.FC<VideoProps> = ({ manifest, urls }) => {
  const { width } = useVideoConfig();
  const photo = manifest.scenes[0].userAssetKeys[0];
  const byId = (id: string) => manifest.scenes.find((s) => s.id === id)!;
  const [hook, top, bag, skirt, shoes, list, end] = ["hook", "top", "bag", "skirt", "shoes", "list", "end"].map(byId);

  // Content coordinates are fractions of the frame; the photo fills it anchored right so she sits centred.
  const camKeys = [
    { frame: 0, x: 0.5, y: 0.5, zoom: 1 },
    { frame: hook.startFrame + hook.durationFrames - 1, x: 0.5, y: 0.47, zoom: 1.08 },
    { frame: top.startFrame + 8, x: 0.53, y: 0.43, zoom: 2.1 },
    { frame: bag.startFrame + 8, x: 0.313, y: 0.6, zoom: 2.7 },
    { frame: skirt.startFrame + 8, x: 0.49, y: 0.7, zoom: 1.8 },
    { frame: shoes.startFrame + 7, x: 0.44, y: 0.8, zoom: 2.5 },
    { frame: list.startFrame + 10, x: 0.5, y: 0.5, zoom: 1 },
  ];

  const tag = (s: typeof top, index: string, label: string, dot: { x: number; y: number }, cardY: number) => (
    <SceneFrame key={s.id} from={s.startFrame} durationInFrames={s.durationFrames} enter="cut" exit="cut">
      <ProductTag index={index} label={label} dot={dot} cardY={cardY} delay={8} exitAt={s.durationFrames - 8} hero={palette.hero} ink={palette.ink} card={palette.card} accent={palette.accent} face={display} />
    </SceneFrame>
  );

  return (
    <AbsoluteFill style={{ background: "#0A3A7A" }}>
      <Camera keys={camKeys} drift={0.012} lead={14}>
        <Img src={urls[photo]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "100% 50%" }} />
      </Camera>

      <SceneFrame from={hook.startFrame} durationInFrames={hook.durationFrames} enter="cut" exit="cut">
        <TitleCard y={0.085} lines={["מה הייתי אורזת", "לחופשה ביוון?"]} exitAt={hook.durationFrames - 8} kicker={<Pill>לוק אחד · 4 פריטים</Pill>} />
      </SceneFrame>

      {tag(top, "01", "גופיית סריגה עם נצנצים", { x: 0.49, y: 0.51 }, 0.72)}
      {tag(bag, "02", "קלאץ' קלוע בזהב", { x: 0.5, y: 0.51 }, 0.7)}
      {tag(skirt, "03", "חצאית מקסי סרוגה תואמת", { x: 0.505, y: 0.545 }, 0.76)}
      {tag(shoes, "04", "סנדלי אצבע שחורים", { x: 0.478, y: 0.73 }, 0.52)}

      <SceneFrame from={list.startFrame} durationInFrames={list.durationFrames} enter="cut" exit="fade">
        <PackingList y={0.55} delay={6} per={6} title="4/4 במזוודה" items={["גופיית סריגה", "קלאץ' זהב", "חצאית מקסי", "סנדלי אצבע"]} hero={palette.hero} ink={palette.ink} card={palette.card} accent={palette.accent} face={display} body={body} />
      </SceneFrame>

      <SceneFrame from={end.startFrame} durationInFrames={end.durationFrames} enter="fade" exit="cut">
        <TitleCard y={0.085} lines={["הכל למכירה", "בעמוד"]} kicker={<Pill><span>שלחו הודעה לפרטים</span><Icon name="instagram" size={width * 0.05} color={palette.card} /></Pill>} />
      </SceneFrame>

      <Grain blend="multiply" opacity={0.05} />
      <Vignette strength={0.25} />
    </AbsoluteFill>
  );
};
