import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./RefList.module.css";

/**
 * One row of related work. The whole row is the hit area and the link stays on
 * the title, so a screen reader announces the title and not the meta line, the
 * authors and the arrow with it, the way publication rows do everywhere. A
 * straight arrow goes to another page here, a diagonal one leaves the site, the
 * same difference the question rows and publication rows draw. A paper with no
 * address yet is a row without a link or an arrow.
 */
export function RefRow({
  href,
  external,
  meta,
  title,
  detail,
}: {
  href?: string;
  external?: boolean;
  meta: ReactNode;
  title: string;
  detail?: string;
}) {
  const heading = !href ? (
    title
  ) : external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
      {title}
    </a>
  ) : (
    <Link href={href} className={styles.link}>
      {title}
    </Link>
  );
  return (
    <div className={styles.row}>
      <span className={styles.meta}>{meta}</span>
      <span className={styles.title}>{heading}</span>
      {detail ? <span className={styles.detail}>{detail}</span> : null}
      {href ? (
        external ? (
          <ArrowUpRight size={18} className={styles.go} aria-hidden="true" />
        ) : (
          <ArrowRight size={18} className={styles.go} aria-hidden="true" />
        )
      ) : null}
    </div>
  );
}

export function RefList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}
