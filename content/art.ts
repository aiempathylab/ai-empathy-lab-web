/**
 * The site's images, drawn in squares the way a machine sees. Each piece is
 * a real photograph or film, cut out of its background on device and
 * dithered into two shades of square, so mid-tones read as mid-tones:
 * photographs by scripts/art/prepare.py, films by prepare_video.py. The
 * source pages are kept here so the provenance never has to be
 * reconstructed.
 *
 * Licences: the photographs are CC0 (no rights reserved). The hero's film
 * is under the Pexels License: free for any use, commercial included, no
 * attribution required, as long as the people in it are not shown in a
 * bad light or presented as endorsing the lab, and it is never used as a
 * logo or a trademark.
 *
 *   tone   the ink map the browser dithers live (DitherArt)
 *   still  the same image already in squares, for no JavaScript or WebGL
 *   ratio  width / height of both
 */
export interface ArtPiece {
  tone: string;
  still: string;
  ratio: number;
  alt: string;
  source: string;
  /** A video (scripts/art/prepare_video.py) that plays in place of the
   *  tone map, and the second it starts at, the frame the still shows. */
  video?: string;
  videoStart?: number;
  /** One shade of square, the dark indigo, instead of two: its density
   *  alone follows the image (prepare_video.py --one-tone for the still). */
  oneTone?: boolean;
}

export const ART = {
  heroRobot: {
    tone: "/art/hero-robot-tone.png",
    still: "/art/hero-robot.png",
    video: "/art/hero-robot.mp4",
    videoStart: 5.6,
    oneTone: true,
    ratio: 0.7087,
    alt: "A robot arm offering a woman a flower, drawn in small squares",
    source: "https://www.pexels.com/video/robot-giving-a-flower-to-a-beautiful-woman-8328099/",
  },
  microphone: {
    tone: "/art/microphone-tone.png",
    still: "/art/microphone.png",
    ratio: 0.5039,
    alt: "A classic studio microphone, drawn in small squares",
    source: "https://www.rawpixel.com/image/3337409",
  },
  agenticCommerce: {
    tone: "/art/agentic-commerce-tone.png",
    still: "/art/agentic-commerce.png",
    ratio: 1.465,
    alt: "Two hands paying on a smartphone, drawn in small squares",
    source: "https://www.rawpixel.com/image/5960990",
  },
  sustainableConsumption: {
    tone: "/art/sustainable-consumption-tone.png",
    still: "/art/sustainable-consumption.png",
    ratio: 0.9,
    alt: "An older hand holding an apple, drawn in small squares",
    source: "https://www.rawpixel.com/image/5969543",
  },
  companionship: {
    tone: "/art/companionship-tone.png",
    still: "/art/companionship.png",
    ratio: 0.9917,
    alt: "An older hand wearing a health tracker, held by a younger hand, drawn in small squares",
    source: "https://www.rawpixel.com/image/5964427",
  },
  customerService: {
    tone: "/art/customer-service-tone.png",
    still: "/art/customer-service.png",
    ratio: 1.1233,
    alt: "A desk service bell, drawn in small squares",
    source: "https://www.rawpixel.com/image/5962346",
  },
  emotionMeasurement: {
    tone: "/art/emotion-measurement-tone.png",
    still: "/art/emotion-measurement.png",
    ratio: 1.065,
    alt: "A pair of over-ear headphones, drawn in small squares",
    source: "https://stocksnap.io/photo/wireless-headphones-EXCBJA3FFQ",
  },
} satisfies Record<string, ArtPiece>;

/** Each research programme's image, by programme slug. */
export const PROGRAMME_ART: Record<string, ArtPiece> = {
  "ai-empathy-agentic-commerce": ART.agenticCommerce,
  "ai-empathy-sustainable-consumption": ART.sustainableConsumption,
  "ai-companions-healthy-aging": ART.companionship,
  "ai-empathy-customer-service": ART.customerService,
  "ai-emotion-measurement": ART.emotionMeasurement,
};
