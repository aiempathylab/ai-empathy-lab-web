"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AppLoop, AppLoopFile } from "@/content/app-loops";
import styles from "./AppLoopPlayer.module.css";

/** 0:07 */
function clock(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * One shape of a film: the video, and a control bar under it.
 *
 * It starts by itself, muted, when it is about to be seen, and stops when it
 * has scrolled away, so nothing is downloaded or decoded that is not on screen.
 * It is a video and not a loop: it can be paused (the button, or a click on the
 * picture), and scrubbed, and a pause is kept: a film somebody paused does not
 * start again when they scroll back. For a reader who has asked their system
 * for less motion it does not start by itself at all.
 */
function Shape({
  file,
  name,
  className,
  phone,
}: {
  file: AppLoopFile;
  name: string;
  className: string;
  /** The phone-shaped one, shown on a narrow screen. */
  phone?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const keptPaused = useRef(false);
  const reduced = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(0);
  const [length, setLength] = useState(0);
  const [onShow, setOnShow] = useState(false);

  /* Both shapes of a film are in the page and CSS shows one, but a browser
     fetches a poster even for a video that is hidden. So a shape asks for its
     poster only once it is the one on show, and the other shape costs nothing.
     The breakpoint is the one in AppLoopPlayer.module.css. */
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 900px)");
    const update = () => {
      if (narrow.matches === Boolean(phone)) setOnShow(true);
    };
    update();
    narrow.addEventListener("change", update);
    return () => narrow.removeEventListener("change", update);
  }, [phone]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const watch = new IntersectionObserver(
      (entries) => {
        /* Several changes can arrive together; the last is how things stand. */
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          video.preload = "auto";
          if (!keptPaused.current && !reduced.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );
    watch.observe(video);
    return () => watch.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    video.preload = "auto";
    if (video.paused) {
      keptPaused.current = false;
      video.play().catch(() => {});
    } else {
      keptPaused.current = true;
      video.pause();
    }
  };

  return (
    <div className={`${styles.shape} ${className}`}>
      <video
        ref={ref}
        className={styles.video}
        style={{ aspectRatio: `${file.width} / ${file.height}` }}
        width={file.width}
        height={file.height}
        poster={onShow ? `${file.poster}-${file.width}.jpg` : undefined}
        preload="none"
        muted
        loop
        playsInline
        aria-label={name}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
        onTimeUpdate={(e) => setNow(e.currentTarget.currentTime)}
      >
        {file.sources.map((s) => (
          <source key={s.codec} src={s.src} type={s.type} />
        ))}
      </video>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.button}
          onClick={toggle}
          aria-label={`${playing ? "Pause" : "Play"}: ${name}`}
        >
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        </button>
        <input
          className={styles.scrub}
          type="range"
          min={0}
          max={1000}
          value={length ? Math.round((now / length) * 1000) : 0}
          onChange={(e) => {
            const video = ref.current;
            if (!video || !length) return;
            video.preload = "auto";
            video.currentTime = (Number(e.target.value) / 1000) * length;
            setNow(video.currentTime);
          }}
          /* The range is a thousand steps long, so an arrow key would move a
             fraction of a second: it moves five seconds, as in a video player. */
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            const video = ref.current;
            if (!video || !length) return;
            e.preventDefault();
            video.preload = "auto";
            video.currentTime = Math.min(length, Math.max(0, video.currentTime + (e.key === "ArrowRight" ? 5 : -5)));
            setNow(video.currentTime);
          }}
          aria-label={`Position in ${name}`}
          aria-valuetext={`${clock(now)} of ${clock(length)}`}
          style={{ ["--filled" as string]: `${length ? (now / length) * 100 : 0}%` }}
        />
        <span className={styles.time} aria-hidden="true">
          {clock(now)} / {clock(length)}
        </span>
      </div>
    </div>
  );
}

/**
 * A short silent film that shows the app in use, beside the text it explains.
 * Two shapes of it are on the page and CSS shows the one that fits: the
 * desktop shape fills the space it sits in, the mobile shape is a phone's own
 * proportions. Only the one shown is ever loaded or played. The words on
 * screen and what happens are in the page for anyone who cannot watch, and for
 * search and answer engines, which read them.
 */
export function AppLoopPlayer({ loop }: { loop: AppLoop }) {
  return (
    <figure className={styles.wrap}>
      <Shape file={loop.desktop} name={loop.name} className={styles.desktop} />
      <Shape file={loop.mobile} name={loop.name} className={styles.mobile} phone />
      <figcaption className="visually-hidden">
        {loop.description} {loop.transcript}
      </figcaption>
    </figure>
  );
}
