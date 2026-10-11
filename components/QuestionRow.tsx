import {
  ArrowRight,
  AudioWaveform,
  HeartHandshake,
  Headset,
  Leaf,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ResearchProject } from "@/content/research";
import type { Explainer } from "@/content/resources";
import styles from "./cards.module.css";

export interface QuestionItem {
  href: string;
  /** The short label on the meta rail, shown when there is no icon. */
  name: string;
  question: string;
  summary: string;
  /** A pictogram in place of the label, so the list can be scanned by eye. */
  icon?: LucideIcon;
}

/** One icon per research programme, by slug. A programme added to
 *  content/research.ts without one here simply shows no icon. */
const PROGRAMME_ICONS: Record<string, LucideIcon> = {
  "ai-empathy-agentic-commerce": ShoppingBag,
  "ai-empathy-sustainable-consumption": Leaf,
  "ai-companions-healthy-aging": HeartHandshake,
  "ai-empathy-customer-service": Headset,
  "ai-emotion-measurement": AudioWaveform,
};

/**
 * The site's signature element: each research programme, and each
 * explainer, presented as the question it answers. Three layers only,
 * label, question and summary, and the question leads. A programme shows
 * its icon in place of the label.
 */
export function QuestionList({ items }: { items: QuestionItem[] }) {
  return (
    <div className={styles.qList}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={item.icon ? `${styles.qRow} ${styles.qRowIcon}` : styles.qRow}
        >
          {item.icon ? (
            <span className={styles.qIcon} aria-hidden="true">
              <item.icon size={20} strokeWidth={1.75} />
            </span>
          ) : (
            <span className={styles.qName}>{item.name}</span>
          )}
          <span className={styles.qQuestion}>{item.question}</span>
          <span className={styles.qSummary}>{item.summary}</span>
          <ArrowRight size={20} className={styles.qArrow} aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export function projectItems(projects: ResearchProject[]): QuestionItem[] {
  return projects.map((p) => ({
    href: `/research/${p.slug}/`,
    name: p.name,
    question: p.question,
    summary: p.summary,
    icon: PROGRAMME_ICONS[p.slug],
  }));
}

export function explainerItems(explainers: Explainer[]): QuestionItem[] {
  return explainers.map((e) => ({
    href: `/resources/${e.slug}/`,
    name: e.tag,
    question: e.question,
    summary: e.summary,
  }));
}
