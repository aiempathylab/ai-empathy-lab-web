"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Reveals [data-reveal] elements as they enter the viewport by giving them
 * a data-shown attribute. The hidden initial state is gated on html.js
 * (stamped by the inline script in layout), so content is never invisible
 * without JS. Re-runs per route since new pages mount new elements.
 *
 * The mark is an attribute, not a class: React rewrites an element's whole
 * class list whenever it re-renders it, which would hide a section again
 * for good. Sections that appear after the first look, or that React
 * builds anew, are watched as they arrive, for the same reason.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (el: Element) => el.setAttribute("data-shown", "");
    const seen = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                show(entry.target);
                seen?.unobserve(entry.target);
              }
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
        );
    const watch = (el: Element) => {
      if (el.hasAttribute("data-shown")) return;
      if (seen) seen.observe(el);
      else show(el);
    };

    document.querySelectorAll("[data-reveal]").forEach(watch);
    const arrivals = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) watch(node);
          node.querySelectorAll("[data-reveal]").forEach(watch);
        });
      }
    });
    arrivals.observe(document.body, { childList: true, subtree: true });

    return () => {
      seen?.disconnect();
      arrivals.disconnect();
    };
  }, [pathname]);

  return null;
}
