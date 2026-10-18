/**
 * The five research programmes. Copy is verbatim from the lab's content
 * document; SEO fields are verbatim from the SEO plan. The question →
 * tension → what-we-study → close voice is deliberate — keep it.
 */
export interface ResearchProject {
  slug: string;
  /** Short programme name (cards, footer, breadcrumbs). */
  name: string;
  /** Page H1 — from the SEO plan. */
  h1: string;
  /** The opening question — the programme's signature line. */
  question: string;
  /** One-line summary for list rows and cards. */
  summary: string;
  seoTitle: string;
  seoDescription: string;
  /** The page's opening paragraph, verbatim from the SEO plan. */
  intro: string;
  /** Body paragraphs, rendered in order. */
  body: string[];
  workSample?: { title: string; href?: string };
  /** A deeper page on how the programme's study was built, linked under the
   *  work sample. */
  studyNotes?: { title: string; summary: string; cta: string; href: string };
}

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    slug: "ai-empathy-agentic-commerce",
    name: "Agentic commerce",
    h1: "AI Empathy in Agentic Commerce",
    question: "When a machine understands you, do you buy differently?",
    summary:
      "How empathy in AI shopping agents shapes trust, product choice, decision satisfaction, and reliance.",
    seoTitle: "AI Empathy & Agentic Commerce | AI Empathy Lab",
    seoDescription:
      "Discover how empathy in AI shopping agents affects consumer trust, product choice, decision satisfaction, and reliance across different purchase contexts.",
    intro:
      "We study how empathy in AI shopping agents influences consumer trust, product choice, decision satisfaction, and reliance. Our experiments examine when empathic AI helps, or inappropriately influences, consumers across functional, hedonic, mass-market, luxury, low-involvement, and high-involvement purchases.",
    body: [
      "We study how AI empathy shapes consumer decision-making as shopping becomes agentic, delegated to AI assistants that search, compare, and recommend on our behalf.",
      "Our experiments map the boundaries of empathy's power: when consumers rely on empathic AI for decision support, when machines outperform humans at emotional connection, and how empathy's effects shift across product worlds: functional versus experiential, mass versus luxury, low versus high involvement.",
      "The goal is a precise map of where empathy moves the consumer, and where it leaves them unmoved.",
    ],
    workSample: {
      title:
        "The Right Time for AI Empathy in Voice Commerce: Attribution Processes and Product Category Shape Decision Satisfaction",
      href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6158606",
    },
  },
  {
    slug: "ai-empathy-sustainable-consumption",
    name: "Sustainable consumption",
    h1: "AI Empathy and Sustainable Consumption",
    question:
      "Can an empathic voice close the gap between good intentions and real behavior?",
    summary:
      "Whether empathic AI advisors can turn sustainable intentions into sustainable choices, and where ethical persuasion ends.",
    seoTitle: "AI Empathy & Sustainable Consumption | AI Empathy Lab",
    seoDescription:
      "Explore whether empathic AI voice agents can turn sustainable intentions into choices, and where ethical persuasion becomes manipulation.",
    intro:
      "We investigate whether empathic AI voice agents can help consumers turn sustainable intentions into sustainable choices. Our research examines emotional support, ethical nudging, value alignment, and the boundary between beneficial persuasion and manipulation.",
    body: [
      "Most consumers want to consume sustainably. Far fewer actually do. We investigate whether empathic AI agents acting as ethical digital advisors, regulating emotions, offering moral nudges, and aligning conversations with users' values, can turn sustainable intentions into sustainable choices.",
      "And because persuasion in the name of good is still persuasion, we study with equal rigor where the ethical boundaries of such influence lie.",
    ],
    workSample: {
      title:
        "Generative AI-Enabled Empathy and Persuasion in Voice Assistants: Impact on Sustainable Consumer Choice",
      href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5420076",
    },
  },
  {
    slug: "ai-companions-healthy-aging",
    name: "Companionship in later life",
    h1: "AI Companions, Memory and Healthy Aging",
    question: "What happens when an AI companion remembers you?",
    summary:
      "How empathy and long-term memory shape relationships between older adults and AI companions, and what follows for healthy aging.",
    seoTitle: "AI Companions, Memory & Healthy Aging | AI Empathy Lab",
    seoDescription:
      "Explore how empathy and memory in AI companions affect loneliness, cognitive stimulation, relationships, and healthy aging among older adults.",
    intro:
      "We study how empathy and long-term memory shape relationships between older adults and AI companions. Our field experiments examine loneliness, cognitive stimulation, emotional connection, healthy aging, and responses to AI-suggested health behaviors.",
    body: [
      "Memory transforms an assistant into a relationship. In field experiments with older adults, we study whether memory-equipped, empathic AI companions reduce loneliness, stimulate cognition, and deepen perceived relationships, with the AI and beyond it.",
      "We then trace how these social-emotional bonds shape something consequential: the willingness to adopt AI-suggested health behaviors around diet, sleep, and physical activity, informing the ethical design of technologies for healthy aging.",
    ],
    workSample: {
      title: "Work sample coming soon",
    },
    studyNotes: {
      title: "How the Cary study was built",
      summary:
        "How Cary's memory works, the AI models behind it, where the data is kept, and the instructions it was given.",
      cta: "Read how it was built",
      href: "/research/ai-companions-healthy-aging/cary-study/",
    },
  },
  {
    slug: "ai-empathy-customer-service",
    name: "Customer service",
    h1: "AI Empathy in Customer Service",
    question: "When things go wrong, can a machine's empathy make them right?",
    summary:
      "Empathy as an emotional buffer: when an empathic response repairs a failed interaction, and when it merely decorates one.",
    seoTitle: "AI Empathy in Customer Service | AI Empathy Lab",
    seoDescription:
      "Discover when empathic AI voice assistants reduce frustration, protect trust and satisfaction, and repair failed customer service interactions.",
    intro:
      "We investigate whether empathic AI voice assistants can repair customer interactions when technology or service fails. Our research examines how the timing and form of AI empathy influence frustration, aggression, trust, satisfaction, and service recovery.",
    body: [
      "AI voice assistants now handle customer service in high-stakes contexts like banking, yet interaction failures remain common, frustrating users and eroding trust.",
      "We study empathy as an emotional buffer: how an empathic response at the moment of failure regulates customer emotions, protects satisfaction, and defuses aggression. The insight we pursue is precise timing: understanding when empathy repairs a broken interaction, and when it merely decorates one.",
    ],
    workSample: {
      title:
        "No Hard Feelings: The Protective Power of AI Empathy During Service Interaction Failures",
      href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5367747",
    },
  },
  {
    slug: "ai-emotion-measurement",
    name: "Emotion measurement",
    h1: "AI Emotion Measurement from Voice",
    question: "What if the voice itself could tell us how consumers feel?",
    summary:
      "Voice-analytics methods that read consumer emotion directly from prosody: rhythm, intonation, pace, and the signals beneath the words.",
    seoTitle: "AI Emotion Measurement from Voice | AI Empathy Lab",
    seoDescription:
      "Explore AI-based methods for estimating consumer emotion from vocal prosody, including rhythm, pitch, intonation, pace, and other voice signals.",
    intro:
      "We develop and evaluate AI-based methods for estimating consumer emotion from vocal prosody, including rhythm, pitch, intonation, pace, and other nonverbal signals. This work complements self-reports with richer, real-time evidence of how people feel during human-AI interactions.",
    body: [
      "Empathy research is only as good as its emotion measures, and self-reports capture just a fraction of the story.",
      "Leveraging recent advances in computational psychology and AI, we develop novel voice-analytics methods that read consumer emotions directly from prosody: rhythm, intonation, pace, and the micro-signals beneath the words. We conceptually argue and empirically demonstrate that AI-based emotion measurement offers marketing research a richer, more dynamic window into consumer feeling than traditional approaches allow.",
    ],
    workSample: {
      title:
        "The Voice of Emotion: Advancing Marketing Research Through Real-Time AI Emotion Measurements",
      href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5909843",
    },
  },
];

/** Hub-page intro — verbatim from the SEO plan. */
export const RESEARCH_INTRO =
  "Our research investigates how empathy expressed by AI voice assistants, agents, and companions affects human judgment and behavior. Through experiments with working AI systems, we study agentic commerce, sustainable consumption, companionship, customer service, and emotion measurement.";

/** The headings on a programme page, around the programme's own copy. */
export const PROGRAMME_HEADINGS = {
  about: "About the programme",
  publications: "Related publications",
  explainers: "Related explainers",
} as const;

export function projectBySlug(slug: string): ResearchProject | undefined {
  return RESEARCH_PROJECTS.find((p) => p.slug === slug);
}
