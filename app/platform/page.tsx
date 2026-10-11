import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { FilmPlayer } from "@/components/FilmPlayer";
import { PlatformJsonLd } from "@/components/JsonLd";
import { FILMS } from "@/content/films";
import {
  PLATFORM_FORMATS,
  PLATFORM_LOOP,
  PLATFORM_POINTS,
} from "@/content/platform";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "The Research Platform for Empathic AI Experiments",
  description:
    "Our platform for AI empathy experiments: participants talk to a live AI voice agent, their voice is scored every turn, and a threshold can change the reply.",
  path: "/platform/",
});

export default function PlatformPage() {
  return (
    <div className="container">
      <PlatformJsonLd film={FILMS.platform} />
      <header className="page-hero">
        <div className="hero-split">
          <h1 className="t-h1">The research platform for empathic AI</h1>
          <p className="t-lead">
            Every experiment we publish runs on infrastructure we built
            ourselves. Participants talk to a live, working AI agent, the
            emotion in their voice is measured as they speak, and a
            threshold you set can change how the agent answers. Built for
            our own studies, and open to other research groups.
          </p>
        </div>
      </header>

      {/* The film first: it is the fastest way to understand the loop, and
          the page below it says the same things in words for anyone who
          would rather read than watch. */}
      <section className="band">
        <FilmPlayer film={FILMS.platform} />
      </section>

      <section className="band band-rule">
        <div className="section-head">
          <div>
            <h2 className="t-h2">What happens in one call</h2>
          </div>
        </div>
        <ol className={styles.loop}>
          {PLATFORM_LOOP.map((item, i) => (
            <li key={item.step} className={styles.loopStep}>
              <span className={styles.loopNum}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.loopHead}>{item.step}</h3>
              <p className={styles.loopBody}>{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="band band-rule">
        <div className="section-head">
          <div>
            <h2 className="t-h2">What you can run on it</h2>
          </div>
        </div>
        <ul className={styles.formatGrid}>
          {PLATFORM_FORMATS.map((format) => (
            <li key={format.title} className={styles.format}>
              <span className={styles.formatIcon} aria-hidden="true">
                <format.icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className={styles.formatTitle}>{format.title}</h3>
              <p className={styles.formatBody}>{format.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="band band-rule">
        <div className="rail-split">
          <div>
            <h2 className="t-h2">Built so the method survives the software</h2>
            <p className={styles.lede}>
              A study runs for weeks, and the services underneath it do not
              hold still for weeks. The platform is built so that nothing
              about a live condition changes unless a researcher decides it.
            </p>
          </div>
          <ol className={styles.points}>
            {PLATFORM_POINTS.map((point, i) => (
              <li key={point} className={styles.point}>
                <span className={styles.pointNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The closing call in the panel About's "Work with us" uses: the
          words on the reading rail, the actions in a column of their own. */}
      <section className="band band-rule">
        <div className={styles.cta}>
        <div className={styles.ctaHead}>
          <h2 className="t-h2">Run your study on it</h2>
          <p className={styles.ctaBody}>
            The platform is open to other research groups. Tell us what you
            want to run and we will tell you whether it fits.
          </p>
        </div>
        <div className={styles.ctaActions}>
          <a
            href={SITE.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            Open the platform <ArrowUpRight size={17} aria-hidden="true" />
          </a>
          <Link href="/contact/?topic=platform" className="link-arrow">
            <Mail size={16} aria-hidden="true" /> Ask about access
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
