import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { LabPageJsonLd } from "@/components/JsonLd";
import { LinkedInIcon } from "@/components/LinkedInIcon";
import { Hero } from "@/components/Page";
import { CONTACT } from "@/content/contact";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: CONTACT.metaTitle,
  description: CONTACT.metaDescription,
  path: "/contact/",
});

/* The form on the page's main rails, the other ways in on the support
   rail, the way every page pairs its content with an aside. */
export default function ContactPage() {
  return (
    <div className="container">
      <LabPageJsonLd type="ContactPage" path="/contact/" />
      <Hero title={CONTACT.title} lede={CONTACT.lede} />

      <section className="band band-rule">
        <div className="rail-split">
          <ContactForm />
          <aside className={styles.aside}>
            <div className={styles.way}>
              <h2 className={styles.wayHead}>{CONTACT.aside.emailHead}</h2>
              <a href={`mailto:${SITE.email}`} className="link-arrow">
                <Mail size={16} aria-hidden="true" /> {SITE.email}
              </a>
            </div>
            <div className={styles.way}>
              <h2 className={styles.wayHead}>{CONTACT.aside.followHead}</h2>
              <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow">
                <LinkedInIcon size={16} /> LinkedIn
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
