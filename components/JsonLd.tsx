import type { AppLoop } from "@/content/app-loops";
import type { Film } from "@/content/films";
import { authorsOf, type Publication } from "@/content/publications";
import { RESEARCH_PROJECTS } from "@/content/research";
import { SITE } from "@/content/site";
import { photoFor, TEAM, type Person } from "@/content/team";

/** Any schema.org object, serialised into the page head's JSON-LD slot. The
 *  `<` escape keeps a stray "</script>" in copy from closing the tag early. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** The lab as schema.org sees it: the author and publisher of everything on
 *  /resources/, and what every other page points back to. */
export const ORGANIZATION = {
  "@type": "ResearchOrganization",
  "@id": `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  foundingDate: "2024",
  logo: `${SITE.url}/icon-512.png`,
  sameAs: [SITE.linkedin],
} as const;

/** A pointer to the lab, for pages that mention it rather than describe it. */
const ORGANIZATION_REF = {
  "@type": ORGANIZATION["@type"],
  "@id": ORGANIZATION["@id"],
  name: ORGANIZATION.name,
  url: ORGANIZATION.url,
} as const;

const WEBSITE_REF = { "@id": `${SITE.url}/#website` } as const;

/** Every fact here is on the site in words: the name it was founded under
 *  (/about/), the five programmes, and the people (/team/). Engines that
 *  build a picture of the lab read this to connect the three. */
const ORGANIZATION_FULL = {
  ...ORGANIZATION,
  alternateName: "AI Empathy Research Initiative",
  knowsAbout: ["AI empathy", ...RESEARCH_PROJECTS.map((project) => project.h1)],
  member: TEAM.map(personRef),
};

/** The home page's graph: the organisation, and the website it publishes.
 *  Google takes the site name it prints in results from the WebSite entry,
 *  so without it the name is guessed from titles and headings. */
export function OrgJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          ORGANIZATION_FULL,
          {
            "@type": "WebSite",
            "@id": WEBSITE_REF["@id"],
            name: SITE.name,
            url: `${SITE.url}/`,
            inLanguage: "en",
            publisher: { "@id": ORGANIZATION["@id"] },
          },
        ],
      }}
    />
  );
}

/** A page's place in the site, which Google prints above the result. */
export function breadcrumbList(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${SITE.url}${step.path}`,
    })),
  };
}

/** /about/ and /contact/: pages about the lab, which say so. */
export function LabPageJsonLd({ type, path }: { type: "AboutPage" | "ContactPage"; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        "@id": `${SITE.url}${path}#page`,
        url: `${SITE.url}${path}`,
        isPartOf: WEBSITE_REF,
        mainEntity: type === "AboutPage" ? ORGANIZATION_FULL : ORGANIZATION_REF,
      }}
    />
  );
}

/* ── People ── */

function personUrl(person: Person): string {
  return `${SITE.url}/team/${person.id}/`;
}

/** The name as schema.org wants it, with the honorific kept apart. */
function plainName(person: Person): string {
  return person.name.replace(/^Dr\.\s+/, "");
}

function personRef(person: Person) {
  return {
    "@type": "Person",
    "@id": `${personUrl(person)}#person`,
    name: plainName(person),
    url: personUrl(person),
  };
}

/**
 * A team member's profile page and the person on it. Every value is one
 * the page shows: the role at the lab, the bio, the photo, the research
 * focus, and the profiles under "Elsewhere", which are how an engine knows
 * this Alex Mari is the one on Google Scholar. The institution is the last
 * part of the affiliation line ("Assistant Professor of Marketing, American
 * University of Bahrain"), which is how every one of them is written.
 */
export function ProfileJsonLd({ person }: { person: Person }) {
  const url = personUrl(person);
  const photo = photoFor(person.id);
  const institution = person.affiliation?.split(", ").at(-1);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ProfilePage",
            "@id": `${url}#page`,
            url,
            isPartOf: WEBSITE_REF,
            mainEntity: { "@id": `${url}#person` },
          },
          {
            ...personRef(person),
            ...(person.name.startsWith("Dr. ") ? { honorificPrefix: "Dr." } : {}),
            jobTitle: person.role,
            description: person.bio,
            ...(photo ? { image: `${SITE.url}${photo}` } : {}),
            ...(person.focus?.length ? { knowsAbout: person.focus } : {}),
            ...(person.links.length ? { sameAs: person.links.map((link) => link.href) } : {}),
            memberOf: ORGANIZATION_REF,
            ...(institution ? { affiliation: { "@type": "Organization", name: institution } } : {}),
          },
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Team", path: "/team/" },
            { name: plainName(person), path: `/team/${person.id}/` },
          ]),
        ],
      }}
    />
  );
}

/* ── Research ── */

/** A paper in the library. Team members among its authors point at their
 *  profiles, so the paper, the people and the lab join up. */
