import { CARY_STUDY } from "@/content/cary-study";
import styles from "./PromptSlots.module.css";

/**
 * What the prompt is made of and what changed between the groups. The things
 * it covers are the same for both, and two slots differ: the memory section
 * and the opening line. No prompt text is shown, only the page's own words
 * about it, which are in content/cary-study.ts.
 */
export function PromptSlots() {
  const { prompt, conditions, diagrams } = CARY_STUDY;
  const [withMemory, noMemory] = conditions.columns;
  const slots = diagrams.promptSlots;
  return (
    <figure className={styles.wrap}>
      <div className={styles.card}>
        <p className={styles.label}>{slots.same}</p>
        <ul className={styles.chips}>
          {prompt.covers.map((cover) => (
            <li key={cover.term}>{cover.term}</li>
          ))}
        </ul>
        <p className={`${styles.label} ${styles.labelOn}`}>{slots.differed}</p>
        <div className={styles.slots}>
          {slots.slots.map((slot) => (
            <div key={slot.title} className={styles.slot}>
              <p className={styles.slotTitle}>{slot.title}</p>
              <p className={styles.row}>
                <span className={styles.tagOn}>{withMemory}</span>
                {slot.withMemory}
              </p>
              <p className={styles.row}>
                <span className={styles.tag}>{noMemory}</span>
                {slot.noMemory}
              </p>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
