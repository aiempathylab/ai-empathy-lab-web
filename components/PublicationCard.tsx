import type { Publication } from "@/content/publications";
import styles from "./cards.module.css";

/** Working-paper card (home + publications page). The label beside the
 *  chip is where the paper is posted: the venue without its trailing
 *  "working paper", which the chip already says. "SSRN working paper"
 *  reads SSRN. */
export function PublicationCard({ publication }: { publication: Publication }) {
  const postedAt = publication.venue?.replace(/\s*working paper$/i, "");
  return (
    <article className={styles.pubCard}>
      <div className={styles.pubKind}>
        <span className="chip chip-accent">Working paper</span>
        {postedAt ? <span className={styles.pubVenue}>{postedAt}</span> : null}
      </div>
      <h3 className={styles.pubTitle}>
        {publication.href ? (
          <a href={publication.href} target="_blank" rel="noopener noreferrer">
            {publication.title}
          </a>
        ) : (
          publication.title
        )}
      </h3>
      <p className={styles.pubAuthors}>{publication.authors}</p>
    </article>
  );
}
