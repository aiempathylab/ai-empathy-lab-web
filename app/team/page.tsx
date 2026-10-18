import { Hero } from "@/components/Page";
import { TeamCard } from "@/components/TeamCard";
import { TEAM, TEAM_GROUPS } from "@/content/team";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: "AI Empathy Researchers & Team | AI Empathy Lab",
  description:
    "Meet researchers advancing AI empathy, voice assistants, consumer-AI relationships, affective computing, agentic commerce, and human-AI teaming.",
  path: "/team/",
});

export default function TeamPage() {
  return (
    <div className="container">
      <Hero
        title="AI Empathy Lab Researchers"
        lede="Meet the international researchers and technologists advancing AI empathy across marketing, psychology, behavioral science, computer science, and affective computing. The team studies how voice assistants, agents, and companions influence consumer decisions, relationships, trust, and well-being."
      />

      {TEAM_GROUPS.map((group) => {
        const members = TEAM.filter((person) => person.group === group.key);
        if (!members.length) return null;
        return (
          <section key={group.key} className="band band-tight">
            <div className="section-head">
              <div>
                {/* A real heading so the outline runs h1, h2, h3 (the card
                    names) instead of jumping levels, styled as the label it
                    visually is. */}
                <h2 className="overline">{group.title}</h2>
              </div>
            </div>
            <div className={styles.grid}>
              {members.map((person) => (
                <TeamCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
