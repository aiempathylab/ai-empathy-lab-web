"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT } from "@/content/contact";
import { SITE } from "@/content/site";
import styles from "./ContactForm.module.css";

type FieldKey = "name" | "email" | "message";
type Errors = Partial<Record<FieldKey, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; email: string }
  | { kind: "mailto" }
  | { kind: "failed"; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER: FieldKey[] = ["name", "email", "message"];
const TIMEOUT_MS = 15000;

function check(data: FormData): Errors {
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const errors: Errors = {};
  if (!value("name")) errors.name = CONTACT.errors.name;
  if (!EMAIL.test(value("email"))) errors.email = CONTACT.errors.email;
  if (value("message").length < 10) errors.message = CONTACT.errors.message;
  return errors;
}

/**
 * The contact form. It checks the three fields it needs before anything is
 * sent, says what is wrong next to the field itself, and keeps everything
 * the visitor typed when a send fails. Messages go to Formspree in the
 * background (SITE.formEndpoint), so the visitor never leaves the page.
 * Bots are caught by a hidden field that people never see or fill in.
 * Until a form service is set up, sending opens the visitor's email app
 * with the message already written.
 */
export function ContactForm() {
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const doneRef = useRef<HTMLHeadingElement>(null);

  /* A link can choose the topic, /contact/?topic=platform. Read once on
     arrival, so the page stays static. */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("topic");
    if (wanted && CONTACT.topics.some((t) => t.value === wanted)) setTopic(wanted);
  }, []);

  useEffect(() => {
    if (status.kind === "sent") doneRef.current?.focus();
  }, [status.kind]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = check(data);
    setErrors(found);
    const first = ORDER.find((key) => found[key]);
    if (first) {
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    const email = String(data.get("email")).trim();
    /* Someone filled in the field only a bot can see: thank them and drop it. */
    if (String(data.get("_gotcha") ?? "")) {
      setStatus({ kind: "sent", email });
      return;
    }

    const label = CONTACT.topics.find((t) => t.value === topic)?.label;
    data.delete("topicChoice");
    if (label) data.set("topic", label);
    data.set("subject", label ? `Website: ${label}` : "Website: a message");

    if (!SITE.formEndpoint) {
      const lines = [
        String(data.get("message")).trim(),
        "",
        String(data.get("name")).trim(),
        String(data.get("company") ?? "").trim(),
        email,
      ].filter((line, i) => i < 2 || line);
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus({ kind: "mailto" });
      return;
    }

    setStatus({ kind: "sending" });
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(SITE.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (response.ok) {
        form.reset();
        setTopic("");
        setStatus({ kind: "sent", email });
      } else if (response.status === 429) {
        setStatus({ kind: "failed", message: CONTACT.errors.busy });
      } else {
        setStatus({ kind: "failed", message: `${CONTACT.errors.failed} ${SITE.email}.` });
      }
    } catch {
      setStatus({ kind: "failed", message: `${CONTACT.errors.failed} ${SITE.email}.` });
    } finally {
      window.clearTimeout(timer);
    }
  }

  /* Typing in a field clears its message, and a failed send's notice. */
  function onInput(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as FieldKey;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
    if (status.kind === "failed" || status.kind === "mailto") setStatus({ kind: "idle" });
  }

  if (status.kind === "sent") {
    return (
      <div className={styles.done} role="status">
        <CircleCheck size={30} strokeWidth={1.75} className={styles.doneIcon} aria-hidden="true" />
        <h2 ref={doneRef} tabIndex={-1} className={styles.doneTitle}>
          {CONTACT.sent.title}
        </h2>
        <p className={styles.doneBody}>
          {CONTACT.sent.body} <strong>{status.email}</strong>.
        </p>
        <button type="button" className={styles.again} onClick={() => setStatus({ kind: "idle" })}>
          {CONTACT.sent.again}
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";
  const describe = (key: FieldKey) => (errors[key] ? `contact-${key}-error` : undefined);
  const fieldError = (key: FieldKey) =>
    errors[key] ? (
      <p id={`contact-${key}-error`} className={styles.error}>
        <CircleAlert size={15} aria-hidden="true" />
        {errors[key]}
      </p>
    ) : null;

  return (
    <form className={styles.form} noValidate onSubmit={onSubmit} onInput={onInput} aria-busy={sending}>
      <div className={styles.pair}>
        <div className={styles.field}>
          <label htmlFor="contact-name" className={styles.label}>
            {CONTACT.labels.name}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            className={styles.input}
          />
          {fieldError("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className={styles.label}>
            {CONTACT.labels.email}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            className={styles.input}
          />
          {fieldError("email")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-company" className={styles.label}>
          {CONTACT.labels.company} <span className={styles.optional}>({CONTACT.labels.optional})</span>
        </label>
        <input id="contact-company" name="company" type="text" autoComplete="organization" className={styles.input} />
      </div>

      <fieldset className={styles.topics}>
        <legend className={styles.label}>
          {CONTACT.labels.topic} <span className={styles.optional}>({CONTACT.labels.optional})</span>
        </legend>
        <div className={styles.chips}>
          {CONTACT.topics.map((t) => (
            <label key={t.value} className={styles.chip} data-on={topic === t.value}>
              <input
                type="radio"
                name="topicChoice"
                value={t.value}
                checked={topic === t.value}
                onChange={() => setTopic(t.value)}
                className={styles.chipInput}
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          {CONTACT.labels.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describe("message")}
          className={`${styles.input} ${styles.textarea}`}
        />
        {fieldError("message")}
      </div>

      {/* The trap: hidden from people and from assistive tech, irresistible
          to a form-filling bot. Formspree drops anything that fills it. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === "failed" ? (
        <p className={styles.notice} role="alert">
          <CircleAlert size={18} aria-hidden="true" />
          {status.message}
        </p>
      ) : null}
      {status.kind === "mailto" ? (
        <p className={`${styles.notice} ${styles.noticeInfo}`} role="status">
          <CircleAlert size={18} aria-hidden="true" />
          {CONTACT.mailto} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      ) : null}

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary btn-lg" disabled={sending}>
          {sending ? (
            <>
              <LoaderCircle size={18} className={styles.spin} aria-hidden="true" /> {CONTACT.labels.sending}
            </>
          ) : (
            <>
              {CONTACT.labels.send} <Send size={17} aria-hidden="true" />
            </>
          )}
        </button>
        <p className={styles.privacy}>
          {CONTACT.privacy}
          {SITE.formEndpoint ? ` ${CONTACT.delivery}` : null}
        </p>
      </div>
    </form>
  );
}
