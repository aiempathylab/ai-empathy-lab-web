import { DitherArt } from "@/components/DitherArt";
import { ART } from "@/content/art";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "AI Empathy Symposium | Research, Ethics & Governance",
  description:
    "Join researchers, industry leaders, and policymakers examining the science, design, applications, ethics, and governance of empathic AI.",
  path: "/symposium/",
});

export default function SymposiumPage() {
  return (
    <>
      {/* The opening, on the home hero's own ground (its lavender gradient
          and grain) from edge to edge: the words on the main rails, and on
          the support rail the microphone that opened the site, a symposium
          being voices at a microphone, standing alone like a stage waiting
          for its speakers. */}
      <section className={styles.veil}>
        <div className="grain" aria-hidden="true" />
        <div className="container">
          <header className="page-hero">
            <div className={`rail-split ${styles.opening}`}>
              <div className="hero-split-left">
                <span className="chip chip-soon">Coming soon</span>
                <h1 className="t-h1">AI Empathy Symposium</h1>
                <div className="prose">
                  <p className="t-lead">
                    The AI Empathy Symposium will bring together researchers,
                    industry leaders, and policymakers to examine the science,
                    design, and governance of empathic AI.
                  </p>
                  <p>
                    Expect rigorous research, live demonstrations of empathic voice
                    agents, and honest conversations about where the line sits
                    between caring technology and emotional manipulation.
                  </p>
                  <p className={styles.tba}>Details and dates to be announced.</p>
                </div>
              </div>
              <DitherArt piece={ART.microphone} className={styles.mic} />
            </div>
          </header>
        </div>
      </section>

      <div className={`container ${styles.after}`}>
        {/* The call to register, as a quiet banner: the microphone is the
            page's one picture. */}
        <section className={styles.cta} data-reveal>
          <div className={styles.ctaText}>
            <h2 className="t-h2">Hear about it first</h2>
            <p className={styles.ctaBody}>
              Register your interest and we will write when dates are set.
            </p>
          </div>
          <a
            href={`mailto:${SITE.email}?subject=AI%20Empathy%20Symposium%3A%20keep%20me%20posted`}
            className="btn btn-primary btn-lg"
          >
            Register interest
          </a>
        </section>
      </div>
    </>
  );
}
