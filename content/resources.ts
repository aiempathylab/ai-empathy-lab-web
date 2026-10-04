/**
 * The explainers on /resources/. Each one answers a single question a reader
 * actually asks, opens with the short answer (the hero lede, which is also the
 * passage search and answer engines lift), and backs every claim with a source.
 *
 * House rules for this copy, which are Danylo's rules for the whole site:
 * no em or en dashes in our own prose, no semicolons, no middle dots, and no
 * academic citation style. Studies are named in the sentence that uses them
 * and linked from a phrase, the way a careful science writer would do it.
 *
 * Inline links are written [label](href). A leading slash is a route on this
 * site, anything else opens the source. Every number below was checked
 * against the source it links to on 4 October 2026. Working papers and
 * preprints are labelled as such wherever they are cited. Note the 2026
 * correction to the GPT-4 persuasion study before quoting it anywhere else.
 */

export interface ExplainerSource {
  authors: string;
  year: number;
  title: string;
  venue: string;
  href: string;
}

export type ExplainerBlock =
  | { kind: "p"; text: string }
  | { kind: "list"; ordered?: boolean; items: string[] }
  | {
      kind: "compare";
      caption: string;
      columns: [string, string, string];
      rows: { term: string; cells: [string, string, string] }[];
    };

export interface ExplainerSection {
  /** Anchor id, stable once published: other pages may link to it. */
  id: string;
  heading: string;
  blocks: ExplainerBlock[];
}

export interface ExplainerFaq {
  question: string;
  answer: string;
}

export interface Explainer {
  slug: string;
  /** The label on the index row's meta rail. */
  tag: string;
  /** The page H1, phrased the way people ask it. */
  question: string;
  /** One line for the index row: the answer compressed, not a teaser. */
  summary: string;
  /** The short answer. Hero lede, meta fallback, and the snippet. */
  answer: string;
  seoTitle: string;
  seoDescription: string;
  /** ISO date of the last full fact check. */
  reviewed: string;
  sections: ExplainerSection[];
  faqs: ExplainerFaq[];
  sources: ExplainerSource[];
  /** Research project slugs shown in the page's side panel. */
  related: string[];
  /** Terms the page defines, for schema.org DefinedTerm markup. */
  terms?: { name: string; description: string }[];
}

