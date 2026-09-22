# aiempathylab.com

The public website of the **AI Empathy Lab** — a static Next.js site, fully
branded against the lab's design tokens. Separate from (and linking to) the
research platform at app.aiempathylab.com.

## Running it

```bash
pnpm install
pnpm dev          # http://localhost:3100
pnpm typecheck    # tsc --noEmit
pnpm build        # static export → out/
pnpm preview      # serve the built out/ directory
```

The build is a full static export — plain HTML/CSS/JS in `out/`, deployable
on Vercel or any static host. No server, no database, no environment
variables.

## Where things live

```
content/     ALL site copy, typed. Edit these to change the site.
  site.ts          name, tagline, nav, contact, footer copy
  research.ts      the five research programmes (copy + SEO fields)
  publications.ts  working papers + selected publications (hand-maintained)
  team.ts          people, grouped; placeholder profiles are marked
  news.ts          the news feed — ⚠ SEED content, replace dates before launch
app/         one folder per route; pages read only from content/
components/  header, footer, theme toggle, cards; CSS Modules alongside
styles/
  tokens.css       the brand kit's light layer, vendored from
                   ../ai-empathy-lab-brand — do not hand-edit; re-vendor
                   deliberately when the kit versions up
  globals.css      base styles; everything references --ael-* semantic tokens
public/      favicons, PWA icons, OG card — all copied from the brand kit
```

## Rules that keep it consistent

- **Never introduce a colour.** Style against `--ael-*` semantic tokens only;
  the brand kit is the source of truth. The site is light-only by decision.
- **Pages read `content/`, never hold copy.** Swapping the publications list
  for a Zotero feed later means changing one module, zero pages.
- SEO titles/descriptions/H1s come from the lab's SEO plan verbatim —
  change them deliberately, not editorially.
- Trailing-slash URLs (`/about/`) are part of the SEO plan; `trailingSlash`
  stays on.

## Known placeholders (before launch)

- `content/team.ts` — Illia's bio and profile links
- `content/news.ts` — entry dates are unconfirmed seeds
- Team photos — initials avatars by design until a uniform photo set exists
