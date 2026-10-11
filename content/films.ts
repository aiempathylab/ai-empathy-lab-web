/**
 * The films on the site, and the files each one is served as.
 *
 * A film's files are made from its master by scripts/film/prepare_film.sh,
 * never by hand: three codecs in the order the player prefers them, two
 * sizes, and a poster at three widths. The master lives in the motion
 * studio (../ai-empathy-lab-motion), which owns the film itself.
 *
 * Every fact a film shows has to be true of what is deployed, like every
 * other sentence on the site, and a film is harder to correct than a
 * sentence: once its file is published it is in this public repository's
 * history for good.
 */
export interface FilmSource {
  src: string;
  codec: "av1" | "hevc" | "h264";
  height: 720 | 1080;
  /** Container and codec string, as canPlayType reads them. */
  type: string;
}

export interface Film {
  /** What the film is, for the player's label and for search engines. */
  name: string;
  description: string;
  /** The words on screen, in order: what a reader who cannot watch gets,
   *  and what search and answer engines read. */
  transcript: string;
  seconds: number;
  /** The day the film went live, as search engines want it. */
  published: string;
  /** Poster files, `${poster}-${width}.avif` and `.jpg`. */
  poster: string;
  posterWidths: number[];
  /** Best first: AV1, then HEVC, then H.264. */
  sources: FilmSource[];
}

const AUDIO = "mp4a.40.2";

/** The five files prepare_film.sh makes for a film called `name`. */
function sources(name: string): FilmSource[] {
  const base = `/media/film/${name}`;
  return [
    { src: `${base}-1080.av1.mp4`, codec: "av1", height: 1080, type: `video/mp4; codecs="av01.0.09M.10, ${AUDIO}"` },
    { src: `${base}-720.av1.mp4`, codec: "av1", height: 720, type: `video/mp4; codecs="av01.0.08M.10, ${AUDIO}"` },
    { src: `${base}-1080.hevc.mp4`, codec: "hevc", height: 1080, type: `video/mp4; codecs="hvc1.2.4.L123.B0, ${AUDIO}"` },
    { src: `${base}-720.hevc.mp4`, codec: "hevc", height: 720, type: `video/mp4; codecs="hvc1.2.4.L120.B0, ${AUDIO}"` },
    { src: `${base}-720.h264.mp4`, codec: "h264", height: 720, type: `video/mp4; codecs="avc1.640032, ${AUDIO}"` },
  ];
}

