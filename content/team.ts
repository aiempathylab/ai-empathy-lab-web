/**
 * The team. Bios are verbatim from the lab's content document.
 *
 * PHOTOS. The content document embeds seven headshots in one block at the
 * end of the team section with nothing tying a photo to a name, and there
 * are eight people. Every mapping below was therefore VERIFIED against the
 * person's own published photograph, reachable from the profile links in
 * this file (2026-08-28):
 *   photo-1  Alex Mari         alexmari.phd
 *   photo-2  Ertugrul Uysal    techmarketing.ethz.ch
 *   photo-3  Amani Alabed      the only woman on the team
 *   photo-4  Fotis Efthymiou   delta-labs.ch — the identical photograph
 *   photo-5  Maqbool Khan      maqboolkhan.com
 *   photo-6  Jeff Brooks       jeffreyallenbrooks.github.io
 *   photo-7  Danylo Provodov   confirmed by Danylo
 *   photo-8  Illia Orel        supplied directly by Danylo
 *   photo-10 Yasmeen Masalmeh  supplied by Yasmeen via Danylo
 * photo-7 and photo-8 were later replaced by Danylo with better originals;
 * photo-9 is deliberately unused, so the numbering matches what he sent.
 * Do NOT reorder these by the document's image order: the images are NOT
 * stored in team order, which is what produced an earlier wrong mapping.
 * Sources are public/team/photo-1.jpg … photo-7.jpg, square-cropped from
 * the originals.
 */

/** id -> public/team file. Each one verified; see the note above. */
const PHOTO_BY_ID: Record<string, string> = {
  "alex-mari": "/team/photo-1.jpg",
  "ertugrul-uysal": "/team/photo-2.jpg",
  "amani-alabed": "/team/photo-3.jpg",
  "fotis-efthymiou": "/team/photo-4.jpg",
  "maqbool-khan": "/team/photo-5.jpg",
  "jeff-brooks": "/team/photo-6.jpg",
  "danylo-provodov": "/team/photo-7.jpg",
  "illia-orel": "/team/photo-8.jpg",
  "yasmeen-masalmeh": "/team/photo-10.jpg",
};

/** The photo for a person, or undefined so the card falls back to initials. */
export function photoFor(id: string): string | undefined {
  return PHOTO_BY_ID[id];
}
export type TeamGroup =
  | "directors"
  | "scientists"
  | "engineers"
  | "assistants";

export interface TeamLink {
  label: string;
  href: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  group: TeamGroup;
  affiliation?: string;
  bio: string;
  focus?: string[];
  links: TeamLink[];
  /** Editorial marker: this profile's copy is not final. Nothing renders it —
      it pairs with the README's known-placeholders list. */
  placeholder?: boolean;
  /** Brand tag hue for the initials avatar. */
  hue: "indigo" | "iris" | "teal" | "amber" | "rose" | "sky" | "olive" | "slate";
}

