import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ResearchProject } from "@/content/research";
import type { Explainer } from "@/content/resources";
import styles from "./cards.module.css";

export interface QuestionItem {
  href: string;
  /** The short label on the meta rail. */
  name: string;
  question: string;
  summary: string;
}

/**
 * The site's signature element: each research programme, and each
 * explainer, presented as the question it answers. Three layers only —
 * label, question, summary; the question leads.
 */
export function QuestionList({ items }: { items: QuestionItem[] }) {
  return (
    <div className={styles.qList}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.qRow}>
          <span className={styles.qName}>{item.name}</span>
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
