import { PublicationsJsonLd } from "@/components/JsonLd";
import { PublicationCard } from "@/components/PublicationCard";
import { PublicationItem } from "@/components/PublicationItem";
import {
  ALL_PUBLICATIONS,
  SELECTED_PUBLICATIONS,
  WORKING_PAPERS,
} from "@/content/publications";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "AI Empathy Publications & Papers | AI Empathy Lab",
  description:
    "Read research on empathic AI, voice assistants, consumer behavior, sustainable choice, service failures, AI companions, and emotion measurement.",
  path: "/publications/",
});

export default function PublicationsPage() {
  return (
    <div className="container">
      <PublicationsJsonLd publications={ALL_PUBLICATIONS} />
      <header className="page-hero">
        <div className="hero-split">
          <h1 className="t-h1">
            Publications on AI Empathy and Human-AI Interaction
          </h1>
          <p className="t-lead">
            Explore peer-reviewed articles, conference papers, working papers,
            and book chapters from AI Empathy Lab researchers. Our publications
            cover empathic AI, voice assistants, consumer behavior, sustainable
            choice, service failures, AI companions, anthropomorphism, and
            emotion measurement.
          </p>
        </div>
      </header>

      <section className="band" data-reveal>
        <div className="section-head">
          <div>
            <h2 className="t-h2">Latest on AI empathy</h2>
          </div>
        </div>
        <div className={styles.paperGrid}>
          {WORKING_PAPERS.map((paper) => (
            <PublicationCard key={paper.id} publication={paper} />
          ))}
        </div>
      </section>

      <section className="band band-rule" data-reveal>
        <div className="section-head">
          <div>
            <h2 className="t-h2">Selected publications</h2>
          </div>
        </div>
        <div>
          {SELECTED_PUBLICATIONS.map((publication) => (
            <PublicationItem key={publication.id} publication={publication} />
          ))}
        </div>
      </section>
    </div>
  );
}
