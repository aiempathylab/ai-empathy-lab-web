import { FilmPlayer } from "@/components/FilmPlayer";
import { ResearchHubJsonLd } from "@/components/JsonLd";
import { projectItems, QuestionList } from "@/components/QuestionRow";
import { FILMS } from "@/content/films";
import { RESEARCH_INTRO, RESEARCH_PROJECTS } from "@/content/research";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Empathy Research Projects | AI Empathy Lab",
  description:
    "Explore experimental research on AI empathy in agentic commerce, sustainable consumption, companionship, customer service, and emotion measurement.",
  path: "/research/",
});

export default function ResearchHubPage() {
  return (
    <div className="container">
      <ResearchHubJsonLd film={FILMS.howWeStudy} />
      <header className="page-hero">
        <div className="hero-split">
          <h1 className="t-h1">AI Empathy Research</h1>
          <p className="t-lead">{RESEARCH_INTRO}</p>
        </div>
      </header>

      {/* The film first: how the lab studies AI empathy, ending on the five
          programmes that the list below opens. */}
      <section className="band">
        <FilmPlayer film={FILMS.howWeStudy} />
      </section>

      <div className="band band-tight" data-reveal>
        <QuestionList items={projectItems(RESEARCH_PROJECTS)} />
      </div>
    </div>
  );
}
