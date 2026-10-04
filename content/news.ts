import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * The news feed: /news/ in full, and the home page's "Latest from the
 * team", which is its newest three. Each item is one JSON file in
 * data/news/, written by Pages CMS (see .pages.yml) or by hand, and read at
 * build time newest first, so the order of the files never matters.
 *
 * An entry that cannot be read fails the build with the file's name,
 * rather than shipping a broken row. Vercel then keeps serving the last
 * good build, so a bad edit never reaches the live site.
 */
export interface NewsItem {
  /** The file name without .json. */
  id: string;
  /** YYYY-MM-DD. */
  date: string;
  /** Podcast, Conference, Video... shown as the row's tag. */
  type: string;
  /** One sentence, as it reads on the site. */
  text: string;
  /** Where the item leads: a full web address, or a path on this site. */
  href?: string;
}

const NEWS_DIR = path.join(process.cwd(), "data", "news");

/** Read on every call, not once at import, so `pnpm dev` shows an edited
 *  file on the next refresh. */
export function getNews(): NewsItem[] {
  return readdirSync(NEWS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => parseNewsItem(file))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

function parseNewsItem(file: string): NewsItem {
  const where = `data/news/${file}`;
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(readFileSync(path.join(NEWS_DIR, file), "utf8"));
  } catch {
    throw new Error(`${where} is not valid JSON.`);
  }

  const date = optionalString(data.date) ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`${where}: "date" must be YYYY-MM-DD, got "${date}".`);
  }
  const type = optionalString(data.type);
  if (!type) throw new Error(`${where}: "type" is missing.`);
  const text = optionalString(data.text);
  if (!text) throw new Error(`${where}: "text" is missing.`);
  const href = optionalString(data.href);
  if (href && !/^(https?:\/\/|\/)/.test(href)) {
    throw new Error(`${where}: "href" must start with https:// or /, got "${href}".`);
  }

  return { id: file.replace(/\.json$/, ""), date, type, text, href };
}

/** Pages CMS saves an empty field as "", hand edits may leave null. */
function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-02" reads "Oct 2, 2026". */
export function formatNewsDate(date: string): string {
  const [year, month, day] = date.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${name} ${Number(day)}, ${year}` : date;
}
