import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DitherArt } from "@/components/DitherArt";
import { ProjectJsonLd } from "@/components/JsonLd";
import { Figure, Hero, Prose, Section } from "@/components/Page";
import { RefList, RefRow } from "@/components/RefList";
import { PROGRAMME_ART } from "@/content/art";
import { publicationsForProject } from "@/content/publications";
import {
  PROGRAMME_HEADINGS,
  projectBySlug,
  RESEARCH_PROJECTS,
  type ResearchProject,
} from "@/content/research";
import { EXPLAINERS } from "@/content/resources";
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

/** The work sample, set under the text with a hairline above. */
function WorkSample({ sample }: { sample: NonNullable<ResearchProject["workSample"]> }) {
  return (
    <div className={styles.note}>
      <p className={styles.kind}>
        {sample.href ? (
          <>
            <span className="chip chip-accent">Working paper</span>
            <span className={styles.venue}>SSRN</span>
          </>
        ) : (
          <span className="chip chip-soon">Coming soon</span>
        )}
      </p>
      <p className={styles.noteTitle}>{sample.title}</p>
      {sample.href ? (
        <a href={sample.href} target="_blank" rel="noopener noreferrer" className="link-arrow">
          Read the work sample <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

/** A deeper page on how the programme's study was built. */
function StudyNotes({ notes }: { notes: NonNullable<ResearchProject["studyNotes"]> }) {
  return (
    <div className={styles.note}>
      <p className={styles.kind}>
        <span className="chip chip-iris">Study notes</span>
      </p>
      <p className={styles.noteTitle}>{notes.title}</p>
      <p className={styles.noteText}>{notes.summary}</p>
      <Link href={notes.href} className="link-arrow">
        {notes.cta} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
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
  const papers = publicationsForProject(project.slug);
  const related = papers.filter(
    (publication) => publication.href !== project.workSample?.href,
  );
  /* The explainers that name this programme as their related research,
     so the link between the two runs both ways. */
  const explainers = EXPLAINERS.filter((explainer) =>
    explainer.related.includes(project.slug),
  );

  return (
    <div className="container">
      <ProjectJsonLd project={project} publications={papers} />
      <Hero title={project.h1} subtitle={project.question} lede={project.intro} />

      {/* The programme's picture under the heading, the text beside it, and
          the work sample and study notes under the text. */}
      <Section
        title={PROGRAMME_HEADINGS.about}
        left={
          art ? (
            <Figure ratio={art.ratio}>
              <DitherArt piece={art} />
            </Figure>
          ) : undefined
        }
      >
        <Prose>
          {project.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
        {project.workSample ? <WorkSample sample={project.workSample} /> : null}
        {project.studyNotes ? <StudyNotes notes={project.studyNotes} /> : null}
      </Section>

      {related.length ? (
        <Section title={PROGRAMME_HEADINGS.publications}>
          <RefList>
            {related.map((publication) => (
              <RefRow
                key={publication.id}
                href={publication.href}
                external
                meta={
                  <>
                    {publication.year ? <span>{publication.year}</span> : null}
                    {publication.venue ? (
                      <em>
                        {publication.venue}
                        {publication.detail ? `, ${publication.detail}` : ""}
                      </em>
                    ) : null}
                  </>
                }
                title={publication.title}
                detail={publication.authors}
              />
            ))}
          </RefList>
        </Section>
      ) : null}

      {explainers.length ? (
        <Section title={PROGRAMME_HEADINGS.explainers}>
          <RefList>
            {explainers.map((explainer) => (
              <RefRow
                key={explainer.slug}
                href={`/resources/${explainer.slug}/`}
                meta={<span>{explainer.tag}</span>}
                title={explainer.question}
                detail={explainer.summary}
              />
            ))}
          </RefList>
        </Section>
      ) : null}
    </div>
  );
}
