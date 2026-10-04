/** Global site facts. Everything participant-visible on every page reads from here. */
export const SITE = {
  name: "AI Empathy Lab",
  /* The bare apex is the site's one true address. Vercel serves it directly
     and redirects www to it, so canonicals, og:url, the sitemap and
     robots.txt all name this. Keep the two in step: whichever host Vercel
     serves is the one this must say. */
  url: "https://aiempathylab.com",
  platformUrl: "https://app.aiempathylab.com",
  /**
   * As a sentence (prose, OG card) the tagline keeps its period; in display
   * settings (the hero H1) it drops it — headlines are labels, not
   * sentences, per AP and the major style guides.
   */
  tagline: "Making sense of machines that make sense of us.",
  /** Home meta description — verbatim from the SEO plan. */
  description:
    "AI Empathy Lab advances research on human interactions with empathic AI assistants, agents, and companions for consumer psychology.",
  /** Hero support line — verbatim from the content document. */
  heroLede:
    "We study the effects of empathic AI on human judgment, decision-making, and well-being through rigorous experiments with AI voice agents.",
  /** The lab's contact address, confirmed by Danylo 2026-08-28. */
  email: "info@caryally.com",
  linkedin: "https://www.linkedin.com/company/aiempathy/",
  /** Footer support & collaborations paragraph — verbatim from the content document. */
  support:
    "The Lab's research has been supported by the UZH Foundation (University of Zurich) and the MTEC Foundation (ETH Zurich), and enriched by a technology collaboration with Hume AI, whose empathic voice technologies enable our real-time emotion-aware experimental designs.",
  collaborate:
    "We welcome collaborations with researchers, companies, and institutions interested in the science of empathic AI, from joint experiments and data partnerships to speaking engagements and policy consultations.",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Navbar links: the four places a visitor to a research lab comes for, and
 * nothing else, beside the one Platform button. Fewer items is what makes
 * each one easy to find: six links plus the button read as noise.
 *
 * Every page off the bar still has a route from the home page, which is
 * what keeps the reachability rule (every page within two clicks of home,
 * not counting the footer, which is a safety net, not a route):
 *   News       the "Latest from the team" section's "All updates"
 *   Resources  the hero's "What is AI empathy?", whose explainer lists the
 *              other four and links back to /resources/
 *   Index, Symposium  the "What is coming" cards
 * Index and Symposium earn a slot when they launch, not before.
 */
export const NAV: NavItem[] = [
  { label: "Research", href: "/research/" },
  { label: "Publications", href: "/publications/" },
  { label: "Team", href: "/team/" },
  { label: "About", href: "/about/" },
];

/** The footer's one row: the navbar again, then the two sections that are
 *  not on it, so every section is one click from the end of any page. */
export const FOOTER_NAV: NavItem[] = [
  ...NAV,
  { label: "Resources", href: "/resources/" },
  { label: "News", href: "/news/" },
];
