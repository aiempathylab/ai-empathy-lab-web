import {
  Check,
  Equal,
  History,
  type LucideIcon,
  MessageCircleQuestion,
  PhoneCall,
  Save,
  Server,
  Smile,
  UserRound,
} from "lucide-react";
import { CARY_STUDY } from "@/content/cary-study";
import styles from "./Compare.module.css";

/** One icon per row, by the row's term. A row without one gets the plain
 *  "equal" mark. */
const ICONS: Record<string, LucideIcon> = {
  "What Cary is given before a call": UserRound,
  "The previous call": History,
  "Prompts to learn more": MessageCircleQuestion,
  "How Cary greets them": Smile,
  "The first call": PhoneCall,
  "What the server will return": Server,
  "Saving facts": Save,
  "Everything else": Equal,
};

/**
 * The two conditions side by side. The rows are the page's own, regrouped by
 * when they matter (before a call, in the call), with the rows that do not
 * differ set apart as identical. Nothing is cut or reworded.
 */
export function Compare() {
  const { conditions } = CARY_STUDY;
  const byTerm = new Map<string, (typeof conditions.rows)[number]>(
    conditions.rows.map((row) => [row.term, row]),
  );
  const grouped = conditions.groups.flatMap((group) => group.terms);
  if (
    byTerm.size !== conditions.rows.length ||
    new Set(grouped).size !== grouped.length ||
    grouped.length !== byTerm.size ||
    grouped.some((term) => !byTerm.has(term))
  ) {
    throw new Error("cary-study: conditions.groups must list every row of conditions.rows exactly once");
  }
  const [withMemory, noMemory] = conditions.columns;

  return (
    <table className={styles.table}>
      <caption className="visually-hidden">{conditions.caption}</caption>
      <thead>
        <tr>
          <td />
          <th scope="col">
            <span className={`${styles.chip} ${styles.chipOn}`}>{withMemory}</span>
          </th>
          <th scope="col">
            <span className={styles.chip}>{noMemory}</span>
          </th>
        </tr>
      </thead>
      {conditions.groups.map((group) => (
        <tbody key={group.title} className={group.same ? styles.same : undefined}>
          <tr>
            <th scope="rowgroup" colSpan={3} className={styles.groupTitle}>
              <span>
                {group.same ? <Check size={16} aria-hidden="true" /> : null}
                {group.title}
              </span>
            </th>
          </tr>
          {group.terms.map((term) => {
            const row = byTerm.get(term)!;
            const Icon = ICONS[term] ?? Equal;
            return (
              <tr key={term}>
                <th scope="row">
                  <div className={styles.term}>
                    <span className={styles.icon}>
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>{term}</span>
                  </div>
                </th>
                <td>
                  <p className={`${styles.cell} ${styles.cellA}`} data-label={withMemory}>
                    {row.cells[0]}
                  </p>
                </td>
                <td>
                  <p className={`${styles.cell} ${styles.cellB}`} data-label={noMemory}>
                    {row.cells[1]}
                  </p>
                </td>
              </tr>
            );
          })}
        </tbody>
      ))}
    </table>
  );
}
