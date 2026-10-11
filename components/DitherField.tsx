"use client";

import { useEffect, useRef } from "react";
import { BAYER8, createProgram, tokenRGB } from "@/lib/dither";
import { isLowPower } from "@/lib/lowPower";
import styles from "./DitherArt.module.css";

/**
 * Abstract moving pictures in the site's squares, drawn with WebGL in the
 * same two-shade ordered dither as DitherArt:
 *   chat     a conversation (the research platform): the participant's
 *            messages on the left in the light shade, the agent's replies
 *            on the right in the dark, one arriving every couple of
 *            seconds while the older ones rise and dissolve
 *   ripples  waves from three voices meeting (the Symposium)
 *   voice    "I understand how you feel" as a waveform, a listening window
 *            travelling along it
 *
 * They loop for as long as they are on screen, and stop the moment they are
 * not, or the tab is hidden. Reduced motion draws one still frame. On weak
 * hardware (four or fewer cores, or 4 GB or less memory) they draw at 30
 * frames a second at 1x pixels. Without WebGL2 the field steps out of the
 * layout. Purely decorative, so hidden from assistive tech.
 */
export type FieldScene = "chat" | "ripples" | "voice";

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform float uCell;
uniform float uTime;
uniform int uScene;
uniform float uPlay;
uniform vec3 uInk;
uniform vec3 uMid;
out vec4 o;
${BAYER8}

