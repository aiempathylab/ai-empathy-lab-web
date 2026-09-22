# CLAUDE.md

Public website for the AI Empathy Lab (aiempathylab.com). Static Next.js
export; no server, no env vars. The research platform is a SEPARATE repo
(EVI_Research) — do not mix concerns.

- `pnpm dev` (port 3100), `pnpm typecheck`, `pnpm build` (static → out/)
- All copy lives in `content/*.ts`; pages must stay copy-free.
- `styles/tokens.css` is the brand kit's light layer, vendored from
  `../ai-empathy-lab-brand` — never hand-edit; re-vendor from the kit.
  Style with `--ael-*` semantic tokens only; never introduce raw colours.
  The site is light-only by decision — never add a dark theme.
- The mark is the solid arch trio (components/Mark.tsx) — never translucent,
  never redrawn; geometry comes from the brand kit.
- SEO titles/descriptions/H1s are fixed by the lab's SEO plan — treat as data.
- Placeholders that must be resolved before launch are listed in README.md.

## Layout

ONE column system, declared once in `styles/globals.css`: the page rails,
`11.5rem | 1.2fr | 0.9fr | 20px`. `.hero-split` is row zero, `.rail-split` is
any body section, and every list row in `cards.module.css` sits on the same
tracks. At 1440 that puts the left rail at x=88, the support rail at x=892 and
the right edge at 1352 on every page. Do not introduce a second system.

- The action track is a FIXED 20px, never `auto`. A row whose item has no arrow
  collapses an auto track and hands its width to the fr columns, sliding that
  one row's support rail out of line.
- Both primitives state `justify-items: stretch`. `.page-hero` sets
  `justify-items: start`, so a rail grid placed directly on it shrink-wraps its
  columns instead of filling them, which reads as correct until a page turns up
  whose content is too short to hide it.
- Body measure is `--ael-measure: 74ch` on `.prose p`, about 95 characters.
  `ch` is the digit advance (10.1px in Inter) against a 7.8px average glyph,
  so the number reads lower than the character count it buys. It is set high on
  purpose: the reading column is 754px wide, and a shorter measure stopped the
  text 200px before the support rail, which left the two columns looking
  unrelated. Lower it to 68ch (~88 chars) or 58ch (~75) if legibility should
  win over the pairing.

## Gotchas

- The reset has `ul[class], ol[class] { margin: 0; padding: 0 }`. That is
  specificity (0,1,1) and beats any CSS-module class, so margins set on a
  classed list are silently dropped. Put the spacing on a parent's grid gap.
- A CSS module targeting a GLOBAL class must wrap it: `.myThing :global(.btn)`.
  Written plainly as `.myThing .btn` the compiler hashes BOTH names, so the
  rule compiles, ships, and silently never matches. It had killed the button
  sizing in three CTA panels before anyone noticed. Same applies to `.chip`,
  `.prose`, `.container` and anything else defined in globals.css.
- Brand marks are hand-rolled SVGs (`LinkedInIcon`, `ProfileLinkIcon`) with
  paths from simple-icons (CC0) — lucide-react dropped brand icons in v1.
- Team photos: the mapping in `content/team.ts` was verified against each
  person's own published photo. Read that file's header before touching it.
