"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PARTNERS } from "@/content/partners";
import styles from "./partners.module.css";

/**
 * Partners and collaborations as an endless band of logo cards that drifts
 * on its own and can be taken in hand: dragged with a mouse, swiped on a
 * phone, scrolled with a trackpad, or stepped with the arrows. Hovering,
 * focusing or dragging stops the drift, and it carries on the instant the
 * cursor leaves: a pause after hover reads as a stall. After a swipe or an
 * arrow press the drift takes over as soon as the glide has slowed to its
 * own speed, so the two motions blend instead of stopping in between. With
 * reduced motion it never drifts at all; dragging and the arrows still work.
 *
 * Embla does the looping and the momentum. Logos rest in grey for cohesion
 * and take their true colours on hover. Shared by the home page and the
 * About page, so the two never drift apart in the other sense.
 */
/** Pixels per frame: about 36 px a second, slow enough to read every logo. */
const DRIFT_SPEED = 0.6;

export function PartnerLogos() {
  const [plugins] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? []
      : [
          AutoScroll({
            speed: DRIFT_SPEED,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
          }),
        ],
  );
  const [viewportRef, embla] = useEmblaCarousel(
    { loop: true, dragFree: true, align: "start" },
    plugins,
  );

  /* Who is holding the band. The plugin pauses on hover and on focus by
     itself; these only stop the hand-off below from overruling it. */
  const held = useRef({ hover: false, focus: false, pointer: false });

  /* The plugin resumes after a glide only on Embla's "settle", which waits
     out an invisible sub-pixel tail and left the band frozen for about two
     seconds after every arrow press or swipe. Instead, hand back to the
     drift the moment the glide has slowed to the drift's own speed.

     The hand-off arms only once a glide is actually under way (or a finger
     has just let go): an arrow press reports one scroll before its glide
     builds up speed, and handing back on that cancelled the glide. */
  useEffect(() => {
    if (!embla) return;
    const drift = embla.plugins().autoScroll;
    if (!drift) return;
    const engine = embla.internalEngine();
    let armed = false;
    const handOff = () => {
      if (drift.isPlaying()) {
        armed = false;
        return;
      }
      const { hover, focus, pointer } = held.current;
      if (hover || focus || pointer) return;
      if (Math.abs(engine.scrollBody.velocity()) > DRIFT_SPEED) armed = true;
      else if (armed) {
        armed = false;
        drift.play(0);
      }
    };
    const down = () => {
      held.current.pointer = true;
    };
    const up = () => {
      held.current.pointer = false;
      armed = true;
    };
    embla.on("scroll", handOff).on("pointerDown", down).on("pointerUp", up);
    return () => {
      embla.off("scroll", handOff).off("pointerDown", down).off("pointerUp", up);
    };
  }, [embla]);

  /* An arrow press stops the drift for its own glide; the hand-off above
     picks the drift up again as the glide slows. */
  const step = useCallback(
    (direction: -1 | 1) => {
      if (!embla) return;
      embla.plugins().autoScroll?.stop();
      if (direction > 0) embla.scrollNext();
      else embla.scrollPrev();
    },
    [embla],
  );

  return (
    <div className={styles.carousel}>
      <div
        className={styles.viewport}
        ref={viewportRef}
        onMouseEnter={() => (held.current.hover = true)}
        onMouseLeave={() => (held.current.hover = false)}
        onFocus={() => (held.current.focus = true)}
        onBlur={() => (held.current.focus = false)}
      >
        <ul className={styles.track}>
          {PARTNERS.map((partner) => (
            <li key={partner.name} className={styles.slide}>
              <a
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card}
                draggable={false}
              >
                <span className={styles.logo}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={{ height: partner.height }}
                    draggable={false}
                  />
                  {partner.wordmark ? (
                    <span className={styles.wordmark} aria-hidden="true">
                      {partner.wordmark}
                    </span>
                  ) : null}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => step(-1)}
        aria-label="Previous partners"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => step(1)}
        aria-label="Next partners"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
