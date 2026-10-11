/**
 * The contact page's copy and the topics its form offers. The form is
 * components/ContactForm.tsx, and where its messages go is
 * SITE.formEndpoint in content/site.ts.
 *
 * A link can open the page with a topic chosen, by its value:
 * /contact/?topic=platform. The topics follow the kinds of work the About
 * page invites (SITE.collaborate), plus access to the platform.
 */
export interface ContactTopic {
  value: string;
  label: string;
}

export const CONTACT = {
  metaTitle: "Contact the AI Empathy Lab",
  metaDescription:
    "Contact the AI Empathy Lab about joint experiments, data partnerships, speaking engagements, policy consultations, and access to our research platform.",
  title: "Contact the AI Empathy Lab",
  lede: "Write to us about joint experiments, data partnerships, speaking engagements, policy consultations, or access to our research platform. Tell us what you have in mind, and we will reply by email.",
  topics: [
    { value: "collaboration", label: "Joint research" },
    { value: "partnership", label: "Data or industry partnership" },
    { value: "speaking", label: "Speaking or media" },
    { value: "policy", label: "Policy consultation" },
    { value: "platform", label: "Research platform access" },
    { value: "other", label: "Something else" },
  ] satisfies ContactTopic[],
  labels: {
    name: "Your name",
    email: "Email",
    company: "Organization",
    topic: "What is it about?",
    message: "Message",
    optional: "optional",
    send: "Send message",
    sending: "Sending",
  },
  privacy: "We use your details only to answer your message.",
  delivery: "Messages reach us through Formspree.",
  errors: {
    name: "Please tell us your name.",
    email: "Please enter a valid email address.",
    message: "Please write a few words about what you have in mind.",
    failed: "Your message did not go through. Please try again, or write to us at",
    busy: "Too many messages at once. Please wait a minute and try again.",
  },
  sent: {
    title: "Thank you, your message is on its way",
    body: "We will reply to",
    again: "Send another message",
  },
  /** Shown when no form service is set up and the email app opens instead. */
  mailto: "Your email app should open with the message ready to send. If it does not, write to us at",
  aside: {
    emailHead: "Prefer email?",
    followHead: "Follow the lab",
  },
};
