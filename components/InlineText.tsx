import Link from "next/link";
import type { ReactNode } from "react";
import { INLINE_LINK } from "@/content/resources";

/**
 * Renders copy that carries [label](href) links. A leading slash is a route
 * on this site and gets client navigation; anything else is a source and
 * opens in a new tab, the way every outbound link on the site does.
 */
export function InlineText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const [whole, label, href] = match;
    const at = match.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      href.startsWith("/") ? (
        <Link key={at} href={href}>
          {label}
        </Link>
      ) : (
        <a key={at} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      ),
    );
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
