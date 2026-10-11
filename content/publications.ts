import data from "@/data/publications.json";
import { RESEARCH_PROJECTS } from "./research";
import { TEAM, type Person } from "./team";

/**
 * The publication library, kept in data/publications.json and edited
 * through Pages CMS (see .pages.yml). The file is one list in the lab's
 * own order, which the CMS reorders by drag:
 *   working papers   the "Latest on AI empathy" cards on /publications/,
 *                    and the first four on the home page
 *   published work   "Selected publications"
 * Each programme page lists the papers tagged with its slug.
 *
 * Every entry is checked here, at build time. One that cannot be shown
 * correctly fails the build with its position and title, so a bad edit
 * never reaches the live site.
 */
export interface Publication {
  id: string;
  authors: string;
  year?: number;
  title: string;
  venue?: string;
  /** Volume / issue / pages, shown after the venue. */
  detail?: string;
  href?: string;
  kind: "working" | "published";
  /** Research programme slugs this paper belongs to (for related lists). */
  projects?: string[];
}

const PROGRAMME_SLUGS = new Set(RESEARCH_PROJECTS.map((project) => project.slug));

function parsePublication(raw: unknown, index: number, taken: Set<string>): Publication {
  const entry = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const title = optionalString(entry.title);
  const where = `data/publications.json, entry ${index + 1}${title ? ` ("${title.slice(0, 60)}")` : ""}`;
  if (!title) throw new Error(`${where}: "title" is missing.`);

  const kind = entry.kind;
  if (kind !== "working" && kind !== "published") {
    throw new Error(`${where}: "kind" must be "working" or "published", got "${String(kind)}".`);
  }
  const authors = optionalString(entry.authors);
  if (!authors) throw new Error(`${where}: "authors" is missing.`);

  /* The CMS stores an empty number as "". */
  let year: number | undefined;
  if (entry.year !== undefined && entry.year !== null && entry.year !== "") {
    year = Number(entry.year);
    if (!Number.isInteger(year)) throw new Error(`${where}: "year" must be a whole number.`);
  }

  const href = optionalString(entry.href);
  if (href && !/^https?:\/\//.test(href)) {
    throw new Error(`${where}: "href" must be a full web address, got "${href}".`);
  }

  const projects = Array.isArray(entry.projects) ? entry.projects.map(String) : [];
  for (const slug of projects) {
    if (!PROGRAMME_SLUGS.has(slug)) {
      throw new Error(`${where}: unknown research programme "${slug}". The programmes in .pages.yml must match content/research.ts.`);
    }
  }

  /* A stable key from the title, made unique if two titles share a start. */
  let id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  while (taken.has(id)) id = `${id}-${index + 1}`;
  taken.add(id);

  return {
    id,
    authors,
    year,
    title,
    venue: optionalString(entry.venue),
    detail: optionalString(entry.detail),
    href,
    kind,
    projects: projects.length ? projects : undefined,
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

const taken = new Set<string>();
const LIBRARY: Publication[] = (data.publications as unknown[]).map((raw, index) =>
  parsePublication(raw, index, taken),
);

/** Working papers, in the lab's order: the "Latest on AI empathy" set. */
export const WORKING_PAPERS: Publication[] = LIBRARY.filter((p) => p.kind === "working");

/** Published work, in the lab's order. */
export const SELECTED_PUBLICATIONS: Publication[] = LIBRARY.filter((p) => p.kind === "published");

/** Working papers first, whatever the list interleaves, as the programme
 *  pages have always shown them. */
export const ALL_PUBLICATIONS: Publication[] = [...WORKING_PAPERS, ...SELECTED_PUBLICATIONS];

export function publicationsForProject(slug: string): Publication[] {
  return ALL_PUBLICATIONS.filter((p) => p.projects?.includes(slug));
}

export interface Author {
  /** As a reader would say it: "A. Javornik". */
  name: string;
  /** The team member this author is, when it is one of us. */
  person?: Person;
}

/** Letters only, without accents or case, so "Bezençon" meets "Bezencon". */
function folded(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/** The person's surname and first initial, from "Dr. Alex Mari". */
function nameParts(person: Person): { surname: string; initial: string } {
  const parts = person.name.replace(/^Dr\.\s+/, "").split(/\s+/);
  return { surname: folded(parts[parts.length - 1]), initial: parts[0][0].toUpperCase() };
}

/**
 * A publication's authors, read from the APA list the library keeps
 * ("Mari, A., Uysal, D. E., & Brooks, J."). An author is a team member when
 * the surname matches and the initials include that member's first initial,
 * so a namesake with other initials is never taken for one of us. A list
 * that is not in that form comes back whole, as one name.
 */
export function authorsOf(publication: Publication): Author[] {
  const found = [...publication.authors.matchAll(/([^,&…]+?),\s*((?:[A-Z]\.[\s-]*)+)/g)];
  if (!found.length) return [{ name: publication.authors }];
  return found.map(([, surnameText, initialsText]) => {
    const surname = surnameText.trim();
    const initials = initialsText.trim();
    const person = TEAM.find((member) => {
      const parts = nameParts(member);
      return parts.surname === folded(surname) && initials.includes(`${parts.initial}.`);
    });
    return { name: `${initials} ${surname}`, person };
  });
}

/** The library's papers a team member wrote, in the library's order. */
export function publicationsBy(person: Person): Publication[] {
  return ALL_PUBLICATIONS.filter((publication) =>
    authorsOf(publication).some((author) => author.person?.id === person.id),
  );
}
