import { ArrowUpRight } from "lucide-react";
import type { Publication } from "@/content/publications";
import styles from "./PubTable.module.css";

/**
 * Published work as a table: year, title with authors, where it appeared,
 * and an arrow for the ones that link out. The header row is for sighted
 * readers: the rows are articles that name their own parts.
 */
export function PubTable({ publications }: { publications: Publication[] }) {
  return (
    <div>
      <div className={styles.head} aria-hidden="true">
        <span>Year</span>
        <span>Title</span>
        <span>Published in</span>
        <span />
      </div>
      {publications.map((publication) => (
        <article key={publication.id} className={styles.row}>
          <p className={styles.year}>{publication.year ?? ""}</p>
          <div className={styles.main}>
            <p className={styles.title}>
              {publication.href ? (
                <a href={publication.href} target="_blank" rel="noopener noreferrer">
                  {publication.title}
                </a>
              ) : (
                publication.title
              )}
            </p>
            <p className={styles.authors}>{publication.authors}</p>
          </div>
          {publication.venue ? (
            <p className={styles.venue}>
              <em>{publication.venue}</em>
              {publication.detail ? `, ${publication.detail}` : null}
            </p>
          ) : null}
          {publication.href ? (
            <ArrowUpRight size={18} className={styles.go} aria-hidden="true" />
          ) : null}
        </article>
      ))}
    </div>
  );
}
