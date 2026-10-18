/**
 * Copy for /about/. The five paragraphs are the lab's own, as they were on the
 * page before it was split into sections; each section's `summary` is its one
 * sentence of conclusion, drawn from what its paragraphs already say.
 *
 * Statements about how the lab works should be confirmed by a director before
 * they change.
 */
export interface AboutSection {
  /** The small label above the summary. */
  title: string;
  summary: string;
  paragraphs: string[];
}

export const ABOUT = {
  h1: "About the AI Empathy Lab",
  lede: "The AI Empathy Lab is an international experimental research group advancing the science and practice of AI empathy. We examine how empathic voice assistants, agents, and companions shape consumer behavior, decision-making, relationships, and well-being.",
  sections: [
    {
      title: "What we study",
      summary: "How empathic AI shapes consumer behavior, decisions and well-being.",
      paragraphs: [
        "The AI Empathy Lab brings together researchers in marketing, psychology, behavioral science, and computer science to investigate how empathic AI, in the form of assistants, agents, and companions, shapes consumer behavior.",
        "We envision AI agents that embody the key dimensions of human empathy: perspective-taking, emotional resonance, and prosocial motivation. We study when such agents benefit consumers and when they fall short. Informed by this evidence, we guide the design of smarter empathic agents that contribute more positively to society, for example, by adapting their empathy to the context.",
      ],
    },
    {
      title: "How we work",
      summary: "Controlled experiments with real, working AI agents, run by voice.",
      paragraphs: [
        "Our approach is distinctly experimental, and our medium is the voice. We conduct controlled experiments with real, working AI agents and systematically manipulate the dimensions of their behavior that matter most: the empathy they express, the persuasive strategies they employ, and their capacity to remember.",
      ],
    },
    {
      title: "Where we come from",
      summary: "Established in 2024 with the support of the University of Zurich and ETH Zurich.",
      paragraphs: [
        "The Lab grew out of the AI Empathy Research Initiative, established in 2024 with the support of the University of Zurich and ETH Zurich. It has since evolved into an international research group bridging Europe and the Middle East, dedicated to advancing the science of AI empathy in consumer contexts.",
      ],
    },
    {
      title: "Who it is for",
      summary: "Managers, policymakers and society.",
      paragraphs: [
        "Our findings speak to three audiences. For managers, our work guides the design of more effective, human-centric AI experiences in retail, service, and healthcare. For policymakers, it builds the evidence base needed to assess AI's influence on personal choices and shape sensible regulation. For society, it illuminates both the promise and the perils of machines designed to understand how we feel.",
      ],
    },
  ] satisfies AboutSection[],
  partners: "Partners and collaborations",
  collaborate: { title: "Work with us", action: "Get in touch" },
};
