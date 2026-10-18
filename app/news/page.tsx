import { NewsList } from "@/components/NewsList";
import { Hero } from "@/components/Page";
import { getNews } from "@/content/news";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI Empathy News & Research Updates | AI Empathy Lab",
  description:
    "Follow the latest AI empathy research, publications, talks, events, collaborations, and insights from the AI Empathy Lab and its international team.",
  path: "/news/",
});

export default function NewsPage() {
  return (
    <div className="container">
      <Hero
        title="AI Empathy News and Research Updates"
        lede="Follow the latest research findings, publications, talks, events, collaborations, and media appearances from the AI Empathy Lab. This page brings together updates from our international team working across AI empathy, human-AI interaction, voice technology, and consumer behavior."
      />
      <div className="band band-tight" data-reveal>
        <NewsList items={getNews()} />
      </div>
    </div>
  );
}
