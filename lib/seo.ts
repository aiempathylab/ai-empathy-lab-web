import type { Metadata } from "next";
import { SITE } from "@/content/site";

/**
 * Per-page metadata. Titles and descriptions come from the SEO plan
 * verbatim, so every page passes its FULL title — no layout template.
 * Articles (the explainers) say so in Open Graph, with their review date.
 */
export function pageMetadata(page: {
  title: string;
  description: string;
  path: string;
  article?: { modified: string };
}): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: page.article
      ? {
          title: page.title,
          description: page.description,
          url: page.path,
          siteName: SITE.name,
          images: ["/brand/og.png"],
          type: "article",
          publishedTime: page.article.modified,
          modifiedTime: page.article.modified,
        }
      : {
          title: page.title,
          description: page.description,
          url: page.path,
          siteName: SITE.name,
          images: ["/brand/og.png"],
          type: "website",
        },
  };
}
