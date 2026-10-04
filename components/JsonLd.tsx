import { SITE } from "@/content/site";

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

/** The lab as schema.org sees it: the home page's card, and the author and
 *  publisher of everything on /resources/. */
export const ORGANIZATION = {
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  foundingDate: "2024",
  logo: `${SITE.url}/icon-512.png`,
} as const;

/** schema.org Organization card for the home page. */
export function OrgJsonLd() {
  return <JsonLd data={{ "@context": "https://schema.org", ...ORGANIZATION }} />;
}
