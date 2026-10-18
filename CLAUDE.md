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

Two column systems, each declared once. Do not introduce a third.

- **The centre line**, for a page's opening and for the sections of the
  redesigned pages (October 2026): `components/Page.tsx` with
  `components/Page.module.css`. A page opens with `<Hero>`, the headline on the
  left half and the lede on the right (a programme's question goes above the
  lede as `subtitle`). Its sections are `<Section>`: SPLIT (the takeaway and
  any picture, diagram or numbers on the left half, the content on the right)
  or STACKED (a header row, then full-width content such as a table or a card
  grid). Two equal halves, a 4rem gap, the site's `.band` rhythm above and
  below each section. Sections are divided by whitespace, never a rule: a rule
  on this site means items in a list. The headline and lede type are `.page-hero`
  in `styles/globals.css`, so every opening sets them alike. Used by every page
  except the home page, the Symposium and a team profile, which keep their own
  openings. The left side of a section is static, never sticky. Reading text
  there is `<Prose>`, held to its half column (about 75 characters at 1440)
  rather than to `--ael-measure`.
- **The page rails**, `11.5rem | 1.2fr | 0.9fr | 20px`: every list row in
  `cards.module.css`, and the body sections that continue them (an explainer's
  article and its contents, a profile, the contact form), which are
  `.rail-split` in `styles/globals.css`. At 1440 that puts the left rail at
  x=88, the support rail at x=892 and the right edge at 1352.
- The action track is a FIXED 20px, never `auto`. A row whose item has no arrow
  collapses an auto track and hands its width to the fr columns, sliding that
  one row's support rail out of line.
- A research programme row shows its icon alone, never a text label beside it
  (Danylo, October 2026). The icon sits at the start of the left rail and the
  question spans from just after it to the end of the primary rail, so the
  summary still lands on the support rail. Icon, question, summary and arrow
  are centred on one line. Explainer rows keep their text tag.
- `.rail-split` states `justify-items: stretch`. `.page-hero` sets
  `justify-items: start`, so a rail grid placed directly on it shrink-wraps its
  columns instead of filling them, which reads as correct until a page turns up
  whose content is too short to hide it (the Symposium and a team profile do
  exactly that).
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
  re-checking every number on that page against its source. It is not shown
  on the page (no reading time or review date, Danylo, October 2026), but it
  still sets dateModified and the sitemap's lastmod.
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
- A news item may carry a picture (`image`), uploaded in the editor to
  `public/media/news/` and stored as `/media/news/<file>`. The build refuses
  a path outside that folder or a file that is not there. Without one the
  row shows its type's icon on its family's tint (`TYPE_ICON` and `FAMILY`
  in `components/NewsList.tsx`), so every row has an image of some kind.
