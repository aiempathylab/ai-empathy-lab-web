import Link from "next/link";
import { LabPageJsonLd } from "@/components/JsonLd";
import { CtaPanel, Description, Hero, Prose, Section } from "@/components/Page";
import { PartnerLogos } from "@/components/PartnerLogos";
import { ABOUT } from "@/content/about";
import { SITE } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the AI Empathy Lab | Research & Mission",
  description:
    "Meet the international research group advancing AI empathy across consumer behavior, decision-making, human-AI relationships, and well-being.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="container">
      <LabPageJsonLd type="AboutPage" path="/about/" />
      <Hero title={ABOUT.h1} lede={ABOUT.lede} />

      {ABOUT.sections.map((section) => (
        <Section key={section.title} title={section.title} summary={section.summary}>
          <Prose>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </Prose>
        </Section>
      ))}

      {/* The funding note beside the heading, then the funders across the
          full width. */}
      <Section
        layout="stacked"
        title={ABOUT.partners}
        description={<Description>{SITE.support}</Description>}
      >
        <PartnerLogos />
      </Section>

      <CtaPanel
        title={ABOUT.collaborate.title}
        action={
          <Link href="/contact/?topic=collaboration" className="btn btn-primary">
            {ABOUT.collaborate.action}
          </Link>
        }
      >
        {SITE.collaborate}
      </CtaPanel>
    </div>
  );
}
