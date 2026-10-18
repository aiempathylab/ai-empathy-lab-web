import type { ReactNode } from "react";
import styles from "./Page.module.css";

/**
 * A page opening: the headline on the left half, the lede on the right. A
 * programme's question, or a line of context, goes above the lede as the
 * subtitle; `eyebrow` sits above the whole row (a "Coming soon" chip).
 * The headline and lede take their type from `.page-hero` in globals.css, so
 * every opening on the site, this one included, sets them alike.
 */
export function Hero({
  title,
  subtitle,
  lede,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  lede: string;
  eyebrow?: ReactNode;
  /** More text under the lede. */
  children?: ReactNode;
}) {
  return (
    <header className="page-hero">
      {eyebrow}
      <div className={styles.hero}>
        <h1 className="t-h1">{title}</h1>
        <div className={styles.heroText}>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          <p className="t-lead">{lede}</p>
          {children}
        </div>
      </div>
    </header>
  );
}

/**
 * A section, in one of two layouts.
 *  split:   the takeaway on the left half, the content on the right half.
 *  stacked: a header row (takeaway left, description right), then the content
 *           at full width. For tables, grids and anything wide.
 * With a `summary` the title becomes a small label and the summary the
 * display line, so a section can say what it concludes. Without one the title
 * is the display line. `left` holds extra content under the takeaway: a
 * figure, a diagram, key numbers. The left side is static.
 */
export function Section({
  id,
  title,
  summary,
  description,
  layout = "split",
  left,
  children,
}: {
  id?: string;
  title: string;
  summary?: string;
  /** Stacked only: a short paragraph on the right of the header row. */
  description?: ReactNode;
  layout?: "split" | "stacked";
  left?: ReactNode;
  children: ReactNode;
}) {
  const heading = (
    <div className={styles.left}>
      {summary ? (
        <>
          <h2 className={styles.kicker}>{title}</h2>
          <p className={styles.summary}>{summary}</p>
        </>
      ) : (
        <h2 className={styles.title}>{title}</h2>
      )}
      {left}
    </div>
  );
  if (layout === "stacked") {
    return (
      <section id={id} className={`band ${styles.section}`} data-reveal>
        <div className={styles.headRow}>
          {heading}
          {description ? <div className={styles.headRight}>{description}</div> : <div />}
        </div>
        {children}
      </section>
    );
  }
  return (
    <section id={id} className={`band ${styles.section} ${styles.split}`} data-reveal>
      {heading}
      <div className={styles.right}>{children}</div>
    </section>
  );
}

/** Vertical stack with the page's gap, for several blocks in one section. */
export function Stack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>;
}

/** Reading text: paragraphs at the body size, links underlined. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/** A short paragraph that introduces a section. */
export function Description({ children }: { children: ReactNode }) {
  return <p className={styles.description}>{children}</p>;
}

/** A picture held to the half it sits in. A wide one fills the half, a tall
 *  one is held to a height, from its width-over-height `ratio`. */
export function Figure({ children, ratio }: { children: ReactNode; ratio: number }) {
  return (
    <figure className={styles.figure} style={{ ["--ratio" as string]: ratio }}>
      {children}
    </figure>
  );
}

/** The closing call: the copy and its action on a tinted indigo panel. */
export function CtaPanel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <section className={styles.ctaSection} data-reveal>
      <div className={styles.cta}>
        <div className={styles.ctaCopy}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{children}</p>
        </div>
        <div className={styles.ctaAction}>{action}</div>
      </div>
    </section>
  );
}
