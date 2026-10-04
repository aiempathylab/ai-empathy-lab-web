import { ArrowUpRight, Mail } from "lucide-react";
import { explainerItems, QuestionList } from "@/components/QuestionRow";
import { EXPLAINERS } from "@/content/resources";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "AI Empathy Resources, Research & Definitions",
  description:
    "Explore research-based definitions, evidence, methods, and resources on AI empathy, emotional AI, voice agents, companions, and human-AI relationships.",
  path: "/resources/",
});

const PLATFORM_POINTS = [
  "Six AI providers behind one identical participant interface, so the service is never a confound.",
  "Voice prosody scores persisted with every message, as research data rather than telemetry.",
  "Emotion-triggered experimental manipulation, with every trigger firing logged as data.",
  "Recruitment-aware participant IDs, concurrency caps with a fair waiting queue, and consent gates.",
  "Daily drift monitoring that reports provider changes instead of silently substituting models mid-study.",
];

export default function ResourcesPage() {
  return (
    <div className="container">
      <header className="page-hero">
        <div className="hero-split">
        <h1 className="t-h1">AI Empathy Resources and Definitions</h1>
        <p className="t-lead">
          Explore research-based explanations of AI empathy, empathic AI,
          emotional AI, voice agents, AI companions, and human-AI
          relationships. These resources translate current evidence, research
          methods, and ethical questions into accessible guidance for
          researchers, practitioners, policymakers, and the public.
        </p>
        </div>
      </header>

      {/* Each explainer as the question it answers, in the same rows the
          research hub uses, with the answer itself as the summary so the
          list teaches something even to a reader who clicks nothing. */}
      <section className="band">
        <div className="section-head">
          <div>
            <h2 className="t-h2">Explainers</h2>
          </div>
        </div>
        <QuestionList items={explainerItems(EXPLAINERS)} />
      </section>

      <section className="band band-rule">
        <div className="rail-split">
          <div className={styles.platformIntro}>
            <h2 className="t-h2">
              Built for our experiments. Open to other research groups.
            </h2>
            <p className={styles.platformLede}>
              Every experiment we publish runs on infrastructure we built
              ourselves. Participants talk to a live, working AI agent, and
              every message and every emotion measurement is preserved for
              analysis. Research integrity comes first, so nothing about a
              live study&apos;s condition changes without a researcher
              deciding it.
            </p>
            <div className={styles.platformActions}>
              <a
                href={SITE.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                Open the platform <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <a href={`mailto:${SITE.email}`} className="link-arrow">
                <Mail size={16} aria-hidden="true" /> Ask about access
              </a>
            </div>
          </div>
          <ol className={styles.platformList}>
            {PLATFORM_POINTS.map((point, i) => (
              <li key={point} className={styles.platformPoint}>
                <span className={styles.platformNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