export const TEAM: Person[] = [
  {
    id: "ertugrul-uysal",
    name: "Dr. Ertugrul Uysal",
    role: "Director",
    group: "directors",
    affiliation:
      "Assistant Professor of Digital Marketing, ZHAW School of Management and Law",
    bio: "Ertugrul Uysal is Assistant Professor of Digital Marketing at the ZHAW School of Management and Law in Winterthur, Switzerland, and former Senior Researcher at the Chair of Technology Marketing (D-MTEC), ETH Zurich. He earned his PhD in Management from the University of Neuchâtel. His research examines how consumers interact with and relate to digital technologies, from voice assistants and generative AI to social media, with a particular focus on human-AI relationships and the psychology of anthropomorphism. His work has been published in the Journal of the Academy of Marketing Science, Journal of Retailing, and Personality and Social Psychology Bulletin.",
    focus: [
      "AI empathy",
      "Anthropomorphism in AI",
      "Voice assistants",
      "Generative AI",
      "Psychology of technology",
    ],
    links: [
      { label: "Website", href: "https://techmarketing.ethz.ch/team/post-doctoral-researchers/ertugrul-uysal.html" },
      { label: "Scholar", href: "https://scholar.google.com/citations?user=XvjSAZUAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/ertugruluysal/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Ertugrul-Uysal" },
    ],
    hue: "indigo",
  },
  {
    id: "alex-mari",
    name: "Dr. Alex Mari",
    role: "Director",
    group: "directors",
    affiliation:
      "Assistant Professor of Marketing, American University of Bahrain",
    bio: "Alex Mari is Assistant Professor of Marketing at the American University of Bahrain and Visiting Professor at the Catholic University of the Sacred Heart in Milan. He earned his PhD in Business Administration from the University of Zurich, where his dissertation on the emergence of AI empathy in voice assistants and its impact on consumer decision-making received the Stanley C. Hollander Award from the Academy of Marketing Science. His research explores how empathic AI reshapes consumer decision-making as commerce becomes agentic, and has been published in the Journal of Business Research and the Journal of Interactive Marketing.",
    focus: [
      "AI empathy",
      "Agentic commerce",
      "AI companions",
      "AI memory",
      "Voice commerce",
    ],
    links: [
      { label: "Website", href: "https://www.alexmari.phd/" },
      { label: "Scholar", href: "https://scholar.google.com/citations?hl=en&user=MKAavP4AAAAJ" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/alexmari/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Alex-Mari" },
    ],
    hue: "teal",
  },
  {
    id: "amani-alabed",
    name: "Dr. Amani Alabed",
    role: "Research Scientist",
    group: "scientists",
    affiliation:
      "Assistant Professor of Digital Marketing, University of Doha for Science and Technology",
    bio: "Amani Alabed is Assistant Professor of Digital Marketing at the University of Doha for Science and Technology, Qatar. She earned her PhD from Newcastle University, where her research pioneered the study of consumer-AI relationships through the lens of the self-concept. Her work explores how conversational AI shapes consumer behavior, with a focus on AI anthropomorphism, self-congruence, and the bonds consumers form with AI agents, and what these mean for well-being. Her research has been published in Technological Forecasting and Social Change and the European Journal of Marketing, and she is a frequent speaker on the ethical, human-centered use of AI.",
    focus: [
      "AI empathy",
      "Anthropomorphism in AI",
      "Conversational AI",
      "Consumer-AI relationships",
      "Digital well-being",
    ],
    links: [
      { label: "Website", href: "https://amanialabed.com/" },
      { label: "Scholar", href: "https://scholar.google.com/citations?user=qKDGtpYAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/amanialabed/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Amani-Alabed-2" },
    ],
    hue: "iris",
  },
  {
    id: "fotis-efthymiou",
    name: "Dr. Fotis Efthymiou",
    role: "Co-founder & Research Scientist",
    group: "scientists",
    affiliation: "Senior Behavioral Research Expert, Delta Labs",
    bio: "Fotis Efthymiou is Co-founder and Research Scientist at the AI Empathy Lab. He earned his PhD in Behavioral Science and Technology from the University of St. Gallen, where his research pioneered the study of emotional speech synthesis, including how subtle vocal cues in AI voices, such as trembling, shape empathic concern and prosocial behavior. His work has been published in IEEE Transactions on Affective Computing, the Journal of Business Research, and the Journal of Interactive Marketing. Alongside his academic work, he is Senior Behavioral Research Expert at Delta Labs, where he develops AI twins for applied behavioral research.",
    focus: [
      "AI empathy",
      "AI twins",
      "Emotional speech synthesis",
      "Voice marketing",
      "Psychology of technology",
    ],
    links: [
      { label: "Website", href: "https://www.delta-labs.ch/#teammembers" },
      { label: "Scholar", href: "https://scholar.google.com/citations?user=-v9t8YMAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/fotis-efthymiou-phd-2aa10b101/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Fotis-Efthymiou" },
    ],
    hue: "rose",
  },
  {
    id: "jeff-brooks",
    name: "Dr. Jeff Brooks",
    role: "Research Scientist",
    group: "scientists",
    affiliation: "Head of Human Data, Hume AI",
    bio: "Jeff Brooks is a cognitive and affective scientist and Head of Human Data at Hume AI, where he uses statistical modeling and machine learning to analyze the large-scale datasets behind the company's emotion AI models. He earned his PhD in Psychology from New York University, working with Jon Freeman in the Social Cognitive and Neural Sciences Lab, and researches how people perceive and understand one another, combining brain imaging, machine learning, motion-tracking, and behavioral methods. His work has been published in PNAS, Nature Human Behaviour, and Current Directions in Psychological Science.",
    focus: [
      "AI empathy",
      "Emotion",
      "Affective computing",
      "Computational neuroscience",
      "Social perception",
    ],
    links: [
      { label: "Website", href: "https://jeffreyallenbrooks.github.io/" },
      { label: "Scholar", href: "https://scholar.google.com/citations?user=89byC1UAAAAJ" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/jeff-brooks-27b5a816b/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Jeffrey-Brooks-6" },
    ],
    hue: "sky",
  },
  {
    id: "maqbool-khan",
    name: "Dr. Maqbool Khan",
    role: "Research Scientist",
    group: "scientists",
    affiliation:
      "Associate Professor, College of Engineering and Computing, American University of Bahrain",
    bio: "Maqbool Khan is Associate Professor in the College of Engineering and Computing at the American University of Bahrain. He earned his PhD in Computer Science from Nanjing University, China, and previously held academic and industry positions across Pakistan, Austria, China, and the UAE, including roles with Siemens, Atos, and the Software Competence Center Hagenberg. His research spans explainable AI, human-AI teaming, natural language processing, and intelligent systems, and has been published extensively in IEEE, Springer, Elsevier, and ACM outlets. A Google Certified Professional Cloud Architect, he builds the scalable AI infrastructure that powers data-intensive research.",
    focus: [
      "Explainable AI",
      "Human-AI teaming",
      "NLP",
      "Big data analytics",
      "Intelligent systems",
    ],
    links: [
      { label: "Website", href: "https://www.maqboolkhan.com/" },
      { label: "Scholar", href: "https://scholar.google.com/citations?hl=en&user=HYdAeGEAAAAJ" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/maqbool-khan/" },
      { label: "ResearchGate", href: "https://www.researchgate.net/profile/Maqbool-Khan-2" },
    ],
    hue: "amber",
  },
  {
    id: "danylo-provodov",
    name: "Danylo Provodov",
    role: "Software Engineer, Independent",
    group: "engineers",
    bio: "Danylo Provodov is a computer scientist and the Lab's technical backbone. He designs and builds the experimental infrastructure that makes our research possible, integrating empathic voice interfaces, product catalogs, and data pipelines into robust platforms for running large-scale behavioral experiments with real AI agents.",
    focus: [
      "Research infrastructure",
      "Voice interfaces",
      "Experimental platforms",
    ],
    links: [],
    hue: "olive",
  },
  {
    id: "illia-orel",
    name: "Illia Orel",
    role: "Software Engineer, Independent",
    group: "engineers",
    // PLACEHOLDER — bio and profile links still pending.
    bio: "Bio coming soon.",
    links: [],
    placeholder: true,
    hue: "slate",
  },
  {
    id: "yasmeen-masalmeh",
    name: "Yasmeen Masalmeh",
    role: "Research Assistant",
    group: "assistants",
    affiliation:
      "Industrial Engineering student, American University of Bahrain",
    bio: "Yasmeen Masalmeh is a Research Assistant at the AI Empathy Lab and an Industrial Engineering student at the American University of Bahrain. She enjoys working on problems that combine structured thinking with a strong focus on system optimization and improvement. Her work at the lab focuses on optimizing and reviewing AI systems, evaluating their performance and identifying areas for improvement, an area she is exploring further in a research paper. Alongside her engineering studies, Yasmeen has a strong interest in UI/UX, data science, and graphic design. She is especially interested in building strategically designed systems that always keep the user in mind.",
    // Unlike the others, her submission carried no "Research focus" line;
    // these are lifted from her own bio rather than supplied, so they are
    // hers to correct.
    focus: [
      "System optimization",
      "AI system evaluation",
      "UI/UX",
      "Data science",
    ],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/yasmeen-masalmeh/",
      },
    ],
    hue: "iris",
  },
];

export const TEAM_GROUPS: { key: TeamGroup; title: string }[] = [
  { key: "directors", title: "Directors" },
  { key: "scientists", title: "Research Scientists" },
  { key: "engineers", title: "Engineers" },
  { key: "assistants", title: "Research Assistants" },
];

export function personById(id: string): Person | undefined {
  return TEAM.find((person) => person.id === id);
}

export function groupTitle(key: TeamGroup): string {
  return TEAM_GROUPS.find((group) => group.key === key)?.title ?? "";
}

export function initialsOf(name: string): string {
  return name
    .replace(/^Dr\.\s+/, "")
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
