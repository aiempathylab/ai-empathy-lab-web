"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import type { Film, FilmSource } from "@/content/films";
import styles from "./FilmPlayer.module.css";

/** The frame's width on the page, for the poster's srcset: the container's
 *  content width, 1264px at most. */
const SIZES = "(max-width: 1344px) 92vw, 1264px";

/**
 * The file this browser plays best at the size it will show. AV1 first,
 * then HEVC, which every Apple device decodes in hardware, then H.264,
 * which plays anywhere. 1080 only where the frame has the pixels for it:
 * a phone gets 720, a desktop 1080.
 */
function pick(video: HTMLVideoElement, sources: FilmSource[]): FilmSource {
  const width = video.getBoundingClientRect().width;
  const want = width * Math.min(window.devicePixelRatio || 1, 2) > 1400 ? 1080 : 720;
  for (const codec of ["av1", "hevc", "h264"] as const) {
    const playable = sources.filter((s) => s.codec === codec && video.canPlayType(s.type) !== "");
    if (playable.length) return playable.find((s) => s.height === want) ?? playable[0];
  }
  return sources[sources.length - 1];
}

/**
 * A film on the page, in the site's own furniture.
 *
 * It does not autoplay. The film is explanation, not decoration, and a page
 * that starts moving on its own is a page a reader has to deal with before
 * they can read it. Nothing is downloaded until somebody shows they mean to
 * watch: until then the page carries a poster of a few kilobytes, and the
 * film starts arriving when the pointer reaches the button (or a finger
 * touches it), a moment before the click, so it starts at once.
 *
 * The score is part of the film, so it plays with sound. Nothing starts it
 * but a click, so no sound ever arrives unasked. Once it runs, the
 * browser's own controls take over.
 */
export function FilmPlayer({ film }: { film: Film }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "starting" | "running">("idle");

  const prime = () => {
    const video = ref.current;
    if (!video || video.getAttribute("src")) return;
    video.src = pick(video, film.sources).src;
    video.preload = "auto";
  };
  const start = () => {
    const video = ref.current;
    if (!video) return;
    prime();
    setState("starting");
    video.play().catch(() => setState("idle"));
  };

  const avif = film.posterWidths.map((w) => `${film.poster}-${w}.avif ${w}w`).join(", ");
  const jpg = film.posterWidths.map((w) => `${film.poster}-${w}.jpg ${w}w`).join(", ");

  return (
    <figure className={styles.wrap}>
      <div className={styles.frame}>
        <video
          ref={ref}
          className={styles.video}
          preload="none"
          playsInline
          controls={state === "running"}
          aria-label={film.name}
          onPlaying={() => setState("running")}
        />
        {/* The poster stays over the frame until the film's first picture
            is on screen, so the start never flashes an empty box. */}
        {state !== "running" ? (
          <picture className={styles.poster}>
            <source type="image/avif" srcSet={avif} sizes={SIZES} />
            <img
              src={`${film.poster}-1280.jpg`}
              srcSet={jpg}
              sizes={SIZES}
              alt=""
              width={1920}
              height={1080}
              decoding="async"
            />
          </picture>
        ) : null}
        {state !== "running" ? (
          <button
            type="button"
            className={styles.play}
            onPointerEnter={prime}
            onPointerDown={prime}
            onFocus={prime}
            onClick={start}
            aria-label={`Play the film, ${film.seconds} seconds`}
            aria-busy={state === "starting"}
          >
            <span className={styles.pill}>
              <span className={styles.disc} data-starting={state === "starting" || undefined}>
                <Play size={18} aria-hidden="true" />
              </span>
              <span className={styles.label}>Watch, {film.seconds} seconds</span>
            </span>
          </button>
        ) : null}
      </div>
    </figure>
  );
}