float hash(float n) { return fract(sin(n * 12.9898 + 4.1) * 43758.5453); }
float chat(vec2 idx, float t) {
  vec2 grid = floor(uSize / uCell);
  // Each message takes seven rows: a bubble five squares tall and a gap.
  float slot = 7.0;
  float k = floor(t / 1.8);
  float e = 1.0 - pow(1.0 - clamp(fract(t / 1.8) / 0.3, 0.0, 1.0), 3.0);
  // Rows counted up from the bottom, the newest message easing in from below.
  float y = grid.y - 2.0 - idx.y + (1.0 - e) * slot;
  if (y < 0.0) return 0.0;
  float j = floor(y / slot);
  float m = k - j;
  float ly = y - j * slot;
  if (ly >= 5.0) return 0.0;
  bool agent = mod(m, 2.0) > 0.5;
  float w = floor(grid.x * (agent ? 0.42 + 0.3 * hash(m) : 0.28 + 0.26 * hash(m)));
  float lx = idx.x - (agent ? grid.x - 2.0 - w : 2.0);
  if (lx < 0.0 || lx >= w) return 0.0;
  // Rounded corners: the four corner squares stay empty.
  if ((ly < 0.5 || ly > 3.5) && (lx < 0.5 || lx > w - 1.5)) return 0.0;
  // A line of words knocked out of the middle row.
  if (abs(ly - 2.0) < 0.5 && lx > 1.5 && lx < w - 2.5) {
    float start = 2.0;
    for (int i = 0; i < 16; i++) {
      float len = 2.0 + floor(hash(m * 31.0 + float(i)) * 3.0);
      if (lx < start + len) break;
      if (lx < start + len + 1.0) return 0.0;
      start += len + 1.0;
    }
  }
  // The oldest messages dissolve as they reach the top.
  float fade = clamp(idx.y / 7.0, 0.0, 1.0);
  return (agent ? 1.0 : 0.5) * fade;
}
float ripples(vec2 p, float t) {
  vec2 s[3] = vec2[3](vec2(0.16, 0.58), vec2(0.5, 0.26), vec2(0.86, 0.66));
  float k = 6.2832 / (0.2 * uSize.y);
  float v = 0.0;
  for (int i = 0; i < 3; i++) {
    float r = distance(p, s[i] * uSize);
    v += cos(r * k - t * 2.4 - float(i) * 2.1) * exp(-r / (0.75 * uSize.x));
  }
  // Only the crests draw, so the waves read as rings, not as texture.
  return clamp(0.1 + 0.55 * max(v, 0.0), 0.0, 1.0);
}
float envelope(float x) {
  float lens[7] = float[7](1.2, 0.7, 0.6, 1.25, 1.1, 0.8, 1.6);
  float loud[7] = float[7](0.86, 0.58, 0.52, 1.0, 0.8, 0.66, 0.94);
  float pos = 0.03;
  float a = 0.0;
  for (int i = 0; i < 7; i++) {
    float len = lens[i] / 7.25 * 0.94;
    float u = (x - (pos + len * 0.5)) / (len * 0.62);
    if (abs(u) < 1.0) a = max(a, loud[i] * pow(0.5 + 0.5 * cos(3.14159 * u), 0.8));
    pos += len;
  }
  return a;
}
float voice(vec2 uv) {
  float d = abs(uv.y - 0.5) * 2.0;
  float amp = envelope(uv.x) * (0.72 + 0.28 * sin(uv.x * 150.0) * sin(uv.x * 41.0));
  if (d > amp) return d < 0.05 ? 0.34 : 0.0;
  // The whole sentence in the light shade, the part being heard in the dark.
  float w = exp(-pow((uv.x - uPlay) / 0.1, 2.0));
  return 0.44 + 0.56 * w * (1.0 - 0.5 * d / max(amp, 0.001));
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 idx = floor(frag / uCell);
  vec2 center = (idx + 0.5) * uCell;
  vec2 uv = vec2(center.x / uSize.x, 1.0 - center.y / uSize.y);
  float v = uScene == 0 ? chat(idx, uTime) : (uScene == 1 ? ripples(center, uTime) : voice(uv));
  float level = min(floor(v * 2.0 + bayer8(idx)), 2.0);
  vec2 local = frag - idx * uCell;
  // In whole pixels, so the squares keep their look at any zoom.
  float gap = uCell < 4.0 ? 0.0 : 1.0;
  bool inside = all(greaterThanEqual(local, vec2(gap))) && all(lessThan(local, vec2(uCell - gap)));
  if (level < 1.0 || !inside) { o = vec4(0.0); return; }
  o = vec4(level > 1.5 ? uInk : uMid, 1.0);
}`;

const SCENE_ID: Record<FieldScene, number> = { chat: 0, ripples: 1, voice: 2 };
const PALETTES = {
  indigo: ["--ael-indigo-700", "--ael-indigo-400"],
  iris: ["--ael-iris-600", "--ael-iris-400"],
} as const;

/** one lap of the listening window along the sentence */
const SWEEP_S = 3.6;

const FRAME = { position: "relative", width: "100%", height: "100%" } as const;
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

export function DitherField({
  scene,
  palette = "indigo",
  className,
  cell = 4,
}: {
  scene: FieldScene;
  palette?: keyof typeof PALETTES;
  className?: string;
  /** Square size in CSS pixels. */
  cell?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    const none = () => {
      wrap.dataset.state = "none";
    };
    if (!gl) return none();
    const prog = createProgram(gl, FRAG);
    if (!prog) return none();
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const [ink, mid] = PALETTES[palette];
    gl.uniform3f(u("uInk"), ...tokenRGB(ink));
    gl.uniform3f(u("uMid"), ...tokenRGB(mid));
    gl.uniform1i(u("uScene"), SCENE_ID[scene]);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const low = isLowPower();
    let dpr = 1;
    let raf = 0;
    let last = 0;
    let frame = 0;
    let clock = 0;
    let visible = false;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = low ? 1 : Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    const draw = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u("uSize"), canvas.width, canvas.height);
      gl.uniform1f(u("uCell"), Math.max(Math.round(cell * dpr), 2));
      gl.uniform1f(u("uTime"), 0.9 + clock);
      gl.uniform1f(u("uPlay"), reduce ? 0.5 : -0.2 + 1.4 * ((clock % SWEEP_S) / SWEEP_S));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const running = () => visible && !document.hidden && !reduce;
    const tick = (now: number) => {
      raf = 0;
      if (!running()) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      clock += dt;
      frame += 1;
      if (!low || frame % 2 === 0) draw();
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (running() && !raf) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      wake();
    });
    const onVisibility = () => wake();
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    draw();
    wrap.dataset.state = "live";
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(prog);
    };
  }, [scene, palette, cell]);

  /* The canvas fills an inner frame positioned inline, as in DitherArt, so
     it keeps to its box even when the stylesheet has not arrived. */
  return (
    <div
      ref={wrapRef}
      className={`${styles.art} ${styles.field} ${className ?? ""}`}
      style={{ overflow: "hidden" }}
      aria-hidden="true"
      data-state="init"
    >
      <div style={FRAME}>
        <canvas ref={canvasRef} className={styles.canvas} style={FILL} />
      </div>
    </div>
  );
}
