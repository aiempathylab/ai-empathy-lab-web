import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { OrgJsonLd } from "@/components/JsonLd";
import { Mark } from "@/components/Mark";
import { PublicationCard } from "@/components/PublicationCard";
import { projectItems, QuestionList } from "@/components/QuestionRow";
import { NewsList } from "@/components/NewsList";
import { PartnerLogos } from "@/components/PartnerLogos";
import { NEWS } from "@/content/news";
import { WORKING_PAPERS } from "@/content/publications";
import { RESEARCH_PROJECTS } from "@/content/research";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

/* The home page had no metadata of its own, so it inherited the layout's,
   which carries no `alternates` — leaving the site's most linked page as
   the only one without a canonical URL or an og:url. */
export const metadata = pageMetadata({
  title: "AI Empathy Lab | Research in Empathic Human-AI Interaction",
  description: SITE.description,
  path: "/",
});

function delay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

export default function HomePage() {
  return (
    <>
      <OrgJsonLd />

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`${styles.glow} ${styles.glowA}`} aria-hidden="true" />
        <div className={`${styles.glow} ${styles.glowB}`} aria-hidden="true" />
        <div className="grain" aria-hidden="true" />
        <Mark size={182} className={styles.heroMark} />
        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.heroTitle}>
            Making sense of machines that{" "}
            <span className="grad-text">make sense of us</span>
          </h1>
          <p className={styles.heroLede}>{SITE.heroLede}</p>
          {/* Two doors: what the lab studies, and the question a newcomer
              arrives with. The second used to repeat the navbar's
              Publications; now it is the home page's route into the
              explainers, which have no navbar slot of their own. */}
          <div className={styles.heroActions}>
            <Link href="/research/" className="btn btn-primary">
              Explore the research
            </Link>
            <Link href="/resources/what-is-ai-empathy/" className="btn btn-secondary">
              What is AI empathy?
            </Link>
          </div>
        </div>
      </section>

      {/* ── About teaser: heading column left, body column right — the
             split fills the measure with existing content only. ── */}
      <section className={`${styles.section} band-rule`}>
        <div className={`container ${styles.aboutSplit}`} data-reveal>
          <div className={styles.aboutHead}>
            <h2 className="t-h2">How we work</h2>
          </div>
          <div className="prose">
            <p className="t-lead">
              The AI Empathy Lab brings together a new generation of academics
              to investigate how empathic AI, in the form of assistants,
              agents, and companions, shapes consumer behavior.
            </p>
            <p>
              Our approach is distinctly experimental, and our medium is the
              voice. We conduct controlled experiments with real, working AI
              agents and systematically manipulate the dimensions of their
              behavior that matter most: the empathy they express, the
              persuasive strategies they employ, and their capacity to
              remember.
            </p>
            <p>
              <Link href="/about/" className="link-arrow">
                About the lab <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── The five questions ── */}
      <section className={styles.section}>
        <div className="container" data-reveal>
          <div className="section-head">
            <div>
              <h2 className="t-h2">Five questions we are answering</h2>
            </div>
            <Link href="/research/" className="link-arrow">
              Inside the research <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <QuestionList items={projectItems(RESEARCH_PROJECTS)} />
        </div>
      </section>


      {/* ── Latest working papers ── */}
      <section className={styles.section}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <h2 className="t-h2">Latest on AI empathy</h2>
            </div>
            <Link href="/publications/" className="link-arrow">
              All publications <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.paperGrid}>
            {WORKING_PAPERS.map((paper, index) => (
              <div key={paper.id} data-reveal style={delay(index * 80)}>
                <PublicationCard publication={paper} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Initiatives ── */}
      <section className={`${styles.section} band-rule`}>
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <h2 className="t-h2">What is coming</h2>
            </div>
          </div>
          <div className={styles.initGrid}>
            <div data-reveal>
              <Link href="/ai-empathy-index/" className={`${styles.initCard} ${styles.initIndigo}`}>
                <span className={styles.initChipRow}>
                  <span className="chip chip-accent">Coming soon</span>
                </span>
                <span className={styles.initTitle}>AI Empathy Index</span>
                <span className={styles.initBody}>
                  A recurring, research-grade benchmark of how empathic today&apos;s
                  AI assistants and companions really are.
                </span>
                <span className={styles.initGo}>
                  About the Index <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </div>
            <div data-reveal style={delay(90)}>
              <Link href="/symposium/" className={`${styles.initCard} ${styles.initIris}`}>
                <span className={styles.initChipRow}>
                  <span className="chip chip-iris">Coming soon</span>
                </span>
                <span className={styles.initTitle}>AI Empathy Symposium</span>
                <span className={styles.initBody}>
                  Researchers, industry leaders, and policymakers on the science,
                  design, and governance of empathic AI.
                </span>
                <span className={styles.initGo}>
                  About the Symposium <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── News ── */}
      <section className={`${styles.section} band-rule`}>
        <div className="container" data-reveal>
          <div className="section-head">
            <div>
              <h2 className="t-h2">Latest from the team</h2>
            </div>
            <Link href="/news/" className="link-arrow">
              All updates <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <NewsList items={NEWS.slice(0, 3)} />
        </div>
      </section>
      {/* ── Partners: the page's closing acknowledgment, the way a paper
             ends with its funding note. Same cells as the About page — one
             component, so the two can never drift. ── */}
      <section className={styles.partners}>
        <div className="container" data-reveal>
          <div className="section-head">
            <div>
              <h2 className="t-h2">Partners and collaborations</h2>
            </div>
          </div>
          <PartnerLogos />
        </div>
      </section>
    </>
  );
}
