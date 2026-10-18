import { CARY_STUDY } from "@/content/cary-study";
import styles from "./diagram.module.css";

/**
 * The path of one fact, with the places the page says it can stall: Cary saves
 * only what it chooses to, the notes wait on the phone if a call ends badly,
 * the form never cleans an old value, the tidy-up waits for five new notes.
 * All of it inside one participant's memory. Boxes and arrows. The words are
 * in content/cary-study.ts.
 */

const W = 160;
const H = 84;
const ROW1 = 62;
const ROW2 = 206;
const X = [20, 260, 500];

type Box = { title: string; sub: readonly [string, string] };

function Line({ d }: { d: string }) {
  return <path className={styles.line} d={d} markerEnd="url(#cary-path-head)" />;
}

function Words({ x, y, lines }: { x: number; y: number; lines: readonly string[] }) {
  return (
    <text className={styles.labelS} x={x} y={y} textAnchor="middle">
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 14}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function MemoryPath() {
  const path = CARY_STUDY.diagrams.memoryPath;
  const boxes: (Box & { x: number; y: number })[] = [
    { ...path.call, x: X[0], y: ROW1 },
    { ...path.phone, x: X[1], y: ROW1 },
    { ...path.server, x: X[2], y: ROW1 },
    { ...path.tidy, x: X[2], y: ROW2 },
    { ...path.cary, x: X[1], y: ROW2 },
  ];
  return (
    <figure className={styles.wrap}>
      <svg className={styles.svg} viewBox="0 0 680 330" role="img" aria-label={path.label}>
        <defs>
          <marker
            id="cary-path-head"
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
        <rect x={6} y={6} width={668} height={318} rx={28} className={styles.frame} />
        <text className={styles.label} x={28} y={38}>
          {path.frame}
        </text>

        {boxes.map((box) => (
          <g key={box.title}>
            <rect className={styles.node} x={box.x} y={box.y} width={W} height={H} rx={16} />
            <text className={styles.titleS} x={box.x + W / 2} y={box.y + 34} textAnchor="middle">
              {box.title}
            </text>
            <text className={styles.subS} x={box.x + W / 2} y={box.y + 56} textAnchor="middle">
              {box.sub[0]}
            </text>
            <text className={styles.subS} x={box.x + W / 2} y={box.y + 72} textAnchor="middle">
              {box.sub[1]}
            </text>
          </g>
        ))}

        {/* Each line stops 18 short of its box: the head adds 12, which leaves
            the tip 6 away. */}
        <Line d={`M${X[0] + W + 6} ${ROW1 + H / 2} L${X[1] - 18} ${ROW1 + H / 2}`} />
        <Line d={`M${X[1] + W + 6} ${ROW1 + H / 2} L${X[2] - 18} ${ROW1 + H / 2}`} />
        <Words x={(X[1] + W + X[2]) / 2} y={ROW1 + H / 2 - 30} lines={path.toServer} />
        <Line d={`M${X[2] + W / 2} ${ROW1 + H + 6} L${X[2] + W / 2} ${ROW2 - 18}`} />
        <Line d={`M${X[2] - 6} ${ROW2 + H / 2} L${X[1] + W + 18} ${ROW2 + H / 2}`} />
        <Words x={(X[1] + W + X[2]) / 2} y={ROW2 + H / 2 - 30} lines={path.toCary} />
      </svg>
    </figure>
  );
}
