import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { formatNewsDate, isExternal, type NewsItem } from "@/content/news";
import styles from "./cards.module.css";

/* Tags by family, so the feed reads in a few calm hues rather than one per
   type: the lab's own work in indigo, stages in iris, media in teal. A
   type added in .pages.yml later shows in the neutral grey until it is
   given a family here. */
const TAG_CLASS: Record<string, string> = {
  "Working paper": "chip-accent",
  Publication: "chip-accent",
  Award: "chip-accent",
  Conference: "chip-iris",
  Talk: "chip-iris",
  Event: "chip-iris",
  Podcast: "chip-teal",
  Video: "chip-teal",
  Interview: "chip-teal",
  Article: "chip-teal",
};

/**
 * News rows: date on the shared meta rail, the item's sentence in the main
 * cell, its type as a tag on the row's first baseline at the right edge.
 */
export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div>
      {items.map((item) => (
        <article key={item.id} className={styles.newsItem}>
          <p className={styles.newsDate}>
            <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
          </p>
          <p className={`${styles.newsMain} ${styles.newsTitle}`}>
            {item.href ? (
              isExternal(item.href) ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.text}
                  <ArrowUpRight size={14} className={styles.newsExt} aria-hidden="true" />
                </a>
              ) : (
                <Link href={item.href}>{item.text}</Link>
              )
            ) : (
              item.text
            )}
          </p>
          <span className={`chip ${TAG_CLASS[item.type] ?? "chip-neutral"}`}>{item.type}</span>
        </article>
      ))}
    </div>
  );
}
