import { CARY_STUDY } from "@/content/cary-study";
import styles from "./diagram.module.css";

/**
 * Where a call's data goes, drawn from the page's own facts: the app sends the
 * voice to Hume, Hume has Gemini write the replies, the app saves the call
 * text and the notes on the study server, the server sends the profile and
 * notes to OpenAI for the tidy-up, and surveys in Qualtrics are matched by
 * Prolific ID. The words are in content/cary-study.ts.
 */

type Place = { title: string; sub: string };

function Box({ x, y, w, h, node }: { x: number; y: number; w: number; h: number; node: Place }) {
  return (
    <g>
      <rect className={styles.node} x={x} y={y} width={w} height={h} rx={18} />
      <text className={styles.title} x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle">
        {node.title}
      </text>
      <text className={styles.sub} x={x + w / 2} y={y + h / 2 + 22} textAnchor="middle">
        {node.sub}
      </text>
    </g>
  );
}

function Arrow({
  d,
  words,
  x,
  y,
  anchor = "middle",
}: {
  d: string;
  words: string | readonly string[];
  x: number;
  y: number;
  anchor?: "start" | "middle" | "end";
}) {
  const lines = typeof words === "string" ? [words] : words;
  return (
    <g>
      <path className={styles.line} d={d} markerEnd="url(#cary-data-head)" />
      <text className={styles.label} x={x} y={y} textAnchor={anchor}>
        {lines.map((line, i) => (
          <tspan key={line} x={x} dy={i === 0 ? (lines.length > 1 ? -14 : 0) : 17}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function DataMap() {
  const map = CARY_STUDY.diagrams.dataMap;
  return (
    <figure className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 640 560" role="img" aria-label={map.label}>
        <defs>
          {/* A filled head. Its base sits on the end of the line, so the line
              stops where the head starts and the tip is 12 beyond. */}
          <marker
            id="cary-data-head"
            viewBox="0 0 12 12"
            refX="0"
            refY="6"
            markerWidth="12"
            markerHeight="12"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M0 0 L12 6 L0 12 Z" className={styles.head} />
          </marker>
        </defs>

        <Box x={4} y={215} w={134} h={110} node={map.participant} />
        <Box x={256} y={30} w={150} h={100} node={map.hume} />
        <Box x={500} y={30} w={132} h={100} node={map.google} />
        <Box x={256} y={220} w={150} h={100} node={map.server} />
        <Box x={500} y={220} w={132} h={100} node={map.openai} />
        <Box x={256} y={430} w={150} h={100} node={map.qualtrics} />

        {/* Each line ends 18 short of its box: the head adds 12, which leaves
            the tip 6 from the box. */}
        <Arrow d="M144 232 C192 232 192 80 238 80" words={map.voice} x={216} y={172} anchor="start" />
        <Arrow d="M412 80 L482 80" words={map.words} x={453} y={66} />
        <Arrow d="M144 270 L238 270" words={map.saved} x={197} y={258} />
        <Arrow d="M412 270 L482 270" words={map.tidy} x={453} y={256} />
        <Arrow d="M144 308 C192 308 192 480 238 480" words={map.surveys} x={218} y={392} anchor="start" />
        <Arrow d="M331 424 L331 338" words={map.match} x={344} y={380} anchor="start" />
      </svg>
    </figure>
  );
}
