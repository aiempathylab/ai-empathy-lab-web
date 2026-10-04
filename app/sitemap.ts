import type { MetadataRoute } from "next";
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
    ...EXPLAINERS.map((explainer) => `/resources/${explainer.slug}/`),
    "/news/",
    "/ai-empathy-index/",
    "/symposium/",
  ];
  return paths.map((path) => ({ url: `${SITE.url}${path}` }));
}
