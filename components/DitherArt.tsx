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
 * pointer. A piece with a video plays it instead, every frame dithered as
 * it arrives, starting on the frame its still shows. It has no patch, so
 * every square stays the same size and what happens is easy to follow. A
 * one-tone piece draws the dark indigo only, its density alone following
 * the image, which stays crisper at the finest squares.
 *
 * It all runs only while on screen with the tab visible. Reduced motion
 * shows the finished still image, weak hardware draws at 30 fps and 1x
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
uniform bool uOne;
out vec4 o;
${BAYER8}
void main() {
  vec2 frag = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 coarse = floor(frag / uCell);
  bool fine = uCell >= 4.0 && uLens.z > 0.001 && distance((coarse + 0.5) * uCell, uLens.xy) < uLensR * uLens.z;
  float cell = fine ? floor(uCell * 0.5) : uCell;
  vec2 idx = floor(frag / cell);
  vec2 center = (idx + 0.5) * cell;
  vec2 uv = center / uSize;
  float lod = max(0.0, log2(cell / uSize.y * uTexH));
  float th = bayer8(idx);
  float appear = 0.6 * (center.y / uSize.y) + 0.4 * th;
  vec2 local = frag - idx * cell;
  vec4 s = textureLod(uTone, uv, lod);
  // In whole pixels, so the look holds at any zoom or screen density: one
  // pixel of page on each side of a square, none for the finer patch's
  // squares or any under 4 pixels, which touch like a fine print's dots.
  float gap = fine || cell < 4.0 ? 0.0 : 1.0;
  bool inside = all(greaterThanEqual(local, vec2(gap))) && all(lessThan(local, vec2(cell - gap)));
  // Ordered dithering to three levels, no square, a light one, a dark one,
  // or for one tone to two, no square or a dark one.
  float level = uOne ? (s.r > th ? 2.0 : 0.0) : min(floor(s.r * 2.0 + th), 2.0);
  // An ink video has no alpha: where it is black there is no subject.
  if (s.a < 0.5 || s.r < 0.03 || level < 1.0 || uReveal < appear || !inside) { o = vec4(0.0); return; }
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

const FRAME = { position: "relative", width: "100%", height: "100%" } as const;
const FILL = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;

/** Seconds the squares take to dissolve at a video's end, and to resolve
 *  again on its first frame: the loop's seam, in the site's own motion. */
const SEAM_S = 0.6;

export function DitherArt({
  piece,
  className,
  cell = 3,
  lensRadius = 72,
}: {
  piece: ArtPiece;
  className?: string;
  /** Square size in CSS pixels, never under 2 screen pixels. Under the
   *  pointer they halve, where the screen has the pixels for it (a 2x
   *  display at the default size). */
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
    gl.uniform1i(u("uOne"), piece.oneTone ? 1 : 0);

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
    let video: HTMLVideoElement | null = null;
    let videoTime = -1;
    let seam = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      dpr = low ? 1 : Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };
    /* Squares in whole device pixels: at a zoom or screen density that
       is not a whole number, fractions would give some rows and columns a
       gap and others none, a mesh lighter than the picture. */
    const deviceCell = () => Math.max(Math.round(cell * dpr), 2);
    const draw = () => {
      if (!ready) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(u("uSize"), canvas.width, canvas.height);
      gl.uniform1f(u("uCell"), deviceCell());
      gl.uniform1f(u("uTexH"), texH);
      gl.uniform1f(u("uReveal"), Math.min(reveal, seam));
      gl.uniform3f(u("uLens"), lx, ly, lens);
      gl.uniform1f(u("uLensR"), lensRadius * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    /* The finer patch needs at least 4 device pixels per square to halve,
       and a moving picture shows none. */
    const patch = !piece.video;
    const canWander = () => patch && !reduce && deviceCell() >= 4;
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
      /* a new video frame becomes the ink map */
      if (video && video.readyState >= video.HAVE_CURRENT_DATA && video.currentTime !== videoTime) {
        upload(video);
        videoTime = video.currentTime;
        const edge = Math.min(videoTime, video.duration - videoTime) / SEAM_S;
        seam = brandEase(Math.max(0, Math.min(1, edge)));
      }
      frame += 1;
      if (!low || frame % 2 === 0) draw();
      const busy =
        (revealFrom >= 0 && reveal < 1) ||
        canWander() ||
        (video !== null && !video.paused) ||
        Math.abs(lensTo - lens) > 0.002 ||
        Math.hypot(tx - lx, ty - ly) > 0.5;
      if (busy) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const upload = (source: TexImageSource) => {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.generateMipmap(gl.TEXTURE_2D);
    };
    /* The video plays only while the piece is on screen with the tab
       visible, and waits paused otherwise. */
    const syncVideo = () => {
      if (!video) return;
      if (visible && !document.hidden) {
        video.play().then(kick, () => {});
      } else {
        video.pause();
      }
    };

    /* Listened for on the window, not the image: in the hero the text
       layer lies over it and would swallow the pointer. The lens is on
       while the pointer is over the image itself. */
    const onMove = (e: PointerEvent) => {
      if (reduce || !ready || !patch) return;
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
      video?.pause();
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
        syncVideo();
      },
      { threshold: 0.15 },
    );
    const onVisibility = () => {
      kick();
      syncVideo();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      tex = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      upload(img);
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
      if (piece.video && !reduce) {
        /* In the page, invisible, so every browser decodes it. It starts on
           the frame the still shows, so nothing jumps when it begins. */
        video = document.createElement("video");
        video.className = styles.source;
        Object.assign(video.style, { position: "absolute", width: "1px", height: "1px", opacity: "0", pointerEvents: "none" });
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("aria-hidden", "true");
        video.src = piece.video;
        video.currentTime = piece.videoStart ?? 0;
        wrap.appendChild(video);
      }
      io.observe(wrap);
    };
    img.onerror = fallback;
    /* Nothing is fetched until the piece is within a screen of being seen.
       A piece the page hides (the hero, below 900px) is never laid out, so
       it never comes near, and a phone does not download a film it would
       never show. */
    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        near.disconnect();
        img.src = piece.tone;
      },
      { rootMargin: "100% 0px" },
    );
    near.observe(wrap);

    return () => {
      near.disconnect();
      /* An image still loading would otherwise wake this run back up
         after it ended, drawing with a program that is gone. */
      img.onload = img.onerror = null;
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
      }
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
  }, [piece.tone, piece.video, piece.videoStart, piece.oneTone, cell, lensRadius]);

  /* The still and the canvas fill an inner frame positioned inline, not
     only from the stylesheet: a page whose styles arrived late, or a tab
     left open across a rebuild, otherwise showed the still at its own
     pixel size, several times the box. The box clips them for the same
     reason. The frame is separate because the box itself takes its
     position from the page (the hero's is absolute). */
  return (
    <div
      ref={wrapRef}
      className={`${styles.art} ${className ?? ""}`}
      style={{ aspectRatio: String(piece.ratio), overflow: "hidden" }}
      data-state="init"
    >
      <div style={FRAME}>
        <img src={piece.still} alt={piece.alt} className={styles.still} style={FILL} draggable={false} />
        <canvas ref={canvasRef} className={styles.canvas} style={FILL} aria-hidden="true" />
      </div>
    </div>
  );
}