- Publications: one ordered list in `data/publications.json`, read by
  `content/publications.ts`. The list order is the lab's curation and the
  editor reorders it by drag. Working papers show as the cards under
  "Latest on AI empathy" on /publications/ (the first four under "Latest
  research" on the home page), published work under "Selected
  publications". Programme pages list the papers
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

## Home page and contact

- The home page's order is the directors' (Alex's review, October 2026):
  hero, How we work, Latest from the team, Five questions, Latest research,
  What is coming, then Partners as the closing acknowledgment. "What is
  coming" holds the Research Platform card (it links to `/resources/#platform`)
  and the Symposium. The Index card was removed at the same review, and its
  page is unlinked until the directors decide its future.
- Each research programme has a lucide icon under its label in the
  question rows (`PROGRAMME_ICONS` in `components/QuestionRow.tsx`, by slug).
  The label stays the cell's first line, because the rows align on it.
- `/contact/` is the site's contact form (`components/ContactForm.tsx`,
  copy and topics in `content/contact.ts`). A link can choose the topic,
  `/contact/?topic=platform`, as About's Work with us and Resources' Ask
  about access do. Messages go to Formspree in the background, the address
  in `SITE.formEndpoint`. While that is empty, sending opens the visitor's
  email app with the message written, so the page never breaks.
- Formspree, once set up: a free account (50 messages a month) with the
  inbox that should receive messages, one form, its address pasted into
  `SITE.formEndpoint`. Keep reCAPTCHA off for that form, because the site
  sends in the background. Spam is caught by the hidden `_gotcha` field and
  Formspree's own filter. The visitor's email becomes the reply-to.

## Images in squares

The site's pictures are real photographs drawn in small indigo squares, the
way a machine sees, in the ordered (Bayer) pattern at three levels: no
square, a light one, a dark one.

- Every photograph is CC0 (free for any use, commercial included, no
  attribution). The site's came from rawpixel's and StockSnap's CC0 sets,
  found through the Openverse API. The one exception is the hero's film,
  Alex's choice, under the Pexels License: free for commercial use with no
  attribution, on the conditions written in `content/art.ts`. Anything
  else needs the same check before it goes in, and `content/art.ts` keeps
  every piece's source page.
- Making one: cut the subject out of its background (the site's were lifted
  with macOS Vision, `../ai-empathy-lab-motion/tools/lift`), then
  `python3 scripts/art/prepare.py <cutout.png> <name>` writes the tone map
  and the still to `public/art/` (needs Pillow and NumPy). Register it in
  `content/art.ts` with the ratio the script prints. Programme pages take
  theirs from `PROGRAMME_ART`.
- Making a film: extract its frames with ffmpeg, mask every frame with
  `../ai-empathy-lab-motion/tools/masks` (full-frame Vision masks), then
  `python3 scripts/art/prepare_video.py <frames> <masks> <name> --still <frame>`
  writes the ink video, its first frame and the still. It needs a still
  camera and an opening second with only the background in view, because
  props Vision drops from frame to frame are found by comparing with it.
  Register `video` and `videoStart` (the still's second) with the piece.
- `components/DitherArt.tsx` draws a piece live with WebGL2: the squares
  resolve once in view, then a patch of finer squares drifts across it and
  follows the pointer. The patch keeps the same colours as the rest, by
  decision. A piece with a video plays it muted on a loop, dithering every
  frame, and starts on the still's frame. It has no patch, by decision,
  so the action stays easy to follow.
- The hero's film is in one tone of the site's dark indigo (`oneTone: true`,
  its still made with `prepare_video.py --one-tone`), at the finest squares
  (`cell={1}`, 1 CSS px, touching like a fine print's dots), so faces and
  the robot's gripper read. Danylo chose this in October 2026 after full
  colour, a one-tone violet (out of step with the rest) and the two
  indigos (softer, and it changed how the film looked and moved).
- The film's grade lifts neutral shadows low in the frame hardest, so the
  shaded side of a white shirt reads as shade, not as a stain on the light
  page, while hair higher up stays dark.
- The microphone that opened the site now stands on the Symposium page,
  large and alone beside the opening's words with its right edge on the
  content grid, on the home hero's own ground (the veil gradient and
  grain), so it looks exactly as it did there. It looked right as a
  standalone element and crowded beside other pictures. It is the page's
  one picture: the call to register is a quiet banner, words left and
  button right. Ripples beside it were tried and were too much.
- The still, the canvas and the hidden video are sized inline, inside an
  inline-positioned frame, not only by `DitherArt.module.css`: a tab left
  open across a rebuild once lost that stylesheet and showed the hero's
  still at its own pixel size, filling the screen. Keep the inline sizes.
- Squares are drawn in whole device pixels: both components round
  `cell * devicePixelRatio`, and gaps are 0 or 1 pixel, never a fraction.
  At a ratio that is not a whole number (Chrome at 75% zoom on a retina
  Mac, a 4K monitor scaled to 1.5) fractional sizes gave some rows and
  columns a gap and others none, which turned the microphone's patch into
  a light mesh. Never go back to fractional cell sizes or gaps. At the loop's seam the squares
  dissolve and resolve again on the first frame, so two moments never
  overlap. `components/DitherField.tsx` draws the abstract loops (the
  platform card's conversation, the Symposium's ripples, the voice waveform
  under How we work). Both share `lib/dither.ts` and read their colours from the tokens.
- Everything moving runs only while on screen with the tab visible, draws a
  still frame under reduced motion, and drops to 30 fps at 1x pixels on weak
  hardware (`lib/lowPower.ts`, which also stops the partner carousel's
  autoscroll). Check changes with Chrome's CPU throttling and SwiftShader,
  not only on a fast machine.
- Never call `loseContext()` in an effect's cleanup. A canvas owns one
  context for life, and React runs effects twice in development, so the
  second run would draw on a dead context.
- The footer stays still, by decision.
- A piece fetches nothing until it is within a screen of being seen. The
  hero is `display: none` below 900px, so it is never laid out there and a
  phone never downloads its film (about 570 KB, a third of the home page,
  until October 2026).

## Films

A film is a master from the motion studio (`../ai-empathy-lab-motion`,
which owns the film), turned into the files the site serves by
`scripts/film/prepare_film.sh` and registered in `content/films.ts`.
`components/FilmPlayer.tsx` plays it. Two so far: the platform's, on
/platform/, and "What is AI empathy?", the first of one per explainer.

- An explainer names its film with `film` in `content/resources.ts`. The
  page shows it full width under the short answer (in the article column
  its smallest words would be 8px), and its Article carries the film as
  `video`, built by `videoObject` in `components/JsonLd.tsx`, the same
  builder /platform/ uses.
- An explainer film's poster is a frame from inside it that shows the idea
  (the definition card, for the first one), not the end card: under the
  page's own H1 a title or a logo says nothing the page does not.

- Five files per film: AV1 and HEVC at 1080 and 720, both 10-bit, and an
  H.264 720 fallback. 10-bit because the films are soft gradients behind
  sharp text: at 8 bits every encoder broke the gradients into blocks. The
  player takes AV1, then HEVC (every Apple device decodes it in hardware),
  then H.264, and 1080 only where the frame has the pixels for it.
- Nothing downloads until a visitor shows intent: the page carries a poster
  of a few kilobytes (AVIF, JPEG fallback, three widths). The film starts
  arriving when the pointer reaches the button or a finger touches it, and
  plays on the click. No autoplay, with sound, the browser's controls once
  it runs.
- A film is harder to correct than a sentence, and this repository is
  PUBLIC: once a film's file is committed it is in the history for good.
  Check every fact a film shows against the deployed platform BEFORE its
  files are committed. A service the platform offers only to some
  organizations is never named, in a film or anywhere on the site.
- The platform's master is 45 s at 1080p60, 10.5 MB. Its web files are
  1.7 to 2.5 MB each with the sound (VMAF 96 against the master).

## The Cary study page

`/research/ai-companions-healthy-aging/cary-study/` ("How the Cary study was
built"), reached from the study notes under the companionship programme's text
(`studyNotes` in `content/research.ts`). All its copy is in
`content/cary-study.ts`, whose header lists what a director must confirm before
it changes.

- The prompt is never published. This repository is public, so no prompt text
  lives anywhere in it: the page says in words what the prompt covers
  (`prompt.covers`) and which two slots differed between the groups. The one
  quoted placeholder in the conditions table ("No user data available yet") is
  a fact about what the no-memory group was given, not the prompt.
- Three short silent films of the app in use come from the motion studio
  (`films/cary-tour`, `cary-memory`, `cary-compare`). Each is made in two
  shapes: one that fills its half of the page or the whole width, and a phone
  shape below 900px. `scripts/film/prepare_loop.sh` makes the files, and
  `content/app-loops.ts` registers them. `components/AppLoopPlayer.tsx` plays
  them: muted, started only while on screen, pausable (a pause is kept),
  scrubbable, and not started at all under reduced motion. Only the shape on
  show fetches its poster, and only one in view loads its video. The
  conversations in them are illustrations, an invented "Maria" and her dog
  "Bobby", and a director approves a film before it is public. The Article
  carries each film as `video`, built by `appLoopObject` in
  `components/JsonLd.tsx`.
- `components/cary/` holds the drawings and the table: where a call's data
  goes, the path of one fact, the two conditions regrouped, and the prompt's
  slots. Their words are in the content file, beside the facts they restate.
  Every row of `conditions.rows` must be in exactly one of `conditions.groups`,
  or the build fails.

## Search and answer engines

- `SITE.url` is the host Vercel SERVES (www; the bare domain redirects to
  it). Canonicals, og:url, the sitemap and robots.txt all come from it, so
  if the two disagree every page's canonical points at a redirect. Check
  with `curl -I https://aiempathylab.com/` after any domain change.
- Structured data lives in `components/JsonLd.tsx`, one builder per page
  type: the lab (home, /about/), a person's ProfilePage, the publication
  library, a research programme, the explainers' Article, FAQ and
  breadcrumbs, the Cary study's Article and its films. Every value in it is
  one the page shows in words, except the dates: the pages show none (by
  decision, October 2026), so `published` and `reviewed` are structured data
  and sitemap lastmod only. Never add markup for something the page does not
  say.
- Papers join people by `authorsOf` in `content/publications.ts`: the
  surname matches and the APA initials include the member's first initial.
  A profile lists its member's papers, and its JSON-LD links them.
- Internal links between related pages come from the data, so they cannot
  drift: an explainer's `related` programmes also list that explainer under
  "Related explainers" on the programme page.
- No llms.txt. Google's own guidance says AI Overviews and AI Mode need no
  extra files or markup. What answer engines lift is crawlable text: the
  explainers' opening answers, current dates, and facts kept true.
- `published` on an explainer is the day it went live and never moves.
  `reviewed` moves with each full fact check, and so does dateModified.

## Gotchas

- Sections fade in through `components/ScrollReveal.tsx`, which marks them
  with a `data-shown` attribute, never a class: React rewrites the whole
  class list when it re-renders an element, which hid a revealed section
  again. Sections added later, or rebuilt by React (a live edit in dev), are
  watched as they arrive. Before that, an edit while the page was open
  left the Symposium's call to register invisible.

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
