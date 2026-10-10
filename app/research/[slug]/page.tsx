import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DitherArt } from "@/components/DitherArt";
import { PublicationItem } from "@/components/PublicationItem";
import { PROGRAMME_ART } from "@/content/art";
import { publicationsForProject } from "@/content/publications";
import { projectBySlug, RESEARCH_PROJECTS } from "@/content/research";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return RESEARCH_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return pageMetadata({
    title: project.seoTitle,
    description: project.seoDescription,
    path: `/research/${project.slug}/`,
  });
}

export default async function ResearchProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const art = PROGRAMME_ART[project.slug];
  const related = publicationsForProject(project.slug).filter(
    (publication) => publication.href !== project.workSample?.href,
  );

  return (
    <div className="container">
      <header className="page-hero">
        <div className="hero-split">
          <div className="hero-split-left">
            <h1 className="t-h1">{project.h1}</h1>
            <p className={styles.question}>{project.question}</p>
          </div>
          <p className="t-lead">{project.intro}</p>
        </div>
      </header>

      {/* Same shape as every other page's body: the reading rail on the
          left, the one supporting object on the support rail. */}
      <section className="band rail-split">
        <div className="prose">
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        {/* The support rail: the programme's image, then its work sample,
            riding alongside the text together. */}
        <div className={styles.support}>
          {art ? (
            <figure className={styles.figure} style={{ ["--ratio" as string]: art.ratio }}>
              <DitherArt piece={art} />
            </figure>
          ) : null}
          {project.workSample ? (
            <aside className={styles.sample}>
              <p className={styles.sampleKind}>
                {project.workSample.href ? (
                  <>
                    <span className="chip chip-accent">Working paper</span>
                    <span className={styles.sampleVenue}>SSRN</span>
                  </>
                ) : (
                  <span className="chip chip-soon">Coming soon</span>
                )}
              </p>
              <p className={styles.sampleTitle}>{project.workSample.title}</p>
              {project.workSample.href ? (
                <a
                  href={project.workSample.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow"
                >
                  Read the work sample{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              ) : null}
            </aside>
          ) : null}
        </div>
      </section>

      {related.length ? (
        <section className="band">
          <div className="section-head">
            <div>
              <h2 className="t-h2">Related publications</h2>
            </div>
          </div>
          <div>
            {related.map((publication) => (
              <PublicationItem key={publication.id} publication={publication} />
            ))}
          </div>
        </section>
      ) : null}

      <nav className={styles.back}>
        <Link href="/research/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" />
          All research programmes
        </Link>
      </nav>
    </div>
  );
}
