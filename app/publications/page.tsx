import { PublicationsJsonLd } from "@/components/JsonLd";
import { Hero, Section } from "@/components/Page";
import { PublicationCard } from "@/components/PublicationCard";
import { PubTable } from "@/components/PubTable";
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
      <Hero
        title="Publications on AI Empathy and Human-AI Interaction"
        lede="Explore peer-reviewed articles, conference papers, working papers, and book chapters from AI Empathy Lab researchers. Our publications cover empathic AI, voice assistants, consumer behavior, sustainable choice, service failures, AI companions, anthropomorphism, and emotion measurement."
      />

      <Section layout="stacked" title="Latest on AI empathy">
        <div className={styles.paperGrid}>
          {WORKING_PAPERS.map((paper) => (
            <PublicationCard key={paper.id} publication={paper} />
          ))}
        </div>
      </Section>

      <Section layout="stacked" title="Selected publications">
        <PubTable publications={SELECTED_PUBLICATIONS} />
      </Section>
    </div>
  );
}
