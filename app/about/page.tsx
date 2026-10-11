import Link from "next/link";
import { LabPageJsonLd } from "@/components/JsonLd";
import { PartnerLogos } from "@/components/PartnerLogos";
import { RESEARCH_PROJECTS } from "@/content/research";
import { SITE } from "@/content/site";
import { TEAM } from "@/content/team";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "About the AI Empathy Lab | Research & Mission",
  description:
    "Meet the international research group advancing AI empathy across consumer behavior, decision-making, human-AI relationships, and well-being.",
  path: "/about/",
});

/** A count as the facts panel writes it, "Nine". Counted from the data, so
 *  the panel stays true as people join: it said eight for a while after the
 *  team had grown to nine. */
const WORDS = ["None", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
function spelled(n: number): string {
  return WORDS[n] ?? String(n);
}

export default function AboutPage() {
  return (
    <div className="container">
      <LabPageJsonLd type="AboutPage" path="/about/" />
      <header className="page-hero">
        <div className="hero-split">
        <h1 className="t-h1">About the AI Empathy Lab</h1>
        <p className="t-lead">
          The AI Empathy Lab is an international experimental research group
          advancing the science and practice of AI empathy. We examine how
          empathic voice assistants, agents, and companions shape consumer
          behavior, decision-making, relationships, and well-being.
        </p>
        </div>
      </header>

      <section className="band rail-split" data-reveal>
        <div className="prose">
        <p>
          The AI Empathy Lab brings together researchers in marketing,
          psychology, behavioral science, and computer science to investigate
          how empathic AI, in the form of assistants, agents, and companions,
          shapes consumer behavior.
        </p>
        <p>
          Our approach is distinctly experimental, and our medium is the
          voice. We conduct controlled experiments with real, working AI
          agents and systematically manipulate the dimensions of their
          behavior that matter most: the empathy they express, the persuasive
          strategies they employ, and their capacity to remember.
        </p>
        <p>
          The Lab grew out of the AI Empathy Research Initiative, established
          in 2024 with the support of the University of Zurich and ETH Zurich.
          It has since evolved into an international research group bridging
          Europe and the Middle East, dedicated to advancing the science of AI
          empathy in consumer contexts.
        </p>
        <p>
          We envision AI agents that embody the key dimensions of human
          empathy: perspective-taking, emotional resonance, and prosocial
          motivation. We study when such agents benefit consumers and when
          they fall short. Informed by this evidence, we guide the design of
          smarter empathic agents that contribute more positively to society,
          for example, by adapting their empathy to the context.
        </p>
        <p>
          Our findings speak to three audiences. For managers, our work guides
          the design of more effective, human-centric AI experiences in
          retail, service, and healthcare. For policymakers, it builds the
          evidence base needed to assess AI&apos;s influence on personal
          choices and shape sensible regulation. For society, it illuminates
          both the promise and the perils of machines designed to understand
          how we feel.
        </p>
        </div>

        {/* Lab overview: the facts panel every academic about page carries
            (see aspirelab.io) — values verbatim from the lab's documents. */}
        <aside className={styles.facts} aria-label="Lab overview">
          <dl className={styles.factsList}>
            <div className={styles.fact}>
              <dt>Established</dt>
              <dd>2024, as the AI Empathy Research Initiative</dd>
            </div>
            <div className={styles.fact}>
              <dt>Origins</dt>
              <dd>University of Zurich and ETH Zurich</dd>
            </div>
            <div className={styles.fact}>
              <dt>Reach</dt>
              <dd>An international group bridging Europe and the Middle East</dd>
            </div>
            <div className={styles.fact}>
              <dt>Focus</dt>
              <dd>The science of AI empathy in consumer contexts</dd>
            </div>
            <div className={styles.fact}>
              <dt>Programmes</dt>
              <dd>{spelled(RESEARCH_PROJECTS.length)} research programmes, from agentic commerce to emotion measurement</dd>
            </div>
            <div className={styles.fact}>
              <dt>Team</dt>
              <dd>{spelled(TEAM.length)} researchers and technologists</dd>
            </div>
          </dl>
        </aside>
      </section>


      {/* The funding note: heading and sentence stacked on the reading
          column, then the funders across the full width — the same shape as
          the home page's news section. Splitting the head across the rails
          put a one-line heading opposite a five-line paragraph, which left a
          pocket under the heading and a gulf between the two.
          The section is a grid so its row gap owns the spacing: the reset
          zeroes margins on any classed <ul> at a specificity a module class
          cannot beat. */}
      <section className={`band ${styles.partners}`} data-reveal>
        <div className={styles.partnersHead}>
          <h2 className="t-h2">Partners and collaborations</h2>
          <p className={styles.support}>{SITE.support}</p>
        </div>
        <PartnerLogos />
      </section>

      {/* The closing call, held in a panel so the actions sit against
          something rather than floating in the right-hand margin. */}
      <section className="band band-rule" data-reveal>
        <div className={styles.collab}>
        <div className={styles.collabHead}>
          <h2 className="t-h2">Work with us</h2>
          <p className={styles.collabBody}>{SITE.collaborate}</p>
        </div>
        <div className={styles.collabActions}>
          <Link href="/contact/?topic=collaboration" className="btn btn-primary">
            Get in touch
          </Link>
        </div>
        </div>
      </section>
    </div>
  );
}