export const FILMS = {
  platform: {
    name: "How one call works on the AI Empathy Lab research platform",
    description:
      "A participant joins a study and talks to a live AI voice agent. The emotion in their voice is scored every turn, a threshold the researcher set changes how the agent answers, and the change is recorded as data.",
    transcript:
      "A participant opens a link and talks to a working AI voice agent. Two arms. One difference. Their voice is scored every turn. When a value crosses the line you drew, the agent answers differently, and the change is recorded as data. One platform. Six services: Hume for expression measurement, ElevenLabs and Cartesia to listen and speak, Anthropic and OpenAI for the reply, and Google, one model end to end. The research platform for empathic AI.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/the-platform-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("the-platform"),
  },
  /** The first of one film per explainer, on /resources/what-is-ai-empathy/. */
  whatIsAiEmpathy: {
    name: "What is AI empathy?",
    description:
      "AI empathy in 45 seconds: a machine that recognizes how someone feels, understands why, and responds in a way that helps. It describes behavior, not an inner experience, and people often rate it above a human's until they learn a machine wrote it.",
    transcript:
      "What is AI empathy? It recognizes how someone feels. A person says: it has been three weeks, and nobody has got back to me. The agent reads frustration, and understands why: no answer in three weeks. And it responds in a way that helps: three weeks is far too long, I am sorry, and I will sort it out today. Behavior, not an inner experience: what it does is recognize how a person feels, understand why, and respond in a way that helps, and there is no evidence it shares the feeling. People often rate it above a human’s, until they learn a machine wrote it. Built into what people talk to every day: customer service agents, shopping assistants, voice assistants, and companion apps. Making sense of machines that make sense of us.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/what-is-ai-empathy-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("what-is-ai-empathy"),
  },
  /** On /resources/empathic-ai-emotional-ai-affective-computing/. */
  threeTerms: {
    name: "What separates empathic AI, emotional AI, and affective computing?",
    description:
      "Three terms in 45 seconds: affective computing is the research field, emotional AI reads emotion, and empathic AI responds to it. The two capabilities come apart, newer systems do both, and European law treats them differently.",
    transcript:
      "What separates empathic AI, emotional AI, and affective computing? Affective computing is the field: a research field, named in 1995, asking how computers can sense, express, and influence emotion. Emotional AI reads emotion: technology that reads it from a face, a voice, text, or the body, asking what this person is feeling. Empathic AI responds to it: a way of responding to people, asking what response this person would experience as understanding. Sorry, that did not work. Let me try another way. The two come apart: a text-only language model responds with empathy but reads no emotion, inferring feelings from what people write, and a dashboard that flags angry customers reads emotion but never responds to anyone. Newer systems do both: empathic voice interfaces measure the emotion in a speaker’s voice and use it to shape the reply as the conversation happens. European law treats them differently. Under the EU AI Act, emotion recognition from a face, a voice, or typing has been banned at work and in schools since February 2025, except for medical or safety reasons, and elsewhere, since August 2026, the people it is used on must be told. Empathic AI, through a different door: no manipulative or deceptive techniques that cause significant harm, and people must be told it is an AI. Making sense of machines that make sense of us.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/three-terms-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("three-terms"),
  },
  measuring: {
    name: "How do you measure empathy in a machine?",
    description:
      "How researchers measure empathy in a machine, in 45 seconds: there is no single test, so they score what the system says, ask what the person perceived, and track what they do next. The most convincing evidence changes only the empathy, and a credible measurement answers yes to five questions.",
    transcript:
      "How do you measure empathy in a machine? There is no single test. There are three places to look: what it says, what they perceived, and what they do next. Score what the system says: people rate its replies, each reply coded as three moves, emotional reactions, interpretations, and explorations, each absent, weak, or strong. Ask what the person perceived: a questionnaire after the conversation, ten statements, such as “The system considered my mental state” and “The system understood my goals”. Track what they do next: what people decide or express in the moment, such as satisfaction, verbal aggression, sustainable choices, and donations. Their own voice is evidence too. The most convincing evidence changes only the empathy: two versions with the same task, voice, length, and disclosure, empathy off in version A and on in version B, and measure the difference. What a credible measurement looks like: only the empathy differs between the two versions, people noticed the difference on a validated scale, length, voice, task, and disclosure are held constant, it measures what people did, not only what they said, and emotions are measured during the conversation, not only after. Making sense of machines that make sense of us.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/measuring-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("measuring"),
  },
  companions: {
    name: "Are AI companions good for us?",
    description:
      "What the research says about AI companions, in 45 seconds: in the short run a conversation eased loneliness about as much as talking to another person, mainly through feeling heard. Over a month the heaviest users reported more loneliness, and a good companion does four things differently.",
    transcript:
      "Are AI companions good for us? Sometimes, in the short run. You: I have barely talked to anyone this week. Companion: That sounds lonely. Do you want to tell me about it? It eased loneliness about as much as talking to another person. After: less lonely. Why: feeling heard. Over longer periods the picture changes. In a month-long trial, neither the chatbot’s voice nor the kind of conversation made a significant difference. How much people used it did. The heaviest users reported more loneliness: those who used it more reported more loneliness, less socializing with other people, more emotional dependence, and more problematic use. People chose how much to use it, so this shows association rather than cause. Whether a companion helps depends on who uses it, how much, and what it is built to maximize. What a good companion does differently: it says it is an AI, required by the EU AI Act since August 2026. It lets people go, with no guilt or fear of missing out when they say goodbye. It encourages time with other people, since the risks concentrated among the heaviest users. It remembers what helps, and only that, since memory increases disclosure and privacy concerns at the same time. Making sense of machines that make sense of us.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/companions-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("companions"),
  },
  persuasion: {
    name: "When does AI persuasion become manipulation?",
    description:
      "Where persuasion ends and manipulation begins, in 45 seconds: persuasion works through reasons a person can see and weigh, manipulation works around them. Emotion is not the problem, empathic AI sits close to the line, and five questions tell the two apart.",
    transcript:
      "When does AI persuasion become manipulation? Persuasion works through reasons a person can see and weigh. Persuasion says: “This dish needs far less water to make. Want to see how much?” It works by a reason you can check. Manipulation works around them. Manipulation says: “Leaving already? I will miss you.” It works by guilt at goodbye. Emotion is not the problem. Facts, arguments, and an honest, visible emotional appeal engage judgment. Concealment, exploiting a weakness, and invented urgency cross the line. Empathic AI sits close to this line. Shoppers who used an empathic voice assistant were more willing to delegate to it and more trusting of its recommendations. A benefit when the assistant is honest. The same effect would make a dishonest one harder to spot. Would it still work if the person knew exactly what was being done? If they knew, the persuasion still works and the manipulation stops working. Five questions that tell them apart. One, does it give reasons the person can check? Facts and arguments engage judgment. Two, would it still work if the person knew exactly what was being done? Influence that only works unnoticed fits the definition of manipulation. Three, does it lean on a weakness? Loneliness, grief, distress, age, and the trust built over many conversations. Four, whose goal does it serve? Something the person already wants, or whoever runs the system. Five, can the person say no, or leave, without an emotional cost? Guilt at goodbye is a warning sign. Making sense of machines that make sense of us.",
    seconds: 45,
    published: "2026-10-11",
    poster: "/media/film/persuasion-poster",
    posterWidths: [640, 1280, 1920],
    sources: sources("persuasion"),
  },
} satisfies Record<string, Film>;

export type FilmKey = keyof typeof FILMS;
