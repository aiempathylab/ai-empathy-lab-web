import { notFound } from "next/navigation";
import { AppLoopPlayer } from "@/components/AppLoopPlayer";
import { Compare } from "@/components/cary/Compare";
import { DataMap } from "@/components/cary/DataMap";
import { MemoryPath } from "@/components/cary/MemoryPath";
import { PromptSlots } from "@/components/cary/PromptSlots";
import { InlineText } from "@/components/InlineText";
import { appLoopObject, breadcrumbList, JsonLd, ORGANIZATION } from "@/components/JsonLd";
import { Description, Hero, Prose, Section, Stack } from "@/components/Page";
import { APP_LOOPS } from "@/content/app-loops";
import { CARY_STUDY, type FactRow } from "@/content/cary-study";
import { projectBySlug } from "@/content/research";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

/* This page belongs to one programme. Any other slug is a 404 at build time,
   so the route cannot quietly spawn pages for programmes that have none. */
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: CARY_STUDY.programme }];
}

export const metadata = pageMetadata({
  title: CARY_STUDY.seoTitle,
  description: CARY_STUDY.seoDescription,
  path: `/research/${CARY_STUDY.programme}/cary-study/`,
  article: { published: CARY_STUDY.published, modified: CARY_STUDY.updated },
});

/** A term and what it says, one under another with a hairline above each. */
function FactList({ rows }: { rows: readonly FactRow[] }) {
  return (
    <dl className={styles.facts}>
      {rows.map((row) => (
        <div key={row.term} className={styles.fact}>
          <dt>{row.term}</dt>
          <dd>
            <InlineText text={row.body} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default async function CaryStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project || slug !== CARY_STUDY.programme) notFound();

  const { memory, conditions, stack, data, prompt, limits } = CARY_STUDY;
  const path = `/research/${CARY_STUDY.programme}/cary-study/`;
  const url = `${SITE.url}${path}`;

  return (
    <div className="container">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: CARY_STUDY.h1,
              alternativeHeadline: CARY_STUDY.seoTitle.replace(` | ${SITE.name}`, ""),
              description: CARY_STUDY.seoDescription,
              abstract: CARY_STUDY.lede,
              url,
              mainEntityOfPage: url,
              image: `${SITE.url}/brand/og.png`,
              inLanguage: "en",
              datePublished: CARY_STUDY.published,
              dateModified: CARY_STUDY.updated,
              author: ORGANIZATION,
              publisher: ORGANIZATION,
              about: [
                { "@type": "Thing", name: "AI companion memory" },
                { "@type": "Thing", name: "Voice AI for older adults" },
                { "@id": `${SITE.url}/research/${CARY_STUDY.programme}/#project` },
              ],
              video: Object.entries(APP_LOOPS).map(([key, loop]) =>
                appLoopObject(loop, `film-${key}`, url),
              ),
            },
            breadcrumbList([
              { name: "Home", path: "/" },
              { name: "Research", path: "/research/" },
              { name: project.h1, path: `/research/${CARY_STUDY.programme}/` },
              { name: CARY_STUDY.h1, path },
            ]),
          ],
        }}
      />
      <Hero title={CARY_STUDY.h1} lede={CARY_STUDY.lede} />

      {/* Memory: the plain-language account, with the profile in three
          numbers beside the heading. */}
      <Section
        id={memory.id}
        title={memory.heading}
        left={
          <ul className={styles.glanceList} aria-label={memory.glanceLabel}>
            {memory.glance.map((item) => (
              <li key={item.figure} className={styles.glanceItem}>
                <span className={styles.figure}>{item.figure}</span>
                <span className={styles.figureLabel}>{item.label}</span>
              </li>
            ))}
          </ul>
        }
      >
        <Prose>
          {memory.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      {/* One fact followed from one call to the next, as a film and as steps. */}
      <Section title={memory.stepsHeading} left={<AppLoopPlayer loop={APP_LOOPS.memory} />}>
        <div className={styles.steps}>
          <ol className={styles.stepList}>
            {memory.steps.map((item, i) => (
              <li key={item.step} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3 className={styles.stepHead}>{item.step}</h3>
                <p className={styles.stepBody}>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* The two conditions: a film of the same call both ways, then the
          table that says what differed. */}
      <Section layout="stacked" id={conditions.id} title={conditions.heading}>
        <Stack>
          <AppLoopPlayer loop={APP_LOOPS.compare} />
          <Compare />
        </Stack>
      </Section>

      <Section id={stack.id} title={stack.heading} left={<AppLoopPlayer loop={APP_LOOPS.tour} />}>
        <FactList rows={stack.rows} />
      </Section>

      <Section id={data.id} title={data.heading} left={<DataMap />}>
        <FactList rows={data.rows} />
      </Section>

      {/* The prompt is described, never shown: what it covers, and the two
          slots that differed between the groups. */}
      <Section
        id={prompt.id}
        title={prompt.heading}
        left={
          <>
            <Description>{prompt.lede}</Description>
            <PromptSlots />
          </>
        }
      >
        <FactList rows={prompt.covers} />
      </Section>

      <Section id={limits.id} title={limits.heading} left={<MemoryPath />}>
        <FactList rows={limits.items} />
      </Section>
    </div>
  );
}
