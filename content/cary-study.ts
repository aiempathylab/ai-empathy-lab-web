/**
 * The page behind "How the Cary study was built": the companion exactly as
 * participants used it, written for readers who are not engineers.
 *
 * Everything here is true of what was deployed, and each fact was checked
 * against the app's code or Hume's own configuration records, not against
 * documentation alone. House rules apply as everywhere on the site: no em or
 * en dashes, no semicolons, no middle dots, no academic citation style.
 *
 * Statements about how the lab works should be confirmed by a director before
 * they change. In particular, check with the directors before editing:
 *  - the dates the configurations went live (24 April 2026 for regular calls,
 *    9 May 2026 for the no-memory first-call script) and that no study
 *    participant was fielded before them,
 *  - the data-handling rows (hosting region, no stored audio), and
 *  - the sentence on what Hume passes to the language model, which restates
 *    Hume's documentation rather than something we measured.
 *
 * The prompt itself is never published. This repository is public, so no
 * prompt text lives here or anywhere in it: the page says what the prompt
 * covers, in words.
 *
 * The invented participant "Maria" appears only as a worked example and says
 * so on the page. No real participant data is used anywhere in this file.
 */

export interface FactRow {
  term: string;
  /** Carries [label](href) links, rendered by InlineText. */
  body: string;
}

