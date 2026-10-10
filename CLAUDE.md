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

## Explainers (/resources/)

Five long-form explainers live in `content/resources.ts` and render through
`app/resources/[slug]/page.tsx`. Each opens with a short answer (the hero
lede, also the snippet search and answer engines lift), then sections,
common questions, and a sources list in the publication-row grammar.

- Every factual claim links to its source in the sentence that makes it,
  as a phrase link written `[label](href)`. No parenthetical citations, no
  "et al.", no numbered references: Danylo bans academic formatting.
- Working papers and preprints are named as such wherever they are cited.
  The GPT-4 persuasion study (Salvi et al.) has a 2026 correction: its
  personalization effect over plain GPT-4 is not significant. Never cite it
  as showing that personalization drives persuasion.
- `reviewed` is the date of the last full fact check. Change it only after
  re-checking every number on that page against its source.
- Statements about how the lab works (design of its experiments, what the
  platform records) should be confirmed by a director before they change.

## News and publications (Pages CMS)

Lab members edit these two lists at app.pagescms.org, without code. Every
save is a commit to `main`, and Vercel publishes it about a minute later.
The editor's forms are defined in `.pages.yml`.

- News: one JSON file per item in `data/news/`, read by `getNews()` in
  `content/news.ts`. The site sorts by date, so file order never matters.
  /news/ shows all of them, the home page's "Latest from the team" the
  newest three.
- Publications: one ordered list in `data/publications.json`, read by
  `content/publications.ts`. The list order is the lab's curation and the
  editor reorders it by drag. Working papers show as the cards under
  "Latest on AI empathy" (the first four on the home page too), published
  work under "Selected publications". Programme pages list the papers
  tagged with their slug, working papers first.
- Only these two lists are in the editor, deliberately. Team, programmes,
  explainers, partners and page copy change rarely and carry verification
  rules, so they stay in code.
- Both loaders validate every entry and throw with the file and the reason.
  A bad edit fails that Vercel build only, and the live site keeps the last
  good version.
- Keep in step: the JSON keys are the field names in `.pages.yml`; the
  programme values there must be the slugs in `content/research.ts` (the
  build refuses an unknown one); a news type added there shows grey until
  `components/NewsList.tsx` gives it a colour family.
- `.pages.yml` changes can be checked with Pages CMS's own validator,
  `parseAndValidateConfig` in `lib/config.ts` of github.com/pages-cms/pages-cms.
  The editor's settings page, which shows the same errors, is hidden by
  `settings.hide`.
- The repo is public. Anything saved in the editor is readable on GitHub at
  once, so nothing embargoed goes in before its date.
- Links go in clean: no `utm_*` or LinkedIn `rcm` tracking parameters, and
  `lnkd.in` short links resolved to the post they open.

## Images in squares

The site's pictures are real photographs drawn in small indigo squares, the
way a machine sees, in the ordered (Bayer) pattern at three levels: no
square, a light one, a dark one.

- Every photograph is CC0 (free for any use, commercial included, no
  attribution). Only CC0, never "free to use" licences with conditions. The
  site's came from rawpixel's and StockSnap's CC0 sets, found through the
  Openverse API. `content/art.ts` keeps each one's source page.
- Making one: cut the subject out of its background (the site's were lifted
  with macOS Vision, `../ai-empathy-lab-motion/tools/lift`), then
  `python3 scripts/art/prepare.py <cutout.png> <name>` writes the tone map
  and the still to `public/art/` (needs Pillow and NumPy). Register it in
  `content/art.ts` with the ratio the script prints. Programme pages take
  theirs from `PROGRAMME_ART`.
- `components/DitherArt.tsx` draws a piece live with WebGL2: the squares
  resolve once in view, then a patch of finer squares drifts across it and
  follows the pointer. The patch keeps the same colours as the rest, by
  decision. `components/DitherField.tsx` draws the abstract loops (the
  Index's bars, the Symposium's ripples, the voice waveform under How we
  work). Both share `lib/dither.ts` and read their colours from the tokens.
- Everything moving runs only while on screen with the tab visible, draws a
  still frame under reduced motion, and drops to 30 fps at 1x pixels on weak
  hardware (`lib/lowPower.ts`, which also stops the partner carousel's
  autoscroll). Check changes with Chrome's CPU throttling and SwiftShader,
  not only on a fast machine.
- Never call `loseContext()` in an effect's cleanup. A canvas owns one
  context for life, and React runs effects twice in development, so the
  second run would draw on a dead context.
- The footer stays still, by decision.

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
- Favicons and app icons in `public/` are rendered by the brand kit's
  `scripts/gen_icons.py` and copied over, never edited by hand. Google shows
  one favicon per hostname and accepts every `rel="icon"` and
  `apple-touch-icon` on the home page, so each must be valid: square (a
  101x46 SVG and a blank apple-touch-icon were why search results showed no
  icon until October 2026), with the PNG a multiple of 48px.
