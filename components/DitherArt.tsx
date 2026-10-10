"use client";

import { useEffect, useRef } from "react";
import type { ArtPiece } from "@/content/art";
import { BAYER8, createProgram, tokenRGB } from "@/lib/dither";
import { isLowPower } from "@/lib/lowPower";
import styles from "./DitherArt.module.css";

/**
 * An image the way a machine sees it: a grid of indigo squares in two
 * shades whose density follows the photograph's tones, in the ordered
 * (Bayer) pattern.
 *
 * The browser draws it from the piece's ink map with WebGL, so it can come
 * alive: the squares resolve in once it is in view, top first, in dither
 * order, and then a patch of squares twice as fine drifts slowly across it,
 * the machine looking closer. Under the pointer the patch follows the
 * pointer. It runs only while on screen with the tab visible; reduced
 * motion shows the finished image, weak hardware draws at 30 fps and 1x
 * pixels (where the patch cannot be finer, so it rests). Without
 * JavaScript or WebGL the pre-dithered still shows instead.
 */
const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTone;
uniform vec2 uSize;
uniform float uCell;
uniform float uTexH;
uniform float uReveal;
uniform vec3 uLens;
uniform float uLensR;
uniform vec3 uInk;
uniform vec3 uMid;
out vec4 o;
${BAYER8}
void main() {
  vec2 frag = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 coarse = floor(frag / uCell);
  bool fine = uCell >= 4.0 && uLens.z > 0.001 && distance((coarse + 0.5) * uCell, uLens.xy) < uLensR * uLens.z;
  float cell = fine ? uCell * 0.5 : uCell;
  vec2 idx = floor(frag / cell);
  vec2 center = (idx + 0.5) * cell;
  vec4 s = textureLod(uTone, center / uSize, max(0.0, log2(cell / uSize.y * uTexH)));
  float th = bayer8(idx);
  float appear = 0.6 * (center.y / uSize.y) + 0.4 * th;
  vec2 local = frag - idx * cell;
  float gap = cell * 0.16;
  bool inside = all(greaterThanEqual(local, vec2(gap))) && all(lessThan(local, vec2(cell - gap)));
  // Ordered dithering to three levels: no square, a light one, a dark one.
  float level = min(floor(s.r * 2.0 + th), 2.0);
  if (s.a < 0.5 || level < 1.0 || uReveal < appear || !inside) { o = vec4(0.0); return; }
  o = vec4(level > 1.5 ? uInk : uMid, 1.0);
}`;

/** The brand's own curve, --ael-ease: cubic-bezier(.25, .5, .25, 1). */
function brandEase(p: number): number {
  const [x1, y1, x2, y2] = [0.25, 0.5, 0.25, 1];
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let s = p;
  for (let i = 0; i < 8; i++) {
    const d = (3 * ax * s + 2 * bx) * s + cx;
    if (Math.abs(d) < 1e-6) break;
    s -= (((ax * s + bx) * s + cx) * s - p) / d;
  }
  return ((ay * s + by) * s + cy) * s;
}

export function DitherArt({
  piece,
  className,
  cell = 3,
  lensRadius = 72,
}: {
  piece: ArtPiece;
  className?: string;
  /** Square size in CSS pixels. Under the pointer they halve, where the
   *  screen has the pixels for it (a 2x display at the default size). */
  cell?: number;
  lensRadius?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    const fallback = () => {
      wrap.dataset.state = "still";
    };
    if (!gl) return fallback();

    const prog = createProgram(gl, FRAG);
    if (!prog) return fallback();
    const u = (name: string) => gl.getUniformLocation(prog, name);
    gl.uniform3f(u("uInk"), ...tokenRGB("--ael-indigo-700"));
    gl.uniform3f(u("uMid"), ...tokenRGB("--ael-indigo-400"));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const low = isLowPower();
    let dpr = 1;
    let visible = false;
    let over = false;
    let clock = 0;
    let frame = 0;
    let texH = 1;
    let ready = false;
    let reveal = reduce ? 1 : 0;
    let revealFrom = -1;
    let lens = 0, lensTo = 0;
    let lx = 0, ly = 0, tx = 0, ty = 0;
    let raf = 0;
    let last = 0;
    let tex: WebGLTexture | null = null;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = low ? 1 : Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    const draw = () => {
      if (!ready) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u("uSize"), canvas.width, canvas.height);
      gl.uniform1f(u("uCell"), cell * dpr);
      gl.uniform1f(u("uTexH"), texH);
      gl.uniform1f(u("uReveal"), reveal);
      gl.uniform3f(u("uLens"), lx, ly, lens);
      gl.uniform1f(u("uLensR"), lensRadius * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    /* The finer patch needs at least 4 device pixels per square to halve. */
    const canWander = () => !reduce && cell * dpr >= 4;
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      clock += dt;
      if (revealFrom >= 0 && reveal < 1) reveal = brandEase(Math.min(1, (now - revealFrom) / 1600));
      const wander = canWander() && reveal >= 1 && !over;
      if (wander) {
        /* a slow Lissajous drift, never twice the same path in a minute */
        tx = canvas.width * (0.5 + 0.3 * Math.sin(clock * 0.33));
        ty = canvas.height * (0.45 + 0.3 * Math.sin(clock * 0.21 + 1.1));
        lensTo = 0.85;
      }
      const k = 1 - Math.exp(-dt * (wander ? 3 : 12));
      lens += (lensTo - lens) * k;
      lx += (tx - lx) * k;
      ly += (ty - ly) * k;
      frame += 1;
      if (!low || frame % 2 === 0) draw();
      const busy = (revealFrom >= 0 && reveal < 1) || canWander() || Math.abs(lensTo - lens) > 0.002 || Math.hypot(tx - lx, ty - ly) > 0.5;
      if (busy) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /* Listened for on the window, not the image: in the hero the text
       layer lies over it and would swallow the pointer. The lens is on
       while the pointer is over the image itself. */
    const onMove = (e: PointerEvent) => {
      if (reduce || !ready) return;
      const rect = wrap.getBoundingClientRect();
      over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!over) {
        if (lensTo !== 0 && !canWander()) {
          lensTo = 0;
          kick();
        }
        return;
      }
      tx = (e.clientX - rect.left) * dpr;
      ty = (e.clientY - rect.top) * dpr;
      if (lensTo === 0 && lens < 0.01) {
        lx = tx;
        ly = ty;
      }
      lensTo = 1;
      kick();
    };
    const onLeave = () => {
      over = false;
      lensTo = 0;
      kick();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    /* A lost context (GPU reset, too many canvases) falls back to the
       still rather than leaving an empty box. */
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      fallback();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);
    /* Reveal once on first sight; after that, run only while on screen. */
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((en) => en.isIntersecting);
        if (visible && revealFrom < 0) revealFrom = performance.now();
        if (visible) kick();
      },
      { threshold: 0.15 },
    );
    const onVisibility = () => kick();
    document.addEventListener("visibilitychange", onVisibility);

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(u("uTone"), 0);
      texH = img.naturalHeight;
      ready = true;
      wrap.dataset.state = "live";
      resize();
      if (reduce) draw();
      io.observe(wrap);
    };
    img.onerror = fallback;
    img.src = piece.tone;

    return () => {
      /* An image still loading would otherwise wake this run back up
         after it ended, drawing with a program that is gone. */
      img.onload = img.onerror = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
      /* The context itself is never thrown away here: a canvas owns
         exactly one, and React runs effects twice in development, so a
         lost context would be all the second run ever got. */
    };
  }, [piece.tone, cell, lensRadius]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.art} ${className ?? ""}`}
      style={{ aspectRatio: String(piece.ratio) }}
      data-state="init"
    >
      <img src={piece.still} alt={piece.alt} className={styles.still} draggable={false} />
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
