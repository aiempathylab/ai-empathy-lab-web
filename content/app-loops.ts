/**
 * The short silent films that show the Cary Ally app in use, and the files each
 * is served as. Made in the motion studio (../ai-empathy-lab-motion, films
 * cary-tour, cary-memory and cary-compare), prepared by scripts/film/prepare_loop.sh.
 *
 * A film explains the text beside it, so it plays by itself, muted, on a loop,
 * only while it is on screen, and can be paused, restarted and scrubbed. Each
 * is made in two shapes: one that fills the space it sits in on a wide screen
 * (`desktop`) and a phone-shaped one for a narrow screen (`mobile`). The
 * conversations in them are illustrations: no real participant, no real words.
 * A director approves them before public use.
 */
export interface AppLoopSource {
  src: string;
  codec: "av1" | "hevc" | "h264";
  /** Container and codec string, as canPlayType reads them. */
  type: string;
}

/** One shape of one film. */
export interface AppLoopFile {
  /** The studio's name for the shape. */
  shape: "portrait" | "square" | "wide" | "tall";
  width: number;
  height: number;
  seconds: number;
  /** Poster files, `${poster}-${width}.jpg`. */
  poster: string;
  /** Best first: AV1, then HEVC, then H.264. */
  sources: AppLoopSource[];
}

export interface AppLoop {
  /** What the film shows, for its label and for search engines. */
  name: string;
  description: string;
  /** The words on screen and what happens, in order: what a reader who cannot
   *  watch gets, and what search and answer engines read. */
  transcript: string;
  published: string;
  /** For a screen wide enough for two columns. */
  desktop: AppLoopFile;
  /** For a narrow screen: a phone's own shape. */
  mobile: AppLoopFile;
}

function file(
  film: string,
  shape: AppLoopFile["shape"],
  width: number,
  height: number,
  seconds: number,
): AppLoopFile {
  const name = `${film}-${shape}`;
  const base = `/media/app/${name}-${width}`;
  /* 1080p needs the next codec level up. */
  const big = height >= 1080;
  return {
    shape,
    width,
    height,
    seconds,
    poster: `/media/app/${name}-poster`,
    sources: [
      { src: `${base}.av1.mp4`, codec: "av1", type: `video/mp4; codecs="${big ? "av01.0.09M.10" : "av01.0.08M.10"}"` },
      { src: `${base}.hevc.mp4`, codec: "hevc", type: `video/mp4; codecs="${big ? "hvc1.2.4.L123.B0" : "hvc1.2.4.L120.B0"}"` },
      { src: `${base}.h264.mp4`, codec: "h264", type: 'video/mp4; codecs="avc1.640032"' },
    ],
  };
}

export const APP_LOOPS = {
  tour: {
    name: "What Cary can do in the Cary Ally app",
    description:
      "The Cary Ally app on an iPhone: a choice of activities from trivia to riddles, calls that can be scheduled, the news when asked, and pictures on request.",
    transcript:
      "Activities, from trivia to riddles. The app's activities list opens from the main screen, with Daily News and Trivia Quiz marked Top, and Twenty Questions marked New. Plan your calls. The Schedule a Call sheet offers three choices: Schedule Call, to set up recurring calls, Reschedule Call, and My Schedule. Ask for the news. In a call the person asks what is in the news today and Cary searches, then answers. Or for a picture. The person asks for a picture of a seedling and Cary shows one in the chat. The conversation is an illustration.",
    published: "2026-10-18",
    desktop: file("cary-tour", "portrait", 720, 960, 21.4),
    mobile: file("cary-tour", "tall", 720, 1280, 21.4),
  },
  memory: {
    name: "How Cary remembers one fact from one call to the next",
    description:
      "An invented example in five steps: a person tells Cary their dog turned ten, the note travels from the phone to the study server, is filed in a personal profile, is tidied into ten groups by a second AI model, and Cary asks about the dog at the next call.",
    transcript:
      "Cary listens. In a call, Maria says her dog Bobby has just turned ten, and Cary quietly saves it. The note travels: from Maria's phone to the study server. The fact is filed: in her profile, under Pets, as Bobby, a dog, turned ten. The notebook is tidied: a second AI model sorts the free notebook into ten groups, and Bobby goes under family and relationships. Cary remembers: at the next call Cary says, Good morning, Maria. How is Bobby doing? Maria and Bobby are an invented example.",
    published: "2026-10-18",
    desktop: file("cary-memory", "square", 720, 720, 26),
    mobile: file("cary-memory", "tall", 720, 1280, 26),
  },
  compare: {
    name: "The same call with memory and without",
    description:
      "Two phones side by side running the same app with the same voice. With memory, Cary greets Maria by name and asks about her dog. Without memory, Cary greets a friend and starts from nothing.",
    transcript:
      "Same app. Same voice. One difference: what Cary remembers. With memory, Cary says, Good morning, Maria. How is Bobby doing? She answers, He loves his walks, and Cary replies, Still walking at ten. That is wonderful. With no memory, Cary says, Hello, friend. How are you today? The person answers, Fine, thank you, and Cary asks, What would you like to talk about? The conversations are illustrations.",
    published: "2026-10-18",
    desktop: file("cary-compare", "wide", 1920, 1080, 16.5),
    mobile: file("cary-compare", "tall", 720, 1280, 19.5),
  },
} satisfies Record<string, AppLoop>;