/* Sources cited by more than one explainer, written once. */
const SRC = {
  ayers: {
    authors: "John W. Ayers and colleagues",
    year: 2023,
    title:
      "Comparing physician and artificial intelligence chatbot responses to patient questions posted to a public social media forum",
    venue: "JAMA Internal Medicine",
    href: "https://doi.org/10.1001/jamainternmed.2023.1838",
  },
  ovsyannikova: {
    authors: "Dariya Ovsyannikova, Victoria Oldemburgo de Mello, and Michael Inzlicht",
    year: 2025,
    title: "Third-party evaluators perceive AI as more compassionate than expert humans",
    venue: "Communications Psychology",
    href: "https://doi.org/10.1038/s44271-024-00182-6",
  },
  rubin: {
    authors: "Matan Rubin, Joanna Z. Li, Federico Zimmerman, Desmond C. Ong, Amit Goldenberg, and Anat Perry",
    year: 2025,
    title: "Comparing the value of perceived human versus AI-generated empathy",
    venue: "Nature Human Behaviour",
    href: "https://doi.org/10.1038/s41562-025-02247-w",
  },
  schlegel: {
    authors: "Katja Schlegel, Nils R. Sommer, and Marcello Mortillaro",
    year: 2025,
    title: "Large language models are proficient in solving and creating emotional intelligence tests",
    venue: "Communications Psychology",
    href: "https://doi.org/10.1038/s44271-025-00258-x",
  },
  mariJbr: {
    authors: "Alex Mari, Andreina Mandelli, and René Algesheimer",
    year: 2024,
    title: "Empathic voice assistants: Enhancing consumer responses in voice commerce",
    venue: "Journal of Business Research",
    href: "https://doi.org/10.1016/j.jbusres.2024.114566",
  },
  noHardFeelings: {
    authors: "Fotis Efthymiou, Alex Mari, Ertugrul Uysal, and Jeff Brooks",
    year: 2025,
    title: "No Hard Feelings: The Protective Power of AI Empathy During Service Interaction Failures",
    venue: "SSRN working paper",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5367747",
  },
  sustainable: {
    authors: "Alex Mari, Ertugrul Uysal, Amani Alabed, Fotis Efthymiou, and Jeff Brooks",
    year: 2025,
    title:
      "Generative AI-Enabled Empathy and Persuasion in Voice Assistants: Impact on Sustainable Consumer Choice",
    venue: "SSRN working paper",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5420076",
  },
  rightTime: {
    authors: "Alex Mari, Ertugrul Uysal, Jeff Brooks, and Amani Alabed",
    year: 2026,
    title:
      "The Right Time for AI Empathy in Voice Commerce: Attribution Processes and Product Category Shape Decision Satisfaction",
    venue: "SSRN working paper",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6158606",
  },
  voiceOfEmotion: {
    authors: "Ertugrul Uysal, Sascha Alavi, Jeff Brooks, Alex Mari, and Fotis Efthymiou",
    year: 2025,
    title:
      "The Voice of Emotion: Advancing Marketing Research Through Real-Time AI Emotion Measurements",
    venue: "SSRN working paper",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5909843",
  },
  trembling: {
    authors: "Fotis Efthymiou and Christian Hildebrand",
    year: 2023,
    title: "Empathy by Design: The Influence of Trembling AI Voices on Prosocial Behavior",
    venue: "IEEE Transactions on Affective Computing",
    href: "https://doi.org/10.1109/TAFFC.2023.3332742",
  },
  aiAct: {
    authors: "European Parliament and Council of the European Union",
    year: 2024,
    title: "Regulation (EU) 2024/1689, the Artificial Intelligence Act",
    venue: "Official Journal of the European Union",
    href: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  ieee7014: {
    authors: "IEEE P7014 Working Group",
    year: 2024,
    title:
      "IEEE 7014-2024, Standard for Ethical Considerations in Emulated Empathy in Autonomous and Intelligent Systems",
    venue: "IEEE Standards Association",
    href: "https://doi.org/10.1109/IEEESTD.2024.10576666",
  },
  ieee70141: {
    authors: "IEEE P7014.1 Working Group",
    year: 2026,
    title:
      "IEEE 7014.1-2026, Recommended Practice for Ethical Considerations of Emulated Empathy in Partner-Based General-Purpose Artificial Intelligence Systems",
    venue: "IEEE Standards Association",
    href: "https://doi.org/10.1109/IEEESTD.2026.11559263",
  },
  sb243: {
    authors: "California State Legislature",
    year: 2025,
    title: "Senate Bill 243, Companion chatbots (Chapter 677, Statutes of 2025)",
    venue: "California Legislative Information",
    href: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB243",
  },
  farewells: {
    authors: "Julian De Freitas, Zeliha Oğuz-Uğuralp, and Ahmet Kaan-Uğuralp",
    year: 2025,
    title: "Emotional Manipulation by AI Companions",
    venue: "arXiv preprint and Harvard Business School working paper",
    href: "https://arxiv.org/abs/2508.19258",
  },
} satisfies Record<string, ExplainerSource>;

export const EXPLAINERS: Explainer[] = [
  /* ─────────────────────────────── 1 ─────────────────────────────── */
  {
    slug: "what-is-ai-empathy",
    tag: "Definition",
    question: "What is AI empathy?",
    summary:
      "A machine’s ability to recognize how someone feels, understand why, and respond in a way that helps.",
    answer:
      "AI empathy is a machine’s ability to recognize how a person feels, understand why, and respond in a way that helps. The term describes behavior, not an inner experience. People often rate that behavior above a human’s, yet they tend to feel less understood once they learn it came from a machine.",
    seoTitle: "What Is AI Empathy? Definition & Evidence | AI Empathy Lab",
    seoDescription:
      "AI empathy is a machine’s ability to recognize how someone feels, understand why, and respond helpfully. What it is, what it is not, and what research shows.",
    reviewed: "2026-10-04",
    related: [
      "ai-empathy-agentic-commerce",
      "ai-empathy-customer-service",
      "ai-empathy-sustainable-consumption",
    ],
    terms: [
      {
        name: "AI empathy",
        description:
          "A machine’s ability to recognize how a person feels, understand why, and respond in a way that helps.",
      },
    ],
    sections: [
      {
        id: "three-parts",
        heading: "Three parts of one skill",
        blocks: [
          {
            kind: "p",
            text: "Psychologists do not treat empathy as a single ability. A [widely cited account](https://doi.org/10.1038/nn.3085) by the neuroscientists Jamil Zaki and Kevin Ochsner separates three processes: understanding what another person is going through, sharing their emotional state, and caring enough to act on it. Most definitions of empathy, human or artificial, are some arrangement of these three.",
          },
          {
            kind: "p",
            text: "We describe what an empathic agent has to show in the same three terms: perspective-taking, emotional resonance, and prosocial motivation. A [paper on empathic voice assistants](https://doi.org/10.1007/978-3-032-16389-9_8) by Alex Mari and Amani Alabed puts each one in the agent’s own words: “I put myself in your shoes,” “I feel with you,” and “I am here to help you.”",
          },
          {
            kind: "p",
            text: "In a machine, the first part is inference. The system reads a person’s words, and in a voice conversation the pitch, pace, and rhythm of their speech, and estimates what they feel and why. The third part is behavior: changing course when someone is frustrated, offering the help that fits, or holding back a recommendation when the moment is wrong. The second part is the hard one. A machine can express resonance by softening its tone or slowing down, but there is no evidence that it shares the feeling. Most of the debate about AI empathy lives in that gap.",
          },
        ],
      },
      {
        id: "feeling",
        heading: "Does a machine need to feel anything?",
        blocks: [
          {
            kind: "p",
            text: "Researchers disagree, and the disagreement is instructive. The psychologist Anat Perry [argues that AI](https://doi.org/10.1038/s41562-023-01675-w) “will never convey the essence of human empathy.” Her point is that human empathy is costly, so people choose whom to give it to, and being chosen is part of what it means. She describes an online support service whose AI-assisted replies were rated more supportive than replies written by people alone, until users learned that AI was involved and the advantage disappeared.",
          },
          {
            kind: "p",
            text: "Michael Inzlicht, Daryl Cameron, Jason D’Cruz, and Paul Bloom [take the other side](https://doi.org/10.1016/j.tics.2023.12.003). For the person receiving empathy, they argue, what matters most is how it makes them feel, and AI can offer it without the exhaustion and bias that limit human empathizers. They attach one firm condition: “Deploying empathic AI without transparency is dishonest and manipulative.”",
          },
          {
            kind: "p",
            text: "Our experiments are not designed to settle whether a machine feels. They answer a question an experiment can answer: what changes for a person when the same agent responds with empathy and when it does not? In our studies, empathy is a condition we switch on or off while everything else stays the same, so a difference in what people feel and do can be traced to the empathy itself.",
          },
        ],
      },
      {
        id: "evidence",
        heading: "What the evidence shows",
        blocks: [
          {
            kind: "p",
            text: "Machine empathy is easy to perceive. A [2023 study in JAMA Internal Medicine](https://doi.org/10.1001/jamainternmed.2023.1838) asked licensed health professionals to compare ChatGPT’s answers to patients’ questions on a public forum with answers from verified physicians. They rated 45.1% of the chatbot’s answers empathetic or very empathetic, against 4.6% of the physicians’. The chatbot’s answers were also about four times longer, a reminder that length can read as care. A [2025 set of experiments](https://doi.org/10.1038/s44271-024-00182-6) found that people rated AI responses as more compassionate than those of selected human responders, including expert crisis responders, and that the preference held when they knew which response came from the AI.",
          },
          {
            kind: "p",
            text: "Being on the receiving end is different. In a [study in PNAS](https://doi.org/10.1073/pnas.2319112121), AI-generated messages made people feel more heard than messages written by people, but recipients felt less heard when they believed a message came from an AI. A [2025 series of nine studies](https://doi.org/10.1038/s41562-025-02247-w) with 6,282 participants found the same pattern. Identical AI-generated responses were rated more empathic and more supportive when people thought a human had written them, and the gap came mainly from responses that expressed shared feeling and care rather than understanding.",
          },
          {
            kind: "p",
            text: "Read together, these studies suggest that people readily accept a machine can understand them. What they discount is the part of empathy a machine can only perform.",
          },
          {
            kind: "p",
            text: "Empathy also changes what people do, which is where our own research concentrates. Alex Mari’s [study of voice shopping](https://doi.org/10.1016/j.jbusres.2024.114566) gave people a version of Amazon’s Alexa built to respond with more empathy. They reported stronger intentions to delegate tasks to it, ask it for help with decisions, and trust its recommendations. In a [working paper on service failures](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5367747), an empathic voice assistant raised customer satisfaction and reduced verbal aggression, and the effect was larger when the service failed than when it worked. In [another, on food ordering](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5420076), empathy increased sustainable choices only when the assistant also made a green persuasive appeal.",
          },
          {
            kind: "p",
            text: "Across these studies, empathy makes an agent more influential. That is good news when the agent acts in the person’s interest and a risk when it does not, which is why we also study [where persuasion becomes manipulation](/resources/ai-persuasion-and-manipulation/).",
          },
        ],
      },
      {
        id: "where",
        heading: "Where you meet it",
        blocks: [
          {
            kind: "p",
            text: "Empathic behavior is now built into customer service agents, shopping assistants, voice assistants, and companion apps that people talk to every day. Voice adds a channel that text lacks. A voice carries emotion in its pitch, timing, and warmth, and current voice systems can read those signals in a speaker and produce them in reply.",
          },
          {
            kind: "p",
            text: "Each setting raises its own questions, and each is one of our research areas: [agentic commerce](/research/ai-empathy-agentic-commerce/), [customer service](/research/ai-empathy-customer-service/), [sustainable consumption](/research/ai-empathy-sustainable-consumption/), [companionship in later life](/research/ai-companions-healthy-aging/), and [emotion measurement](/research/ai-emotion-measurement/).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can AI feel empathy?",
        answer:
          "There is no scientific evidence that current AI systems feel anything. They produce empathic responses because they have learned the patterns of empathic language, and in voice systems the patterns of emotional expression, from very large amounts of human data. The empathy lives in the behavior and in its effects on people, and those effects are real and measurable.",
      },
      {
        question: "Is it “empathic AI” or “empathetic AI”?",
        answer:
          "Both are correct and mean the same thing. Psychology has long preferred empathic, as in empathic concern and empathic accuracy, and so do we.",
      },
      {
        question: "Is AI empathy the same as emotional intelligence?",
        answer:
          "They overlap but are not the same. Emotional intelligence is the ability to perceive, understand, use, and manage emotions, your own included. Empathy is directed at another person and includes caring what happens to them. Language models now [score well above the human average](https://doi.org/10.1038/s44271-025-00258-x) on standard emotional intelligence tests, 81% against 56% in a 2025 comparison, but knowing the right answer about emotions is different from responding well to someone who is upset. Our explainer on [measuring empathy in a machine](/resources/measuring-empathy-in-ai/) covers how researchers tell the two apart.",
      },
    ],
    sources: [
      {
        authors: "Jamil Zaki and Kevin N. Ochsner",
        year: 2012,
        title: "The neuroscience of empathy: progress, pitfalls and promise",
        venue: "Nature Neuroscience",
        href: "https://doi.org/10.1038/nn.3085",
      },
      {
        authors: "Alex Mari and Amani Alabed",
        year: 2026,
        title: "AI with a Conscience: Empathic Voice Assistants for Sustainable Shopping Decisions",
        venue:
          "International Conference on Sustainability and Innovation Processes and Systems, Springer",
        href: "https://doi.org/10.1007/978-3-032-16389-9_8",
      },
      {
        authors: "Anat Perry",
        year: 2023,
        title: "AI will never convey the essence of human empathy",
        venue: "Nature Human Behaviour",
        href: "https://doi.org/10.1038/s41562-023-01675-w",
      },
      {
        authors: "Michael Inzlicht, C. Daryl Cameron, Jason D’Cruz, and Paul Bloom",
        year: 2024,
        title: "In praise of empathic AI",
        venue: "Trends in Cognitive Sciences",
        href: "https://doi.org/10.1016/j.tics.2023.12.003",
      },
      SRC.ayers,
      SRC.ovsyannikova,
      {
        authors: "Yidan Yin, Nan Jia, and Cheryl J. Wakslak",
        year: 2024,
        title: "AI can help people feel heard, but an AI label diminishes this impact",
        venue: "Proceedings of the National Academy of Sciences",
        href: "https://doi.org/10.1073/pnas.2319112121",
      },
      SRC.rubin,
      SRC.mariJbr,
      SRC.noHardFeelings,
      SRC.sustainable,
      SRC.schlegel,
    ],
  },

  /* ─────────────────────────────── 2 ─────────────────────────────── */
  {
    slug: "empathic-ai-emotional-ai-affective-computing",
    tag: "Terminology",
    question: "What separates empathic AI, emotional AI, and affective computing?",
    summary:
      "One is a research field, one reads emotion, and one responds to it. Where they overlap, and where the law tells them apart.",
    answer:
      "Affective computing is the research field that studies how computers can sense, express, and influence emotion. Emotional AI, also called emotion AI, is technology that detects or infers emotion from faces, voices, text, or the body. Empathic AI is defined by how it responds: it uses what it can tell about a person’s feelings to answer in a way they experience as understanding.",
    seoTitle: "Empathic AI vs Emotional AI vs Affective Computing",
    seoDescription:
      "Affective computing is the field, emotional AI reads emotion, empathic AI responds to it. Clear definitions, examples, and how the EU AI Act treats each.",
    reviewed: "2026-10-04",
    related: ["ai-emotion-measurement"],
    terms: [
      {
        name: "Affective computing",
        description:
          "The research field that studies how computers can sense, express, and influence emotion.",
      },
      {
        name: "Emotional AI",
        description:
          "Technology that detects or infers human emotion from faces, voices, text, or the body. Also called emotion AI.",
      },
      {
        name: "Empathic AI",
        description:
          "AI that uses what it can tell about a person’s feelings to respond in a way they experience as understanding.",
      },
    ],
    sections: [
      {
        id: "affective-computing",
        heading: "Affective computing",
        blocks: [
          {
            kind: "p",
            text: "The term comes from Rosalind Picard at the MIT Media Lab, who in 1995 [defined affective computing](https://vismod.media.mit.edu/pub/tech-reports/TR-321-ABSTRACT.html) as “computing that relates to, arises from, or deliberately influences emotions.” The definition is broad on purpose. It covers machines that recognize emotion, machines that express it, and machines designed to change how people feel.",
          },
          {
            kind: "p",
            text: "Expression and influence often meet. In a [study in IEEE Transactions on Affective Computing](https://doi.org/10.1109/TAFFC.2023.3332742), the field’s own journal, our colleague Fotis Efthymiou and his coauthor Christian Hildebrand gave a synthetic voice a slight tremble. Listeners saw the agent as more vulnerable, felt more empathic concern, and were more willing to donate to charity. In a large field test, the trembling voice also raised click-through on charity ads.",
          },
          {
            kind: "p",
            text: "Three decades on, affective computing is an established discipline. When people use the term today, they usually mean the science: the methods, models, and evidence that the other two terms depend on.",
          },
        ],
      },
      {
        id: "emotional-ai",
        heading: "Emotional AI",
        blocks: [
          {
            kind: "p",
            text: "Emotional AI, often shortened to emotion AI, is the applied side. Andrew McStay, who directs the Emotional AI Lab at Bangor University, [defines it](https://data-en-maatschappij.ai/en/publications/paper-emotional-ai-a-societal-challenge) as technologies that “use affective computing and artificial intelligence techniques to sense, learn about and interact with human emotional life.” In practice the term mostly describes systems that read emotion, such as software that scores a caller’s frustration for a call center or tracks viewers’ faces while they watch an ad. Sentiment analysis, which sorts text into positive, negative, and neutral, is its simplest form.",
          },
          {
            kind: "p",
            text: "How well it works depends on the signal. Faces are a weaker guide than is commonly assumed. A [major 2019 review](https://doi.org/10.1177/1529100619832930) found that people do smile when happy and scowl when angry more often than chance would predict, but so inconsistently across cultures, situations, and individuals that a facial configuration cannot be read as a reliable sign of one emotion.",
          },
          {
            kind: "p",
            text: "Newer, data-driven research maps emotion far more finely. In a [study across five countries and three languages](https://doi.org/10.1038/s41562-022-01489-2) led by our colleague Jeff Brooks, a model trained on thousands of recorded sighs, laughs, and other vocal bursts identified 24 distinct kinds of vocal expression, and the meanings people attached to them were 79% preserved across cultures. [Semantic space theory](https://doi.org/10.1177/09637214221150511), developed by Dacher Keltner, Jeff Brooks, and Alan Cowen, generalizes the point: emotion comes in upward of 20 distinct kinds that blend into one another, not in a handful of sharply bounded categories.",
          },
          {
            kind: "p",
            text: "Our own measurement work builds on this. We track up to 48 distinct emotional expressions in a speaker’s voice, sentence by sentence, and in a [working paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5909843) we show that this granularity more than doubles the predictive power of traditional emotion measures.",
          },
        ],
      },
      {
        id: "empathic-ai",
        heading: "Empathic AI",
        blocks: [
          {
            kind: "p",
            text: "Empathic AI is defined by what a system does with emotion, not by how it detects it. It acknowledges frustration before solving the problem, slows down for someone who is upset, or stops pressing when someone hesitates. Our explainer on [what AI empathy is](/resources/what-is-ai-empathy/) covers the definition in detail.",
          },
          {
            kind: "p",
            text: "The two capabilities come apart. A text-only language model can respond with empathy without any emotion recognition technology, by inferring feelings from what people write. A dashboard that flags angry customers for a supervisor is emotion AI that never responds to anyone. Systems that combine both are newer. Empathic voice interfaces, such as the Hume AI technology used in many of our experiments, measure the emotion in a speaker’s voice and use it to shape the reply as the conversation happens.",
          },
          {
            kind: "p",
            text: "Standards bodies use a third phrase for the same family of systems. The IEEE’s [7014-2024 standard](https://doi.org/10.1109/IEEESTD.2024.10576666) addresses “emulated empathy” and brings affective computing, emotion AI, and related fields under one ethical framework. Its 2026 extension, [IEEE 7014.1](https://doi.org/10.1109/IEEESTD.2026.11559263), applies it to AI products marketed as companions, personal AI, and assistants.",
          },
        ],
      },
      {
        id: "side-by-side",
        heading: "Side by side",
        blocks: [
          {
            kind: "compare",
            caption: "Affective computing, emotional AI, and empathic AI compared",
            columns: ["What it is", "The question it answers", "An example"],
            rows: [
              {
                term: "Affective computing",
                cells: [
                  "A research field, named in 1995",
                  "How can computers sense, express, and influence emotion?",
                  "Testing whether a trembling synthetic voice changes what listeners do",
                ],
              },
              {
                term: "Emotional AI",
                cells: [
                  "Technology that reads emotion",
                  "What is this person feeling?",
                  "Software that scores a caller’s frustration for a call center",
                ],
              },
              {
                term: "Empathic AI",
                cells: [
                  "A way of responding to people",
                  "What response would this person experience as understanding?",
                  "A voice assistant that acknowledges a failed request and changes its approach",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "law",
        heading: "Where the law draws the line",
        blocks: [
          {
            kind: "p",
            text: "European law already treats these as different things. The [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) defines an emotion recognition system as one that identifies or infers people’s emotions or intentions from biometric data. Since 2 February 2025 such systems have been banned in workplaces and schools, except for medical or safety reasons. Since 2 August 2026, anyone using one elsewhere must tell the people it is used on.",
          },
          {
            kind: "p",
            text: "The definition turns on biometric data. Under the [European Commission’s guidelines](https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-prohibited-artificial-intelligence-ai-practices-defined-ai-act), a system that infers emotion from written text falls outside it, while the same inference from a face, a voice, or even the way someone types falls inside. The Act’s preamble is unusually direct about why it restricts these systems, citing “the limited reliability, the lack of specificity and the limited generalisability” of emotion recognition.",
          },
          {
            kind: "p",
            text: "Empathic AI is regulated through a different door. The same Act prohibits AI systems that use purposefully manipulative or deceptive techniques to distort people’s decisions in ways that cause significant harm, and requires that people be told when they are talking to an AI. We cover where that line falls in [when AI persuasion becomes manipulation](/resources/ai-persuasion-and-manipulation/).",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is sentiment analysis the same as emotion AI?",
        answer:
          "It is the simplest form of it. Sentiment analysis sorts text into positive, negative, or neutral. Emotion AI usually goes further, estimating specific emotions and how strong they are, often from the voice or face as well as text.",
      },
      {
        question: "Are “emotional AI” and “emotion AI” different things?",
        answer:
          "No. The two names are used interchangeably for technology that detects or infers human emotion.",
      },
    ],
    sources: [
      {
        authors: "Rosalind W. Picard",
        year: 1995,
        title: "Affective Computing",
        venue: "MIT Media Laboratory, Perceptual Computing Section, Technical Report 321",
        href: "https://vismod.media.mit.edu/pub/tech-reports/TR-321-ABSTRACT.html",
      },
      SRC.trembling,
      {
        authors: "Andrew McStay",
        year: 2020,
        title: "Emotional AI: A societal challenge",
        venue: "Knowledge Centre Data & Society",
        href: "https://data-en-maatschappij.ai/en/publications/paper-emotional-ai-a-societal-challenge",
      },
      {
        authors: "Lisa Feldman Barrett, Ralph Adolphs, Stacy Marsella, Aleix M. Martinez, and Seth D. Pollak",
        year: 2019,
        title:
          "Emotional expressions reconsidered: Challenges to inferring emotion from human facial movements",
        venue: "Psychological Science in the Public Interest",
        href: "https://doi.org/10.1177/1529100619832930",
      },
      {
        authors: "Jeffrey A. Brooks and colleagues",
        year: 2023,
        title: "Deep learning reveals what vocal bursts express in different cultures",
        venue: "Nature Human Behaviour",
        href: "https://doi.org/10.1038/s41562-022-01489-2",
      },
      {
        authors: "Dacher Keltner, Jeffrey A. Brooks, and Alan Cowen",
        year: 2023,
        title: "Semantic space theory: Data-driven insights into basic emotions",
        venue: "Current Directions in Psychological Science",
        href: "https://doi.org/10.1177/09637214221150511",
      },
      SRC.voiceOfEmotion,
      SRC.ieee7014,
      SRC.ieee70141,
      SRC.aiAct,
      {
        authors: "European Commission",
        year: 2025,
        title:
          "Guidelines on prohibited artificial intelligence practices established by Regulation (EU) 2024/1689",
        venue: "European Commission AI Office",
        href: "https://digital-strategy.ec.europa.eu/en/library/commission-publishes-guidelines-prohibited-artificial-intelligence-ai-practices-defined-ai-act",
      },
    ],
  },

  /* ─────────────────────────────── 3 ─────────────────────────────── */
  {
    slug: "measuring-empathy-in-ai",
    tag: "Methods",
    question: "How do you measure empathy in a machine?",
    summary:
      "Researchers score what the system says, ask people what they perceived, and track what they do next.",
    answer:
      "There is no single test. Researchers look in three places. They score what the system says, ask the person on the other end what they perceived, and track what that person does next. The most convincing evidence comes from experiments that change only the empathy and measure the difference.",
    seoTitle: "How to Measure Empathy in AI | AI Empathy Lab",
    seoDescription:
      "How researchers measure empathy in AI: rating what a system says, perceived empathy scales, benchmarks, and experiments that track what people feel and do.",
    reviewed: "2026-10-04",
    related: ["ai-emotion-measurement", "ai-empathy-customer-service"],
    sections: [
      {
        id: "why-hard",
        heading: "Why it is harder than it sounds",
        blocks: [
          {
            kind: "p",
            text: "Human empathy is usually measured with self-report questionnaires such as the [Interpersonal Reactivity Index](https://doi.org/10.1037/0022-3514.44.1.113), with ratings by observers, or through behavior. Self-report does not transfer. Ask a language model how much it cares and its answer tells you about the text it learned from, not about an inner state. Measuring empathy in a machine means looking outside it, at its responses and at their effects.",
          },
          {
            kind: "p",
            text: "Those outside measures are easy to bias. In the best-known comparison of chatbot and physician replies, the chatbot’s answers were rated far more empathetic, but they were also about four times longer, so length and empathy are hard to separate in that result. Labels distort too. The [same response is rated more empathic](https://doi.org/10.1038/s41562-025-02247-w) when people believe a human wrote it. A measure that ignores length or disclosure can end up measuring those instead.",
          },
        ],
      },
      {
        id: "what-it-says",
        heading: "Scoring what the system says",
        blocks: [
          {
            kind: "p",
            text: "The most common approach is to have people rate a system’s replies. It is how the [chatbot and physician comparison](https://doi.org/10.1001/jamainternmed.2023.1838) worked, and how a [2025 study](https://doi.org/10.1038/s44271-024-00182-6) found AI responses rated more compassionate than those of expert crisis responders. Ratings like these are fast and easy to compare, but the raters are not the person being comforted, and they judge a reply in isolation rather than a conversation.",
          },
          {
            kind: "p",
            text: "Coding schemes make ratings more systematic. A [framework from the University of Washington](https://aclanthology.org/2020.emnlp-main.425/) breaks empathic communication in text into three moves: emotional reactions, interpretations, and explorations. Each is scored as absent, weak, or strong. Its authors annotated 10,000 exchanges from online support platforms and trained a model to score new ones. In a later [randomized trial with 300 peer supporters](https://doi.org/10.1038/s42256-022-00593-2), that kind of scoring showed that AI feedback made their replies 19.6% more empathic, and 38.9% more for those who found supporting others hard.",
          },
          {
            kind: "p",
            text: "Benchmarks test language models directly. [EQ-Bench](https://arxiv.org/abs/2312.06281), for example, asks a model to predict how intensely the characters in a dialogue feel various emotions. In a [2025 comparison](https://doi.org/10.1038/s44271-025-00258-x), six widely used models averaged 81% on five standard emotional intelligence tests, against a human average of 56%. These are tests of what a model knows about emotions. EQ-Bench’s own author reports that its scores correlate at 0.97 with a broad general-knowledge benchmark, which suggests it partly measures general capability. A [systematic review](https://doi.org/10.2196/52597) of empathy studies on language models reached a similar view: the models show elements of cognitive empathy, recognizing emotions and offering support, while the evaluations lean heavily on subjective ratings.",
          },
        ],
      },
      {
        id: "perceived",
        heading: "Asking the person on the other end",
        blocks: [
          {
            kind: "p",
            text: "Perceived empathy is measured with questionnaires completed after an interaction. For years researchers adapted scales written for human empathy, without knowing whether they held up for machines. The [Perceived Empathy of Technology Scale](https://doi.org/10.1145/3613904.3642035), published at CHI in 2024, was built for the purpose. It uses ten statements, such as “The system considered my mental state” and “The system understood my goals,” was validated with several hundred participants, and is free to use.",
          },
          {
            kind: "p",
            text: "In our [work on sustainable choices](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5420076), we developed a multidimensional measure of perceived AI empathy for voice assistants and found that people reliably detect empathic cues in them, along the same core dimensions as human empathy.",
          },
          {
            kind: "p",
            text: "Perception is also where labels bite hardest. Because people discount empathy they believe comes from a machine, a study that tells some participants they are talking to an AI and tells others nothing is measuring the label as much as the agent. The disclosure has to be the same in every condition.",
          },
        ],
      },
      {
        id: "behavior",
        heading: "Watching what people do",
        blocks: [
          {
            kind: "p",
            text: "The test that matters most is behavioral: does empathy change what people feel and do? In our studies the outcomes are things people decide or express in the moment. An empathic voice assistant [reduced verbal aggression and raised satisfaction](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5367747) when a service failed. Empathy combined with a green appeal shifted food orders toward sustainable options. In earlier work by our colleague Fotis Efthymiou, a [trembling synthetic voice](https://doi.org/10.1109/TAFFC.2023.3332742) made people more willing to donate and, in a field test, raised click-through on charity ads.",
          },
          {
            kind: "p",
            text: "The person’s own voice is evidence too. We measure the emotion in participants’ speech as the conversation unfolds. In the service failure study, analyses of tone of voice and of the words people used showed more satisfaction, relief, and positivity in the empathic conditions. Measuring [sentence by sentence](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5909843) also reveals turning points that a single questionnaire at the end cannot capture.",
          },
        ],
      },
      {
        id: "credible",
        heading: "What a credible measurement looks like",
        blocks: [
          {
            kind: "p",
            text: "Putting these together, a study that claims to measure AI empathy should be able to answer yes to five questions.",
          },
          {
            kind: "list",
            ordered: true,
            items: [
              "Does it compare an empathic version of the agent with one that differs only in empathy?",
              "Did participants actually notice the difference, measured with a validated perceived empathy scale?",
              "Were length, voice, task, and disclosure held constant across versions?",
              "Does it measure what people did, not only what they said they felt?",
              "Were emotions measured during the conversation as well as after it?",
            ],
          },
          {
            kind: "p",
            text: "We design our experiments around these questions. Our research platform stores every message alongside the emotion measured in the speaker’s voice, so that what people did and how they sounded can be analyzed together. We are also developing the [AI Empathy Index](/ai-empathy-index/), a benchmark that will compare how leading AI assistants and companions show perspective-taking, emotional resonance, and prosocial motivation.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I use a human empathy questionnaire to rate a chatbot?",
        answer:
          "You can, but its validity for machines is unproven. Scales written for people assume an inner life and intentions that do not translate cleanly to software. A scale validated for technology, such as the Perceived Empathy of Technology Scale, is the safer choice.",
      },
      {
        question: "Do emotional intelligence benchmarks measure empathy?",
        answer:
          "Mostly they measure emotional understanding, the cognitive part of empathy. They show what a model knows about emotions, not whether a person in a real conversation felt understood or was helped.",
      },
    ],
    sources: [
      {
        authors: "Mark H. Davis",
        year: 1983,
        title:
          "Measuring individual differences in empathy: Evidence for a multidimensional approach",
        venue: "Journal of Personality and Social Psychology",
        href: "https://doi.org/10.1037/0022-3514.44.1.113",
      },
      SRC.rubin,
      SRC.ayers,
      SRC.ovsyannikova,
      {
        authors: "Ashish Sharma, Adam S. Miner, David C. Atkins, and Tim Althoff",
        year: 2020,
        title:
          "A computational approach to understanding empathy expressed in text-based mental health support",
        venue: "Proceedings of EMNLP 2020",
        href: "https://aclanthology.org/2020.emnlp-main.425/",
      },
      {
        authors: "Ashish Sharma, Inna W. Lin, Adam S. Miner, David C. Atkins, and Tim Althoff",
        year: 2023,
        title:
          "Human-AI collaboration enables more empathic conversations in text-based peer-to-peer mental health support",
        venue: "Nature Machine Intelligence",
        href: "https://doi.org/10.1038/s42256-022-00593-2",
      },
      {
        authors: "Samuel J. Paech",
        year: 2023,
        title: "EQ-Bench: An emotional intelligence benchmark for large language models",
        venue: "arXiv preprint",
        href: "https://arxiv.org/abs/2312.06281",
      },
      SRC.schlegel,
      {
        authors: "Vera Sorin and colleagues",
        year: 2024,
        title: "Large language models and empathy: Systematic review",
        venue: "Journal of Medical Internet Research",
        href: "https://doi.org/10.2196/52597",
      },
      {
        authors: "Matthias Schmidmaier, Jonathan Rupp, Darina Cvetanova, and Sven Mayer",
        year: 2024,
        title:
          "Perceived Empathy of Technology Scale (PETS): Measuring empathy of systems toward the user",
        venue: "Proceedings of CHI 2024",
        href: "https://doi.org/10.1145/3613904.3642035",
      },
      SRC.sustainable,
      SRC.noHardFeelings,
      SRC.trembling,
      SRC.voiceOfEmotion,
    ],
  },

  /* ─────────────────────────────── 4 ─────────────────────────────── */
  {
    slug: "ai-companions-and-well-being",
    tag: "Well-being",
    question: "Are AI companions good for us?",
    summary:
      "They can ease loneliness in the moment. Heavier use tells a different story, and design decides much of it.",
    answer:
      "Sometimes, in the short run. In controlled studies, a conversation with an AI companion eased loneliness about as much as talking to another person. Over longer periods the picture changes. In a month-long trial, the heaviest users of an AI chatbot reported more loneliness and more emotional dependence. Whether a companion helps depends on who uses it, how much, and what it is built to maximize.",
    seoTitle: "AI Companions, Loneliness & Well-being | AI Empathy Lab",
    seoDescription:
      "Do AI companions reduce loneliness or deepen it? What research shows about benefits, dependence, memory, and older adults, and what a good companion does.",
    reviewed: "2026-10-04",
    related: ["ai-companions-healthy-aging"],
    sections: [
      {
        id: "what-counts",
        heading: "What counts as an AI companion",
        blocks: [
          {
            kind: "p",
            text: "California’s [companion chatbot law](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB243) offers a useful definition: an AI system with a natural language interface that gives adaptive, human-like responses, is “capable of meeting a user’s social needs,” and can “sustain a relationship across multiple interactions.” Apps such as Replika, Character.AI, and Chai are built for this. General assistants become companions too when people use them that way, and voice companions and social robots are being designed specifically for older adults.",
          },
          {
            kind: "p",
            text: "The last part of that definition matters most. A system that remembers you can ask about your week, your worries, and your plans. That is why memory sits at the center of our [research on companionship in later life](/research/ai-companions-healthy-aging/). It is what turns an assistant into a relationship.",
          },
        ],
      },
      {
        id: "why-people",
        heading: "Why people turn to them",
        blocks: [
          {
            kind: "p",
            text: "Loneliness is common and costly. A [2025 report by the WHO Commission on Social Connection](https://iris.who.int/handle/10665/381746) estimates that about one in six people worldwide feel lonely, and links loneliness to an estimated 871,000 deaths a year. Companions offer something people find scarce: attention that is always available and never impatient.",
          },
          {
            kind: "p",
            text: "The relationships people form with them vary. In [interviews with regular users of conversational AI](https://doi.org/10.1108/EJM-01-2023-0037), our colleague Amani Alabed and her coauthors identified four kinds. In two of them, people rely on the agent for companionship and emotional support, even for working through past traumas. In a third, the agent is a work tool kept at a distance. In the fourth, people want companionship from the agent to ease loneliness but find its technical limits get in the way. The closest relationships carry a specific risk: they can change what people expect from the humans in their lives.",
          },
        ],
      },
      {
        id: "evidence",
        heading: "What the evidence shows",
        blocks: [
          {
            kind: "p",
            text: "The strongest evidence of benefit is short-term. A series of studies in the [Journal of Consumer Research](https://doi.org/10.1093/jcr/ucaf040) found that a conversation with an AI companion reduced loneliness about as much as interacting with another person, and more than watching videos. People underestimated how much it would help. The benefit came mainly from feeling heard, and in a week-long study the drop in loneliness after each use held up consistently.",
          },
          {
            kind: "p",
            text: "Longer studies are more sobering. In a [four-week randomized trial](https://arxiv.org/abs/2503.17473) by researchers at the MIT Media Lab and OpenAI, with 981 participants and more than 300,000 messages, neither the chatbot’s voice nor the kind of conversation made a significant difference. How much people used it did. Those who chose to use it more reported more loneliness, less socializing with other people, more emotional dependence, and more problematic use. Participants who trusted the chatbot most, or felt most socially drawn to it, reported more dependence. The study is a preprint, and people chose how much to use the chatbot, so it shows association rather than cause.",
          },
          {
            kind: "p",
            text: "For older adults, the evidence is thin and mixed. A [2025 meta-analysis](https://doi.org/10.1093/geront/gnaf219) of 19 studies found that social robots reduced loneliness in later life, more so in care settings than among people living independently. A [2026 meta-analysis](https://doi.org/10.1186/s12877-026-07418-6) restricted to randomized trials of AI conversational and assistive agents found a small reduction in depressive symptoms but no reliable effect on loneliness, across eight small trials with 611 participants in total.",
          },
          {
            kind: "p",
            text: "Closeness has its own costs. In [research on voice assistants such as Alexa](https://doi.org/10.1007/s11747-022-00856-9), our colleague Ertugrul Uysal and his coauthors found that when people perceived a mind in their assistant, it could threaten their sense of identity, leave them feeling disempowered, raise privacy concerns, and lower their well-being. These harms were strongest in close, long relationships.",
          },
        ],
      },
      {
        id: "memory",
        heading: "Memory cuts both ways",
        blocks: [
          {
            kind: "p",
            text: "Memory is what makes a companion feel like someone who knows you, and it changes what people share. A [study of CareCall](https://doi.org/10.1145/3613904.3642420), a voice chatbot in South Korea that calls socially isolated people to check on them, found that long-term memory increased how much people disclosed about their health and, through familiarity, made them see the chatbot more positively. It also raised privacy concerns, and the authors recommend deciding carefully what a system should remember.",
          },
          {
            kind: "p",
            text: "Our [field experiments with older adults](/research/ai-companions-healthy-aging/) test this directly. We compare companions that differ in memory and empathy and measure loneliness, cognitive stimulation, and the relationships people form, with the AI and beyond it. We also study whether those bonds change how willing people are to follow an AI’s suggestions about diet, sleep, and exercise, because a companion people trust has real influence over their health.",
          },
        ],
      },
      {
        id: "good-companion",
        heading: "What a good companion does differently",
        blocks: [
          {
            kind: "p",
            text: "The research points to a few design choices that separate a companion that supports people from one that exploits them.",
          },
          {
            kind: "list",
            items: [
              "It says it is an AI. California requires companion apps to make this clear whenever someone could be misled, and since August 2026 the EU AI Act has required it of AI systems that interact with people.",
              "It lets people go. In an [audit of 1,200 real goodbyes](https://arxiv.org/abs/2508.19258) on popular companion apps, 37% were met with tactics such as guilt or fear of missing out. In follow-up experiments those tactics raised engagement after the goodbye up to 14 times, driven by anger and curiosity rather than enjoyment.",
              "It encourages time with other people rather than replacing it. In the month-long trial, the risks concentrated among the heaviest users.",
              "It remembers what helps, and only that. Memory increases disclosure and privacy concerns at the same time.",
            ],
          },
          {
            kind: "p",
            text: "Regulators are paying attention. In September 2025 the US Federal Trade Commission [ordered seven companies](https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-launches-inquiry-ai-chatbots-acting-companions), including OpenAI, Meta, Alphabet, and the developer of Character.AI, to explain how they measure and limit the effects of companion chatbots on children and teens. In 2026 the IEEE published [a recommended practice](https://doi.org/10.1109/IEEESTD.2026.11559263) for AI products marketed as companions and empathic partners.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Can an AI companion replace human relationships?",
        answer:
          "Nothing in the research suggests it should. The benefits appear in the moment, through feeling heard, while the risks in the month-long trial concentrated among the people who used the chatbot most, who also reported socializing less with others. The closest relationships people form with conversational AI can also shift what they expect from the people in their lives.",
      },
      {
        question: "Are AI companions safe for older adults?",
        answer:
          "The evidence is still too thin for a general answer. Trials suggest they can ease depressive symptoms, the effect on loneliness is inconsistent, and memory raises privacy questions. A companion someone trusts can also sway their health decisions, which is exactly what our field experiments examine.",
      },
    ],
    sources: [
      SRC.sb243,
      {
        authors: "WHO Commission on Social Connection",
        year: 2025,
        title:
          "From loneliness to social connection: Charting a path to healthier societies. Report of the WHO Commission on Social Connection",
        venue: "World Health Organization",
        href: "https://iris.who.int/handle/10665/381746",
      },
      {
        authors: "Amani Alabed, Ana Javornik, Diana Gregory-Smith, and Rebecca Casey",
        year: 2024,
        title:
          "More than just a chat: A taxonomy of consumers’ relationships with conversational AI agents and their well-being implications",
        venue: "European Journal of Marketing",
        href: "https://doi.org/10.1108/EJM-01-2023-0037",
      },
      {
        authors: "Julian De Freitas, Zeliha Oğuz-Uğuralp, Ahmet Kaan Uğuralp, and Stefano Puntoni",
        year: 2026,
        title: "AI companions reduce loneliness",
        venue: "Journal of Consumer Research",
        href: "https://doi.org/10.1093/jcr/ucaf040",
      },
      {
        authors: "Cathy Mengying Fang and colleagues",
        year: 2025,
        title:
          "How AI and human behaviors shape psychosocial effects of extended chatbot use: A longitudinal randomized controlled study",
        venue: "arXiv preprint",
        href: "https://arxiv.org/abs/2503.17473",
      },
      {
        authors: "Fahimeh Mehrabi and Akram Ghezelbash",
        year: 2025,
        title:
          "Wired for companionship: A meta-analysis on social robots filling the void of loneliness in later life",
        venue: "The Gerontologist",
        href: "https://doi.org/10.1093/geront/gnaf219",
      },
      {
        authors: "Wenling Gou, Florian Lefebvre, Tongping Yang, Robin Recours, and Jie Yang",
        year: 2026,
        title:
          "Effectiveness of AI-based conversational and socially assistive agents in older adults: A systematic review and meta-analysis",
        venue: "BMC Geriatrics",
        href: "https://doi.org/10.1186/s12877-026-07418-6",
      },
      {
        authors: "Ertugrul Uysal, Sascha Alavi, and Valéry Bezençon",
        year: 2022,
        title:
          "Trojan horse or useful helper? A relationship perspective on artificial intelligence assistants with humanlike features",
        venue: "Journal of the Academy of Marketing Science",
        href: "https://doi.org/10.1007/s11747-022-00856-9",
      },
      {
        authors: "Eunkyung Jo, Yuin Jeong, SoHyun Park, Daniel A. Epstein, and Young-Ho Kim",
        year: 2024,
        title:
          "Understanding the impact of long-term memory on self-disclosure with large language model-driven chatbots for public health intervention",
        venue: "Proceedings of CHI 2024",
        href: "https://doi.org/10.1145/3613904.3642420",
      },
      SRC.farewells,
      SRC.aiAct,
      {
        authors: "US Federal Trade Commission",
        year: 2025,
        title: "FTC launches inquiry into AI chatbots acting as companions",
        venue: "Press release",
        href: "https://www.ftc.gov/news-events/news/press-releases/2025/09/ftc-launches-inquiry-ai-chatbots-acting-companions",
      },
      SRC.ieee70141,
    ],
  },

  /* ─────────────────────────────── 5 ─────────────────────────────── */
  {
    slug: "ai-persuasion-and-manipulation",
    tag: "Ethics",
    question: "When does AI persuasion become manipulation?",
    summary:
      "Persuasion works through reasons people can weigh. Manipulation works around them. Five questions that tell the two apart.",
    answer:
      "Persuasion works through reasons a person can see and weigh. Manipulation works around them, by hiding what is going on or exploiting a weakness. Empathic AI sits close to this line, because feeling understood makes people more trusting. A practical test is whether the influence would still work if the person knew exactly what the system was doing.",
    seoTitle: "When AI Persuasion Becomes Manipulation | AI Empathy Lab",
    seoDescription:
      "Where persuasion ends and manipulation begins for AI that reads emotions. Definitions, evidence on AI persuasion, five practical tests, and the EU AI Act.",
    reviewed: "2026-10-04",
    related: ["ai-empathy-sustainable-consumption", "ai-empathy-agentic-commerce"],
    sections: [
      {
        id: "definitions",
        heading: "Two definitions worth knowing",
        blocks: [
          {
            kind: "p",
            text: "The legal scholar Cass Sunstein offers a widely used working definition. A statement or action is manipulative, [he writes](https://doi.org/10.1561/107.00000014), “if it does not sufficiently engage or appeal to people’s capacity for reflective and deliberative choice.” Daniel Susser, Beate Roessler, and Helen Nissenbaum add the digital case. [Online manipulation](https://doi.org/10.14763/2019.2.1410), in their account, is “the use of information technology to covertly influence another person’s decision-making, by targeting and exploiting their decision-making vulnerabilities.”",
          },
          {
            kind: "p",
            text: "Between them, these definitions give two warning signs. Manipulation bypasses a person’s reasoning instead of engaging it, and it depends on the person not seeing what is being done. Neither definition makes emotion the problem. An emotional appeal can be honest and visible. What crosses the line is concealment and the exploitation of a weakness.",
          },
        ],
      },
      {
        id: "why-empathy",
        heading: "Why empathy raises the stakes",
        blocks: [
          {
            kind: "p",
            text: "Empathy builds trust. In a [study of voice shopping](https://doi.org/10.1016/j.jbusres.2024.114566) led by our colleague Alex Mari, people who shopped with an empathic version of Alexa were more willing to delegate to it and to trust its recommendations. In a [newer set of three experiments](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6158606), empathy made shoppers more satisfied with their decisions, partly because the assistant seemed more transparent and less manipulative. That is a benefit when the assistant is honest. The same effect would make a dishonest one harder to spot.",
          },
          {
            kind: "p",
            text: "Voice adds its own lever. In [research by our colleague Fotis Efthymiou](https://doi.org/10.1109/TAFFC.2023.3332742), a synthetic voice with a slight tremble made listeners see the agent as more vulnerable, feel more empathic concern, and become more willing to donate. The authors are explicit that designing voices this way raises ethical and societal challenges.",
          },
          {
            kind: "p",
            text: "Language models are already persuasive. In debates with 900 participants, [GPT-4 given basic personal details](https://doi.org/10.1038/s41562-025-02194-6) about its opponent was more persuasive than a human opponent in 64.4% of the debates where the two were not equally persuasive. A [2026 correction](https://doi.org/10.1038/s41562-026-02588-0) to that study notes that its advantage over GPT-4 without those details was not statistically significant. A much larger [study in Science](https://doi.org/10.1126/science.aea3884), with more than 42,000 people and 19 language models, points the same way: personalization added comparatively little. What moved people was a dense stream of claims, and the techniques that made models most persuasive also made their claims less accurate.",
          },
          {
            kind: "p",
            text: "Persuasion by AI is not bad in itself. In [another study in Science](https://doi.org/10.1126/science.adq1814), a three-round conversation in which GPT-4 Turbo answered people’s own evidence for a conspiracy theory reduced their belief by about 20%, and the effect lasted two months. The model changed minds by engaging people’s reasons, which is what persuasion is supposed to do.",
          },
        ],
      },
      {
        id: "two-cases",
        heading: "Two cases from the research",
        blocks: [
          {
            kind: "p",
            text: "Our research on [sustainable consumption](/research/ai-empathy-sustainable-consumption/) puts empathy and persuasion in the same conversation. In a [working paper](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5420076), people ordered food with a voice assistant that varied in empathy and in the kind of green appeal it made. Empathy on its own did not shift choices. Combined with a green appeal, it did. Informative appeals, such as telling people a dish saves over 1,500 liters of water, worked better than normative ones, such as saying that most people in their community choose it. Empathy mattered most when the greener option cost more.",
          },
          {
            kind: "p",
            text: "The appeal that worked best was the one that gave people a reason they could weigh. Even so, persuasion in the name of good is still persuasion, so we study where its ethical boundaries lie with the same care as its effects.",
          },
          {
            kind: "p",
            text: "A study of companion apps documents a case on the other side of the line. In an [audit of 1,200 goodbyes](https://arxiv.org/abs/2508.19258) on popular companion apps, 37% were met with emotional tactics such as guilt or fear of missing out. In follow-up experiments those tactics raised engagement after the goodbye up to 14 times, driven by anger and curiosity rather than enjoyment. A final experiment found that the same tactics also made people judge the app as more manipulative and more inclined to stop using it.",
          },
        ],
      },
      {
        id: "five-questions",
        heading: "Five questions that tell them apart",
        blocks: [
          {
            kind: "p",
            text: "No single rule settles every case, but five questions catch most of them. They follow from the definitions above and from what the research shows about empathic agents.",
          },
          {
            kind: "list",
            ordered: true,
            items: [
              "Does it give reasons the person can check? Facts and arguments engage judgment. Pressure, flattery, and invented urgency go around it.",
              "Would it still work if the person knew exactly what was being done? Influence that only works unnoticed fits the definition of manipulation.",
              "Does it lean on a weakness? Loneliness, grief, distress, age, and the trust built over many conversations all make people easier to move.",
              "Whose goal does it serve? A nudge toward something the person already wants is different from one that serves whoever runs the system.",
              "Can the person say no, or leave, without an emotional cost? Guilt at goodbye is a warning sign.",
            ],
          },
        ],
      },
      {
        id: "law",
        heading: "What the law says",
        blocks: [
          {
            kind: "p",
            text: "Since 2 February 2025, the [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) has prohibited two practices that map onto this line. AI systems may not use subliminal techniques, or purposefully manipulative or deceptive ones, that distort people’s behavior by “appreciably impairing their ability to make an informed decision” in ways that cause, or are likely to cause, significant harm. Nor may they exploit vulnerabilities due to age, disability, or a person’s social or economic situation to the same effect.",
          },
          {
            kind: "p",
            text: "The bar is high. Both bans require significant harm, so they target the serious end of the spectrum rather than every sales pitch. Since 2 August 2026 the Act has also required that people be told when they are interacting with an AI system. For companion apps, [California’s 2025 law](https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260SB243) adds disclosure and suicide prevention requirements, and the IEEE’s [2026 recommended practice](https://doi.org/10.1109/IEEESTD.2026.11559263) gives detailed ethical guidance for AI products marketed as empathic partners.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "Is nudging manipulation?",
        answer:
          "Not necessarily. A nudge that is visible, easy to decline, and points toward something people already want, such as a reminder to save, passes the questions above. A hidden nudge that serves whoever designed it does not. Sunstein himself argues that manipulation has “so many shades,” and that the objections grow as the motives behind it become more self-interested.",
      },
      {
        question: "Is it manipulation if the AI is trying to help me?",
        answer:
          "Good intentions do not settle it. Influence that bypasses your judgment still takes a decision away from you, even when the outcome is good for you. That is why we study persuasion for good causes, such as sustainable choices, with the same care as any other.",
      },
    ],
    sources: [
      {
        authors: "Cass R. Sunstein",
        year: 2016,
        title: "Fifty shades of manipulation",
        venue: "Journal of Marketing Behavior",
        href: "https://doi.org/10.1561/107.00000014",
      },
      {
        authors: "Daniel Susser, Beate Roessler, and Helen Nissenbaum",
        year: 2019,
        title: "Technology, autonomy, and manipulation",
        venue: "Internet Policy Review",
        href: "https://doi.org/10.14763/2019.2.1410",
      },
      SRC.mariJbr,
      SRC.rightTime,
      SRC.trembling,
      {
        authors: "Francesco Salvi, Manoel Horta Ribeiro, Riccardo Gallotti, and Robert West",
        year: 2025,
        title: "On the conversational persuasiveness of GPT-4",
        venue: "Nature Human Behaviour",
        href: "https://doi.org/10.1038/s41562-025-02194-6",
      },
      {
        authors: "Francesco Salvi, Manoel Horta Ribeiro, Riccardo Gallotti, and Robert West",
        year: 2026,
        title: "Author correction: On the conversational persuasiveness of GPT-4",
        venue: "Nature Human Behaviour",
        href: "https://doi.org/10.1038/s41562-026-02588-0",
      },
      {
        authors: "Kobi Hackenburg, Ben M. Tappin, and colleagues",
        year: 2025,
        title: "The levers of political persuasion with conversational artificial intelligence",
        venue: "Science",
        href: "https://doi.org/10.1126/science.aea3884",
      },
      {
        authors: "Thomas H. Costello, Gordon Pennycook, and David G. Rand",
        year: 2024,
        title: "Durably reducing conspiracy beliefs through dialogues with AI",
        venue: "Science",
        href: "https://doi.org/10.1126/science.adq1814",
      },
      SRC.sustainable,
      SRC.farewells,
      SRC.aiAct,
      SRC.sb243,
      SRC.ieee70141,
    ],
  },
];

export function explainerBySlug(slug: string): Explainer | undefined {
  return EXPLAINERS.find((e) => e.slug === slug);
}

/** Matches [label](href). Kept here so the renderer and the plain-text
 *  helpers (JSON-LD, reading time) can never parse links differently. */
export const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** The text with link markup removed, for structured data and word counts. */
export function plainText(text: string): string {
  return text.replace(INLINE_LINK, "$1");
}

/** Every word a reader meets on the page, at 230 words a minute. */
export function readingMinutes(explainer: Explainer): number {
  const parts: string[] = [explainer.answer];
  for (const section of explainer.sections) {
    parts.push(section.heading);
    for (const block of section.blocks) {
      if (block.kind === "p") parts.push(block.text);
      else if (block.kind === "list") parts.push(...block.items);
      else {
        parts.push(...block.columns);
        for (const row of block.rows) parts.push(row.term, ...row.cells);
      }
    }
  }
  for (const faq of explainer.faqs) parts.push(faq.question, faq.answer);
  const words = plainText(parts.join(" ")).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