function scholarlyArticle(publication: Publication) {
  const doi = publication.href?.match(/^https?:\/\/(?:dx\.)?doi\.org\/(.+)$/)?.[1];
  return {
    "@type": "ScholarlyArticle",
    name: publication.title,
    author: authorsOf(publication).map(({ name, person }) =>
      person ? personRef(person) : { "@type": "Person", name },
    ),
    ...(publication.year ? { datePublished: String(publication.year) } : {}),
    ...(publication.kind === "published" && publication.venue
      ? { isPartOf: { "@type": "CreativeWork", name: publication.venue } }
      : {}),
    creativeWorkStatus: publication.kind === "working" ? "Working paper" : "Published",
    ...(publication.href ? { url: publication.href } : {}),
    ...(doi ? { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: doi } } : {}),
  };
}

/** /publications/: the library, in the order the page lists it. */
export function PublicationsJsonLd({ publications }: { publications: Publication[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${SITE.url}/publications/#page`,
        url: `${SITE.url}/publications/`,
        isPartOf: WEBSITE_REF,
        publisher: ORGANIZATION_REF,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: publications.map((publication, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: scholarlyArticle(publication),
          })),
        },
      }}
    />
  );
}

/** A research programme: the project, who runs it, the papers it has
 *  produced so far, and where it sits in the site. */
export function ProjectJsonLd({
  project,
  publications,
}: {
  project: (typeof RESEARCH_PROJECTS)[number];
  publications: Publication[];
}) {
  const path = `/research/${project.slug}/`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ResearchProject",
            "@id": `${SITE.url}${path}#project`,
            name: project.h1,
            description: project.intro,
            url: `${SITE.url}${path}`,
            parentOrganization: ORGANIZATION_REF,
            ...(publications.length ? { subjectOf: publications.map(scholarlyArticle) } : {}),
          },
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research/" },
            { name: project.h1, path },
          ]),
        ],
      }}
    />
  );
}

/* ── Films ── */

/**
 * A film as search engines want it, on the page at `pageUrl`. It points at
 * the H.264 file, the one every engine's video tools can read, and carries
 * the words on screen as its transcript, which is what an answer engine
 * reads of a film it cannot watch.
 */
export function videoObject(film: Film, pageUrl: string) {
  const readable = film.sources.find((source) => source.codec === "h264") ?? film.sources[0];
  return {
    "@type": "VideoObject",
    "@id": `${pageUrl}#film`,
    name: film.name,
    description: film.description,
    transcript: film.transcript,
    thumbnailUrl: film.posterWidths.map((w) => `${SITE.url}${film.poster}-${w}.jpg`),
    uploadDate: film.published,
    duration: `PT${film.seconds}S`,
    contentUrl: `${SITE.url}${readable.src}`,
    inLanguage: "en",
    publisher: ORGANIZATION_REF,
  };
}

/**
 * A short film of the app in use, as search engines want it, on the page at
 * `pageUrl`. Like a film it points at the H.264 file and carries the words on
 * screen as its transcript. `key` keeps each film's @id apart on a page that
 * has several.
 */
export function appLoopObject(loop: AppLoop, key: string, pageUrl: string) {
  const { desktop } = loop;
  const readable = desktop.sources.find((source) => source.codec === "h264") ?? desktop.sources[0];
  return {
    "@type": "VideoObject",
    "@id": `${pageUrl}#${key}`,
    name: loop.name,
    description: loop.description,
    transcript: loop.transcript,
    thumbnailUrl: `${SITE.url}${desktop.poster}-${desktop.width}.jpg`,
    uploadDate: loop.published,
    duration: `PT${Math.round(desktop.seconds)}S`,
    contentUrl: `${SITE.url}${readable.src}`,
    inLanguage: "en",
    publisher: ORGANIZATION_REF,
  };
}

/* ── The research hub ── */

/**
 * /research/: the film that shows how the lab studies AI empathy, and the
 * page's place in the site.
 */
export function ResearchHubJsonLd({ film }: { film: Film }) {
  const url = `${SITE.url}/research/`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          { ...videoObject(film, url), about: ORGANIZATION_REF },
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research/" },
          ]),
        ],
      }}
    />
  );
}

/* ── The platform ── */

/**
 * /platform/: the platform itself as a web application, the film that shows
 * it, and the page's place in the site. The film points at its H.264 file,
 * the one every engine's video tools can read, and carries the words on
 * screen as its transcript.
 */
export function PlatformJsonLd({ film }: { film: Film }) {
  const url = `${SITE.url}/platform/`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebApplication",
            "@id": `${url}#platform`,
            name: `${SITE.name} research platform`,
            url: SITE.platformUrl,
            applicationCategory: "Research",
            operatingSystem: "Any web browser",
            creator: ORGANIZATION_REF,
            subjectOf: { "@id": `${url}#film` },
          },
          { ...videoObject(film, url), about: { "@id": `${url}#platform` } },
          breadcrumbList([
            { name: "Home", path: "/" },
            { name: "Platform", path: "/platform/" },
          ]),
        ],
      }}
    />
  );
}
