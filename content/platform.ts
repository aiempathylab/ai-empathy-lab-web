import {
  AudioLines,
  CalendarRange,
  ClipboardList,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";

/**
 * The research platform, in one place.
 *
 * It has a section on /resources/ and a page of its own, so the copy lives
 * here rather than inside either of them: two pages describing the same
 * system from two lists is how they drift apart.
 *
 * Everything here is true of what is deployed. No numbers, no claims about
 * studies that have not run. A service the platform only offers to some
 * organizations is never named here (the catalog hides it from everyone
 * else, and this repository is public).
 */

export const PLATFORM_POINTS = [
  "Six AI providers behind one identical participant interface, so the service is never a confound.",
  "Voice prosody scores persisted with every message, as research data rather than telemetry.",
  "Emotion-triggered experimental manipulation, with every trigger firing logged as data.",
  "Recruitment-aware participant IDs, concurrency caps with a fair waiting queue, and consent gates.",
  "Daily drift monitoring that reports provider changes instead of silently substituting models mid-study.",
];

/** The kinds of study the platform runs. */
export const PLATFORM_FORMATS: {
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    icon: AudioLines,
    title: "Voice conversations",
    body: "Participants talk out loud with a live, empathic voice agent, in the same interface whichever AI service runs it.",
  },
  {
    icon: ClipboardList,
    title: "AI interviewer",
    body: "A voice interviewer works through your questions, and a participant whose call drops can rejoin where they left off.",
  },
  {
    icon: MessageSquareText,
    title: "Text chat",
    body: "Participants type instead of talking, and every message is kept for analysis.",
  },
  {
    icon: CalendarRange,
    title: "Multi-session studies",
    body: "Participants come back for a series of sessions, and the agent can remember what was said before.",
  },
];

/**
 * How one call works, which is the sequence the film shows. Four steps,
 * because the thing worth understanding is a loop: measure, compare,
 * change, record.
 */
export const PLATFORM_LOOP: { step: string; body: string }[] = [
  {
    step: "The call runs on our own pipeline",
    body: "The participant speaks to a working voice agent. The platform runs the listening, the replying and the speaking as one pipeline of its own, so which service does each part is a choice you make rather than something you inherit.",
  },
  {
    step: "Every turn is scored",
    body: "The emotion in the participant's voice is measured as they speak, turn by turn, and the agent's reply waits for that score rather than arriving beside it.",
  },
  {
    step: "A threshold can change the reply",
    body: "You set what to watch and how far it has to move. When a turn crosses it, the agent either says a line you wrote or answers with empathy for the next two replies, and the change reaches the voice before it is spoken.",
  },
  {
    step: "The manipulation is data",
    body: "Each firing is written to the conversation with the rule that caused it, so what the agent did and why is part of the record rather than something to reconstruct afterwards.",
  },
];
