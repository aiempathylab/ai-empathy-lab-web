/**
 * Partners and collaborations, shown on the home page and the About page.
 *
 * Every logo is the organisation's own current artwork: UZH and ETH from
 * their official files; Hume AI's wordmark; ZHAW's 2024 mark as it appears
 * on zhaw.ch (its blue "School of Management and Law" lockup is the
 * pre-2024 identity), with the school's name set beside it in Inter, the
 * typeface zhaw.ch itself uses; AUBH's SVG from aubh.edu.bh; evulpo's
 * wordmark in the brand indigo of evulpo.com's own logo file.
 *
 * Logos only, by design: the band carries no captions. Each card links to
 * the partner's own site.
 */
export interface Partner {
  /** Alt text for the logo, and the partner's name everywhere else. */
  name: string;
  logo: string;
  /** Rendered height in px, so marks of very different proportions sit at
   *  one optical size. */
  height: number;
  /** A name set beside a mark that carries none of its own. A newline
   *  marks the line break, as in the organisation's own lockup. */
  wordmark?: string;
  href: string;
}

export const PARTNERS: Partner[] = [
  {
    name: "University of Zurich",
    logo: "/partners/uzh.svg",
    height: 54,
    href: "https://www.uzh.ch/en.html",
  },
  {
    name: "ETH Zurich",
    logo: "/partners/eth-zurich.svg",
    height: 32,
    href: "https://ethz.ch/en.html",
  },
  {
    name: "Hume AI",
    logo: "/partners/hume.png",
    height: 36,
    href: "https://www.hume.ai/",
  },
  {
    name: "ZHAW School of Management and Law",
    logo: "/partners/zhaw.svg",
    height: 46,
    wordmark: "School of\nManagement and Law",
    href: "https://www.zhaw.ch/en/sml",
  },
  {
    name: "American University of Bahrain",
    logo: "/partners/aubh.svg",
    height: 60,
    href: "https://aubh.edu.bh/",
  },
  {
    name: "evulpo",
    logo: "/partners/evulpo.svg",
    height: 32,
    href: "https://evulpo.com/",
  },
];
