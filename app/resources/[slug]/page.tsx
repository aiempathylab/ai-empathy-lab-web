import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilmPlayer } from "@/components/FilmPlayer";
import { InlineText } from "@/components/InlineText";
import { JsonLd, ORGANIZATION, videoObject } from "@/components/JsonLd";
import { Hero } from "@/components/Page";
import { PublicationItem } from "@/components/PublicationItem";
import { explainerItems, QuestionList } from "@/components/QuestionRow";
import { FILMS } from "@/content/films";
import { projectBySlug } from "@/content/research";
import {
  EXPLAINERS,
  explainerBySlug,
  plainText,
  type Explainer,
  type ExplainerBlock,
} from "@/content/resources";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export function generateStaticParams() {
  return EXPLAINERS.map((explainer) => ({ slug: explainer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const explainer = explainerBySlug(slug);
  if (!explainer) return {};
  return pageMetadata({
    title: explainer.seoTitle,
    description: explainer.seoDescription,
    path: `/resources/${explainer.slug}/`,
    article: { published: explainer.published, modified: explainer.reviewed },
  });
}

function Block({ block }: { block: ExplainerBlock }) {
  if (block.kind === "p") {
    return (
      <p>
        <InlineText text={block.text} />
      </p>
    );
  }
  if (block.kind === "list") {
    const items = block.items.map((item) => (
      <li key={item.slice(0, 40)}>
        <InlineText text={item} />
      </li>
    ));
    return block.ordered ? (
      <ol className={`${styles.list} ${styles.listOrdered}`}>{items}</ol>
    ) : (
      <ul className={styles.list}>{items}</ul>
    );
  }
  return (
    <table className={styles.compare}>
      <caption className="visually-hidden">{block.caption}</caption>
      <thead>
        <tr>
          <td />
          {block.columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row) => (
          <tr key={row.term}>
            <th scope="row">{row.term}</th>
            {row.cells.map((cell, i) => (
              <td key={block.columns[i]} data-label={block.columns[i]}>
                <InlineText text={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function structuredData(explainer: Explainer) {
  const url = `${SITE.url}/resources/${explainer.slug}/`;
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: explainer.question,
    description: explainer.seoDescription,
    abstract: explainer.answer,
    url,
    mainEntityOfPage: url,
    image: `${SITE.url}/brand/og.png`,
    inLanguage: "en",
    datePublished: explainer.published,
    dateModified: explainer.reviewed,
    author: ORGANIZATION,
    publisher: ORGANIZATION,
    isPartOf: {
      "@type": "CollectionPage",
      name: "AI Empathy Resources and Definitions",
      url: `${SITE.url}/resources/`,
    },
    ...(explainer.film ? { video: videoObject(FILMS[explainer.film], url) } : {}),
    ...(explainer.terms
      ? {
          about: explainer.terms.map((term) => ({
            "@type": "DefinedTerm",
            name: term.name,
            description: term.description,
          })),
        }
      : {}),
    citation: explainer.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      author: source.authors,
      datePublished: String(source.year),
      url: source.href,
    })),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: explainer.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
    })),
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.url}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resources",
        item: `${SITE.url}/resources/`,
      },
      { "@type": "ListItem", position: 3, name: explainer.question, item: url },
    ],
  };
  return { article, faq, breadcrumbs };
}

export default async function ExplainerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const explainer = explainerBySlug(slug);
  if (!explainer) notFound();

  const { article, faq, breadcrumbs } = structuredData(explainer);
  const related = explainer.related
    .map((projectSlug) => projectBySlug(projectSlug))
    .filter((project) => project !== undefined);
  const others = EXPLAINERS.filter((e) => e.slug !== explainer.slug);
  const contents = [
    ...explainer.sections.map((section) => ({
      id: section.id,
      label: section.heading,
    })),
    ...(explainer.faqs.length
      ? [{ id: "questions", label: "Common questions" }]
      : []),
    { id: "sources", label: "Sources" },
  ];

  return (
    <div className="container">
      <JsonLd data={article} />
      {explainer.faqs.length ? <JsonLd data={faq} /> : null}
      <JsonLd data={breadcrumbs} />

      <Hero title={explainer.question} lede={explainer.answer} />

      {/* The film under the short answer: the same answer in forty-five
          seconds, full width so its smallest words stay readable. */}
      {explainer.film ? (
        <section className="band">
          <FilmPlayer film={FILMS[explainer.film]} />
        </section>
      ) : null}

      {/* The reading rail and its one supporting object: the article on the
          left, contents and related research on the support rail, sticky
          while the article scrolls past. */}
      <div className="band rail-split">
        <article className={styles.article}>
          {explainer.sections.map((section) => (
            <section key={section.id} className={`prose ${styles.section}`}>
              <h2 id={section.id} className={styles.h2}>
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}

          {explainer.faqs.length ? (
            <section className={`prose ${styles.section}`}>
              <h2 id="questions" className={styles.h2}>
                Common questions
              </h2>
              <div className={styles.faqs}>
                {explainer.faqs.map((item) => (
                  <div key={item.question} className={styles.faq}>
                    <h3 className={styles.h3}>{item.question}</h3>
                    <p>
                      <InlineText text={item.answer} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className={styles.panel}>
          <nav aria-label="On this page" className={styles.panelBlock}>
            <p className={styles.panelLabel}>On this page</p>
            <ol className={styles.toc}>
              {contents.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          {related.length ? (
            <div className={styles.panelBlock}>
              <p className={styles.panelLabel}>Related research</p>
              <ul className={styles.related}>
                {related.map((project) => (
                  <li key={project.slug}>
                    <Link href={`/research/${project.slug}/`}>
                      <span>{project.question}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>

      <section className={`band ${styles.sources}`} aria-labelledby="sources">
        <div className="section-head">
          <div>
            <h2 id="sources" className="t-h2">
              Sources
            </h2>
          </div>
        </div>
        <div>
          {explainer.sources.map((source, i) => (
            <PublicationItem
              key={source.href}
              publication={{
                id: `${explainer.slug}-${i}`,
                authors: source.authors,
                year: source.year,
                title: source.title,
                venue: source.venue,
                href: source.href,
                kind: "published",
              }}
            />
          ))}
        </div>
      </section>

      <section className="band">
        <div className="section-head">
          <div>
            <h2 className="t-h2">More explainers</h2>
          </div>
        </div>
        <QuestionList items={explainerItems(others)} />
      </section>

      <nav className={styles.back}>
        <Link href="/resources/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" />
          All resources
        </Link>
      </nav>
    </div>
  );
}
