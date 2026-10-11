import type { MetadataRoute } from "next";
import { getNews } from "@/content/news";
import { RESEARCH_PROJECTS } from "@/content/research";
import { EXPLAINERS } from "@/content/resources";
import { SITE } from "@/content/site";
import { TEAM } from "@/content/team";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/about/",
    "/research/",
    ...RESEARCH_PROJECTS.map((project) => `/research/${project.slug}/`),
    "/publications/",
    "/team/",
    ...TEAM.map((person) => `/team/${person.id}/`),
    "/resources/",
    "/platform/",
    "/contact/",
    "/ai-empathy-index/",
    "/symposium/",
  ];
  /* A date only where the page has a true one: the news page changes
     when an item is added, an explainer when it is reviewed. */
  const latestNews = getNews()[0]?.date;
  return [
    ...paths.map((path) => ({ url: `${SITE.url}${path}` })),
    { url: `${SITE.url}/news/`, ...(latestNews ? { lastModified: latestNews } : {}) },
    ...EXPLAINERS.map((explainer) => ({
      url: `${SITE.url}/resources/${explainer.slug}/`,
      lastModified: explainer.reviewed,
    })),
  ];
}
