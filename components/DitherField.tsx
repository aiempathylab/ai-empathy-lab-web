"use client";

import { useEffect, useRef } from "react";
import { BAYER8, createProgram, tokenRGB } from "@/lib/dither";
import { isLowPower } from "@/lib/lowPower";
import styles from "./DitherArt.module.css";

/**
 * Abstract moving pictures in the site's squares, drawn with WebGL in the
 * same two-shade ordered dither as DitherArt:
 *   bars     a benchmark's bars, re-ranking non-stop (the Index): a new
 *            edition every couple of seconds, taken bar by bar from the
 *            left, and every bar breathing a little in between
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
export type FieldScene = "bars" | "ripples" | "voice";

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform float uCell;
uniform float uTime;
uniform int uScene;
uniform float uBars[9];
uniform float uPlay;
uniform vec3 uInk;
uniform vec3 uMid;
out vec4 o;
${BAYER8}

float bars(vec2 uv) {
  float slot = uv.x * 9.0;
  float f = fract(slot);
  if (f < 0.14 || f > 0.86) return 0.0;
  float h = uBars[int(min(floor(slot), 8.0))];
  if (uv.y > h) return 0.0;
  return 0.42 + 0.58 * smoothstep(0.0, 1.0, uv.y / max(h, 0.001));
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
  float v = uScene == 0 ? bars(uv) : (uScene == 1 ? ripples(center, uTime) : voice(uv));
  float level = min(floor(v * 2.0 + bayer8(idx)), 2.0);
  vec2 local = frag - idx * uCell;
  float gap = uCell * 0.16;
  bool inside = all(greaterThanEqual(local, vec2(gap))) && all(lessThan(local, vec2(uCell - gap)));
  if (level < 1.0 || !inside) { o = vec4(0.0); return; }
  o = vec4(level > 1.5 ? uInk : uMid, 1.0);
}`;

const SCENE_ID: Record<FieldScene, number> = { bars: 0, ripples: 1, voice: 2 };
const PALETTES = {
  indigo: ["--ael-indigo-700", "--ael-indigo-400"],
  iris: ["--ael-iris-600", "--ael-iris-400"],
} as const;

/** Editions of a benchmark: the bars rise into the first, then trade
 *  heights from one edition to the next, without a pause. */
const RANKINGS = [
  [0.94, 0.86, 0.79, 0.71, 0.62, 0.55, 0.47, 0.38, 0.3],
  [0.9, 0.91, 0.7, 0.8, 0.52, 0.64, 0.5, 0.33, 0.37],
  [0.82, 0.95, 0.76, 0.68, 0.7, 0.49, 0.58, 0.41, 0.29],
  [0.96, 0.8, 0.84, 0.62, 0.66, 0.57, 0.4, 0.45, 0.34],
  [0.86, 0.88, 0.9, 0.58, 0.72, 0.6, 0.54, 0.36, 0.42],
  [0.92, 0.84, 0.74, 0.77, 0.58, 0.68, 0.44, 0.5, 0.31],
];
const EDITION_S = 1.9;
/** each bar takes the new edition this long after the one to its left */
const STAGGER_S = 0.09;
/** one lap of the listening window along the sentence */
const SWEEP_S = 3.6;

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
    const heights = new Float32Array(9);
    const velocity = new Float32Array(9);
    const shown = new Float32Array(9);
    if (reduce) {
      heights.set(RANKINGS[0]);
      shown.set(RANKINGS[0]);
    }

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
      gl.uniform1f(u("uCell"), cell * dpr);
      gl.uniform1f(u("uTime"), 0.9 + clock);
      gl.uniform1fv(u("uBars"), shown);
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
      if (scene === "bars") {
        for (let i = 0; i < 9; i++) {
          /* each bar takes the next edition a beat after its neighbour, so
             a wave of change keeps running across the chart */
          const t = clock - i * STAGGER_S;
          if (t < 0) continue;
          const target = RANKINGS[Math.floor(t / EDITION_S) % RANKINGS.length][i];
          /* a spring with a hair of overshoot, the site's chip feel */
          velocity[i] += (120 * (target - heights[i]) - 17 * velocity[i]) * dt;
          heights[i] += velocity[i] * dt;
          /* and a small breath of its own, so no bar is ever quite still */
          shown[i] = Math.max(0, heights[i] * (1 + 0.035 * Math.sin(clock * 2.3 + i * 0.9)));
        }
      }
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

  return (
    <div ref={wrapRef} className={`${styles.art} ${styles.field} ${className ?? ""}`} aria-hidden="true" data-state="init">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
