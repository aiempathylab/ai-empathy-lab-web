import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/content/site";
import { LinkedInIcon } from "./LinkedInIcon";
import styles from "./SiteFooter.module.css";

/**
 * Two rows: every section of the site with Contact at the far end, then the
 * copyright and LinkedIn. It used to be three columns of fifteen links, most
 * of them repeating the navbar or a page's own list, in a card over 550px
 * tall. Programme pages are one click from /research/, and the Index and
 * Symposium from the home page's "What is coming" cards.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.card}>
          <nav className={styles.links} aria-label="Footer">
            {FOOTER_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
            <a href={`mailto:${SITE.email}`} className={`${styles.link} ${styles.contact}`}>
              Contact
            </a>
          </nav>

          <div className={styles.bottom}>
            <p>© {year} AI Empathy Lab. All rights reserved.</p>
            <a
              href={SITE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.social}
              aria-label="AI Empathy Lab on LinkedIn"
            >
              <LinkedInIcon size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* The wordmark at architectural scale on the page ground below the
          card, spanning exactly the card's inner width: it lines up with the
          card's own text, the copyright on the left and LinkedIn on the
          right. Arch feet on the text baseline, letters complete. */}
      <div className="shell" aria-hidden="true">
        <div className={styles.wmInset}>
          <div className={styles.watermark}>
            <svg viewBox="0 0 101 46" className={styles.watermarkMark} focusable="false">
              <path className={styles.wmBack} d="M 11 46 A 44 44 0 0 1 99 46 L 81 46 A 26 26 0 0 0 29 46 Z" />
              <path className={styles.wmMid} d="M 2 46 A 33 33 0 0 1 68 46 L 53.5 46 A 18.5 18.5 0 0 0 16.5 46 Z" />
              <path className={styles.wmFront} d="M 24.5 46 A 22.5 22.5 0 0 1 69.5 46 L 58 46 A 11 11 0 0 0 36 46 Z" />
            </svg>
            <span className={styles.watermarkText}>ai empathy lab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
