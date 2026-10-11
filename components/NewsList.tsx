import {
  ArrowUpRight,
  Award,
  BookOpen,
  CalendarDays,
  FileText,
  Megaphone,
  MessagesSquare,
  Mic,
  Newspaper,
  Play,
  Podcast,
  Presentation,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { formatNewsDate, isExternal, type NewsItem } from "@/content/news";
import styles from "./cards.module.css";

/* Types by family, so the feed reads in a few calm hues rather than one per
   type: the lab's own work in indigo, stages in iris, media in teal. A
   type added in .pages.yml later shows in the neutral grey, with the
   newspaper icon, until it is given a family and an icon here. */
type Family = "indigo" | "iris" | "teal";

const FAMILY: Record<string, Family> = {
  "Working paper": "indigo",
  Publication: "indigo",
  Award: "indigo",
  Conference: "iris",
  Talk: "iris",
  Event: "iris",
  Podcast: "teal",
  Video: "teal",
  Interview: "teal",
  Article: "teal",
};

const CHIP_CLASS: Record<Family, string> = {
  indigo: "chip-accent",
  iris: "chip-iris",
  teal: "chip-teal",
};

const TYPE_ICON: Record<string, LucideIcon> = {
  "Working paper": FileText,
  Publication: BookOpen,
  Award: Award,
  Announcement: Megaphone,
  Conference: Presentation,
  Talk: Mic,
  Event: CalendarDays,
  Podcast: Podcast,
  Video: Play,
  Interview: MessagesSquare,
  Article: Newspaper,
};

/**
 * News rows: date on the shared meta rail, then the item's picture and its
 * sentence in the main cell, and its type as a tag on the row's first
 * baseline at the right edge. An item without a picture shows its type's
 * icon on its family's tint, so every row carries an image of some kind.
 * The sentence is the one link, and its hit area covers the picture too.
 */
export function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div>
      {items.map((item) => {
        const family = FAMILY[item.type];
        const Icon = TYPE_ICON[item.type] ?? Newspaper;
        return (
          <article key={item.id} className={styles.newsItem}>
            <p className={styles.newsDate}>
              <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
            </p>
            <div className={styles.newsMain}>
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className={styles.newsThumb}
                  loading="lazy"
                  decoding="async"
                  width={224}
                  height={126}
                />
              ) : (
                <span
                  className={`${styles.newsThumb} ${styles.newsThumbIcon} ${styles[`thumb_${family ?? "neutral"}`]}`}
                  aria-hidden="true"
                >
                  <Icon size={22} strokeWidth={1.6} />
                </span>
              )}
              <p className={styles.newsTitle}>
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
            </div>
            <span className={`chip ${family ? CHIP_CLASS[family] : "chip-neutral"}`}>{item.type}</span>
          </article>
        );
      })}
    </div>
  );
}