export const CARY_STUDY = {
  /** The research programme this page belongs to (its parent route). */
  programme: "ai-companions-healthy-aging",
  seoTitle: "AI Companion Memory: How Cary Was Built | AI Empathy Lab",
  seoDescription:
    "How Cary, an AI voice companion, was built for a memory study with adults 50+: its memory, the AI models behind it, where data is kept, and its prompt.",
  h1: "How the Cary study was built",
  /** Dates for the article markup. Set both to the go-live date, and move `updated` when the page is revised. */
  published: "2026-10-18",
  updated: "2026-10-18",
  lede: "In our study of AI companion memory, adults aged 50 and over talked with Cary, an AI voice companion, over a series of sessions. Half of them met a Cary that remembered them. The other half met a Cary that began every call from a blank slate. This page describes Cary exactly as participants used it: how its memory works, which AI models ran it, where the data is kept, and the instructions it was given.",

  memory: {
    id: "memory",
    heading: "How Cary's memory works",
    /**
     * The plain-language account of the memory design. It is one paragraph in
     * the manuscript (these three joined with spaces) and three on the screen,
     * so the page and the paper carry the same words.
     */
    paragraphs: [
      "Cary's memory works much as a friend's does. While a participant talks, Cary listens for facts they state about themselves, such as a daughter's name, a pet, a hobby or a former job, and quietly writes them down. It records only what the person actually said, never its own impressions of them, and it never mentions that it is doing so. When the call ends, the notes are sent to a private study server and filed in a personal profile that belongs to that participant alone. Once enough new notes have built up, a second AI model tidies the profile: it merges repeats, replaces details that have changed, removes anything the participant said is no longer true, and sorts the rest into a handful of groups such as family, health and interests.",
      "At the start of the next call, before the participant says a word, Cary is handed this profile together with the closing stretch of the previous conversation. It is instructed to bring in one relevant detail at a time, the way a friend might, and never to sound as if it is consulting a record.",
      "Participants in the no-memory condition used the same app and the same voice, and Cary followed the same instructions, apart from two sentences in its first-call introduction that promise to remember. Cary still wrote down what they told it, so both groups left comparable records, but it was never handed the profile or the earlier conversation, and every call began from a blank slate.",
    ],
    /** The profile in three numbers, set beside the paragraph. */
    glanceLabel: "The memory in three numbers",
    glance: [
      { figure: "70", label: "fixed fields in each profile form, from name and age to family, health and hobbies" },
      { figure: "10", label: "groups the tidied notebook is sorted into" },
      { figure: "5", label: "new notebook entries before the tidy-up runs" },
    ],
    stepsHeading: "One fact, from one call to the next",
    steps: [
      {
        step: "Cary listens",
        body: "Maria mentions that her dog Bobby has just turned ten. Cary recognises a fact worth keeping and saves it with a built-in note-taking tool, without saying so.",
      },
      {
        step: "The note travels",
        body: "During the call the note waits on Maria's phone. When the call ends, the phone sends it to the study server. If the call drops, the note stays on the phone and is sent the next time the app opens.",
      },
      {
        step: "The fact is filed",
        body: "On the server, the fact goes into Maria's personal profile. A fact that fits a fixed field, such as her pet, is filed there. Anything that fits no field goes into a free notebook.",
      },
      {
        step: "The notebook is tidied",
        body: "Once five or more new notebook entries have built up, a second AI model rewrites the notebook into ten tidy groups, so Bobby ends up under family and relationships. It merges repeats, keeps the newest version of a fact, and removes what Maria has said is no longer true.",
      },
      {
        step: "Cary remembers",
        body: "At the start of the next call, before Maria says a word, Cary is given her profile. If she mentions a walk, Cary can ask how Bobby is doing. It is told to use one detail at a time and never to announce that it remembers.",
      },
    ],
  },

  conditions: {
    id: "conditions",
    heading: "With memory and without: the two conditions",
    caption: "How the with-memory and no-memory conditions differed",
    columns: ["With memory", "No memory"] as [string, string],
    rows: [
      {
        term: "What Cary is given before a call",
        cells: [
          "The participant's profile: the form, the tidied groups and any recent notes.",
          "Nothing. The memory part of the prompt reads “No user data available yet”.",
        ],
      },
      {
        term: "How Cary greets them",
        cells: [
          "By first name, once it has learned it.",
          "As “friend”, every time.",
        ],
      },
      {
        term: "The previous call",
        cells: [
          "The end of the previous conversation carries over, up to its last 80 events.",
          "Every call opens a new conversation with nothing carried over.",
        ],
      },
      {
        term: "Prompts to learn more",
        cells: [
          "On every third call, a light hint about which parts of the profile are still empty, with advice on asking about them naturally.",
          "None.",
        ],
      },
      {
        term: "Saving facts",
        cells: [
          "Cary saves what the participant tells it.",
          "Identical. Cary saves what the participant tells it, so both groups leave comparable records.",
        ],
      },
      {
        term: "What the server will return",
        cells: [
          "The profile.",
          "Nothing. The server withholds memory from these accounts even if the app asks for it.",
        ],
      },
      {
        term: "The first call",
        cells: [
          "A getting-to-know-you call in which Cary asks about the participant's life. It says it wants to make their time together personal, and it closes by promising to remember everything.",
          "The same call with those two promises removed, so Cary never suggests that it will remember.",
        ],
      },
      {
        term: "Everything else",
        cells: [
          "The same app, voice, AI models, features and regular-call instructions.",
          "The same.",
        ],
      },
    ] as { term: string; cells: [string, string] }[],
    /** The rows regrouped by when they matter, so the table reads in one pass.
     *  Every row's `term` is in exactly one group. */
    groups: [
      {
        title: "Before each call",
        terms: [
          "What Cary is given before a call",
          "What the server will return",
          "The previous call",
          "Prompts to learn more",
        ],
      },
      { title: "In the call", terms: ["How Cary greets them", "The first call"] },
      { title: "Identical in both groups", same: true, terms: ["Saving facts", "Everything else"] },
    ] as { title: string; same?: boolean; terms: string[] }[],
  },

  stack: {
    id: "stack",
    heading: "The AI models and settings behind Cary",
    rows: [
      {
        term: "The app",
        body: "[Cary Ally](https://caryally.com) for iPhone. Each participant received a study account from us and logged in with it.",
      },
      {
        term: "Voice platform",
        body: "Hume EVI 3, the third generation of Hume's Empathic Voice Interface, a voice service built on Hume's own speech-language model. It turns the participant's speech into text, measures how it sounds (its tune, rhythm and timbre), hands the words to the language model chosen for the study, and speaks the reply aloud in a synthetic voice. It uses the same measurements to judge when the participant has finished speaking, and it stops talking when they interrupt.",
      },
      {
        term: "Who writes the words",
        body: "Google Gemini 2.5 Flash, selected inside the Hume configuration at temperature 1.0. Every reply Cary spoke was written by this model. Hume's option for short, quick replies from its own speech model was off. So was Hume's automatic addition of extra instructions to the prompt, so Gemini received our instructions as written.",
      },
      {
        term: "What the model receives",
        body: "A transcript of each turn, not the sound. As Hume documents it, each turn also carries Hume's reading of the participant's vocal expression: the three expressions it detects most strongly out of 48, each with a word for its strength, such as “very happy” or “quite anxious”.",
      },
      {
        term: "The voice",
        body: "The Hume Voice Library voice “Male English Actor” by default. In the app's settings, participants could choose “Ellie” or “Carlo” instead.",
      },
      {
        term: "Memory tidy-up",
        body: "OpenAI GPT-4.1-mini at temperature 0.1, called through OpenAI's API by our study server. It never speaks to participants. It reads the saved notes and writes the tidied profile.",
      },
      {
        term: "Call limits",
        body: "A call ended after three minutes of silence or thirty minutes in total.",
      },
      {
        term: "What Cary could do",
        body: "Save facts, schedule reminders, look up pictures, read news headlines, run activities such as trivia and riddles, and search the web.",
      },
    ] as FactRow[],
  },

  data: {
    id: "data",
    heading: "Where the data is kept",
    rows: [
      {
        term: "Study server",
        body: "A private server and database hosted on Amazon Web Services. Each participant has one pseudonymous study account, linked to their Prolific ID.",
      },
      {
        term: "Memory",
        body: "Three stores for each participant: the 70-field form, the free notebook and the tidied groups. After every call and every tidy-up, a dated copy of the whole profile is saved and never overwritten. A separate log records each fact Cary saved and the call it came from.",
      },
      {
        term: "Conversations",
        body: "The text of every call, turn by turn, with the emotion readings Hume attaches to each turn, and the length of every call.",
      },
      {
        term: "Audio",
        body: "The app streams the participant's voice to Hume so that Cary can reply. The app does not save recordings of it.",
      },
      {
        term: "Surveys",
        body: "Questionnaires ran in Qualtrics and are matched to each participant's calls through their Prolific ID.",
      },
    ] as FactRow[],
  },

  prompt: {
    id: "prompt",
    heading: "The system prompt Cary was given",
    lede: "Every regular call ran on one system prompt of about 2,000 words. Both conditions received it word for word. What differed was the information slotted into its memory section and its opening line. The first call used its own getting-to-know-you script, described above.",
    /** What the prompt covers, in words. Each is a term and what the prompt says about it. */
    covers: [
      { term: "Who Cary is", body: "A warm companion for older adults, speaking like a trusted friend and never like an assistant." },
      { term: "How to speak", body: "Short, natural sentences with no lists or formatting, because everything is spoken aloud." },
      { term: "How to respond to feelings", body: "Match the participant's mood and never rush past sadness." },
      { term: "The rhythm of conversation", body: "Share, invite, listen, with roughly half of Cary's turns containing no question at all." },
      { term: "Safety", body: "Encourage contacting emergency services or a trusted person if someone may be in danger, give no medical diagnosis, and refuse to help with scams." },
      { term: "What to save", body: "Any fact the participant states about themselves, saved at once and silently, and never Cary's own observations." },
      { term: "How to use what it knows", body: "Bring in one detail at a time and never announce a memory." },
    ],
  },

  limits: {
    id: "limits",
    heading: "What the memory does not do",
    /** Each limit is a headline sentence and what follows from it. */
    items: [
      {
        term: "Cary saves facts by choosing to, during the call.",
        body: "If it does not save a fact, the fact is lost, and some facts are missed. If a call ends badly, notes wait on the phone and arrive the next time the app opens, so saving can be late but is not lost.",
      },
      {
        term: "The tidy-up waits for five new notes, so a participant with short calls may go a while before their notebook is tidied.",
        body: "Until then the raw notes are still passed to Cary.",
      },
      {
        term: "The profile form is filled in but never cleaned.",
        body: "An old value in a field stays until the participant says something new about the same field.",
      },
      {
        term: "Memory belongs to one person.",
        body: "Nothing one participant says reaches another participant's Cary.",
      },
    ] as FactRow[],
  },

  /**
   * The words in the three drawings. Their shapes and positions are in
   * components/cary; every label is here, beside the facts it restates, so a
   * fact is changed in one place. Each `label` is the drawing's text
   * alternative.
   */
  diagrams: {
    dataMap: {
      label:
        "Where a call's data goes: the voice goes to Hume, and Hume has Google's Gemini write the replies. The call text and saved notes go to the study server, which sends the notes to OpenAI for the tidy-up. Surveys in Qualtrics are matched to the study server by Prolific ID.",
      participant: { title: "Participant", sub: "the app" },
      hume: { title: "Hume", sub: "voice service" },
      google: { title: "Google", sub: "Gemini" },
      server: { title: "Study server", sub: "on AWS" },
      openai: { title: "OpenAI", sub: "memory tidy-up" },
      qualtrics: { title: "Qualtrics", sub: "surveys" },
      voice: "voice",
      words: "words",
      saved: "text, notes",
      tidy: ["profile", "and notes"],
      surveys: "surveys",
      match: "matched by Prolific ID",
    },
    memoryPath: {
      label:
        "The path of one fact. It starts in the call, where Cary saves only what it chooses to. The notes wait on the phone if a call ends badly. On the study server an old value in the profile form stays. The tidy-up runs after five new notes. Then Cary has it at the next call. All of it belongs to one participant.",
      frame: "Memory belongs to one person",
      call: { title: "The call", sub: ["Cary saves what", "it chooses to"] },
      phone: { title: "The phone", sub: ["notes wait here if", "a call ends badly"] },
      server: { title: "The study server", sub: ["the profile form:", "old values stay"] },
      tidy: { title: "The tidy-up", sub: ["runs after five", "new notes"] },
      cary: { title: "Cary", sub: ["gets the profile, and", "raw notes until then"] },
      toServer: ["when the", "call ends"],
      toCary: ["at the", "next call"],
    },
    promptSlots: {
      same: "The same for both groups",
      differed: "What differed",
      slots: [
        { title: "Memory section", withMemory: "the participant's profile", noMemory: "nothing" },
        { title: "Opening line", withMemory: "first name", noMemory: "\u201Cfriend\u201D" },
      ],
    },
  },
} as const;
