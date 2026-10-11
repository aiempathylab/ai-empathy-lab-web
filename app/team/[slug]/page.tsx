import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileJsonLd } from "@/components/JsonLd";
import { ProfileLinkIcon } from "@/components/ProfileLinkIcon";
import { PublicationItem } from "@/components/PublicationItem";
import { publicationsBy } from "@/content/publications";
import { initialsOf, personById, photoFor, TEAM } from "@/content/team";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return TEAM.map((person) => ({ slug: person.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = personById(slug);
  if (!person) return {};
  return pageMetadata({
    title: `${person.name} | AI Empathy Lab`,
    description: person.affiliation
      ? `${person.name}, ${person.role} at the AI Empathy Lab. ${person.affiliation}.`
      : `${person.name}, ${person.role} at the AI Empathy Lab.`,
    path: `/team/${person.id}/`,
  });
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const person = personById(slug);
  if (!person) notFound();

  const photo = photoFor(person.id);
  const papers = publicationsBy(person);

  return (
    <div className="container">
      <ProfileJsonLd person={person} />
      {/* One grid for the whole profile: the reading column runs name, role,
          affiliation, bio without pausing, and the portrait and its panel
          stack down the support rail on their own. Splitting this into a
          hero band and a body band forced the bio to start below whichever
          side was taller, which opened a hole under the heading. */}
      <div className="page-hero rail-split">
        <div className={styles.main}>
          <h1 className="t-h1">{person.name}</h1>
          <p className={styles.role}>{person.role}</p>
          {person.affiliation ? (
            <p className={styles.affiliation}>{person.affiliation}</p>
          ) : null}
          <div className={`prose ${styles.bio}`}>
            <p>{person.bio}</p>
          </div>
        </div>

        <div className={styles.side}>
          {photo ? (
            <img
              className={styles.portrait}
              src={photo}
              alt={person.name}
              width={800}
              height={800}
              // above the fold on this page, so it is not deferred
              fetchPriority="high"
            />
          ) : (
            <span
              className={`${styles.portrait} ${styles.portraitFallback}`}
              style={{
                background: `var(--ael-tag-${person.hue}-bg)`,
                color: `var(--ael-tag-${person.hue})`,
              }}
              aria-hidden="true"
            >
              {initialsOf(person.name)}
            </span>
          )}

          {person.focus?.length || person.links.length ? (
            <aside className={styles.panel} aria-label={`About ${person.name}`}>
              {person.focus?.length ? (
                <div className={styles.panelBlock}>
                  <p className={styles.panelLabel}>Research focus</p>
                  <ul className={styles.tags}>
                    {person.focus.map((tag) => (
                      <li key={tag} className={styles.tag}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {person.links.length ? (
                <div className={styles.panelBlock}>
                  <p className={styles.panelLabel}>Elsewhere</p>
                  <ul className={styles.links}>
                    {person.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ProfileLinkIcon label={link.label} />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
          ) : null}
        </div>
      </div>

      {/* Their papers in the lab's library, in the programme pages' row
          grammar: a profile's evidence, and its links to the work. */}
      {papers.length ? (
        <section className="band">
          <div className="section-head">
            <div>
              <h2 className="t-h2">Publications</h2>
            </div>
          </div>
          <div>
            {papers.map((publication) => (
              <PublicationItem key={publication.id} publication={publication} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className={styles.back}>
        <Link href="/team/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" />
          All researchers
        </Link>
      </nav>
    </div>
  );
}
