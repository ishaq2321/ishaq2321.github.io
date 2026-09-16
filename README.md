# Developer Portfolio

A fast, config-driven developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**, statically exported to GitHub Pages. Editorial "engineered monograph" design with a distinctive serif/mono/sans type system, dual light/dark themes, and scroll-triggered motion.

**Live:** [ishaq2321.github.io](https://ishaq2321.github.io)

![Portfolio preview](public/og.png)

---

## Highlights

- **Single source of truth** — nearly all content lives in `portfolio.config.json`, including which sections appear and in what order. No component edits needed to update your info.
- **Static export** — ships as plain HTML/CSS/JS to GitHub Pages (or any static host). No server required.
- **Build-time data** — GitHub stats, npm download counts, the OG social image, and your PDF résumé are all generated during `prebuild`.
- **Accessible** — respects `prefers-reduced-motion`, visible focus rings, skip-to-content link, ARIA-annotated navigation, WCAG AA contrast in both themes.
- **SEO-ready** — rich metadata, JSON-LD `Person` schema, sitemap, robots, and an auto-generated Open Graph image.
- **Dual theme** — CSS-variable-driven light/dark with a flash-prevention script and persisted preference.

---

## Tech Stack

| Layer     | Choice                                                           |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, static export)                           |
| Styling   | Tailwind CSS v4 + CSS variables                                  |
| Motion    | Framer Motion                                                    |
| Type      | Fraunces (display), Hanken Grotesk (body), JetBrains Mono (mono) |
| Language  | TypeScript                                                       |
| PDF / OG  | Puppeteer (build-time generation)                                |
| Hosting   | GitHub Pages via GitHub Actions                                  |

---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static export to out/
npm run preview    # serve the exported out/ locally
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Make It Yours

This portfolio is designed to be forked and reused. Most changes require editing **one file**.

### 1. Content — `portfolio.config.json`

| Key                                                | What it controls                                                                                                                                         |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`, `tagline`                                  | Hero headline — one claim, stated once                                                                                                                   |
| `proof`                                            | Hero evidence rail: `{ value, label, href? }`. Give each fact a number and a link to where it is proven; the hero then never repeats the sections below. |
| `about`                                            | Fallback hero deck, used only when `tagline` is empty                                                                                                    |
| `location`, `email`, `emails`, `contactCategories` | Contact section                                                                                                                                          |
| `social`                                           | GitHub / LinkedIn links                                                                                                                                  |
| `sections`                                         | **The section registry** — nav labels, page order and on/off switches. See [Sections](#2-sections--order-labels-and-numbers).                            |
| `skills.core`                                      | Curated short list shown in the Toolkit section                                                                                                          |
| `skills.*`                                         | Full inventory (languages, frameworks, AI/ML, security, platforms, tools), revealed behind a disclosure button                                           |
| `projects`                                         | Project cards (see fields below)                                                                                                                         |
| `writing`                                          | Optional Writing section: `{ title, venue, date, url, note? }`. Empty or absent → the section is not rendered.                                           |
| `notable_contributions`                            | Open-source PR cards                                                                                                                                     |
| `references`                                       | Optional References section: `{ quote, author, role, url, source }`. Empty or absent → the section is not rendered.                                      |
| `experience`                                       | Experience timeline                                                                                                                                      |
| `education`                                        | Education section (university, thesis, high school, achievements)                                                                                        |
| `goatcounter`                                      | GoatCounter analytics code (optional; leave `""` to disable)                                                                                             |

**Project fields:** `name`, `url`, `description`, `stack[]` are required. Optional: `live`, `benchmarkUrl`, `docsUrl`, `npm`, `pypi`, `highlights[]`, `featured`.

### 2. Sections — order, labels and numbers

`sections` is the single list that decides what the nav offers, what order the page renders in, and which chapter number each section carries:

```json
"sections": [
  { "id": "contributions", "label": "Open Source" },
  { "id": "projects", "label": "Projects", "title": "Selected Work" },
  { "id": "skills", "label": "Toolkit" },
  { "id": "writing", "label": "Writing" },
  { "id": "references", "label": "Recommendations" },
  { "id": "contact", "label": "Contact" }
]
```

- **Reorder** — just move a row. Chapter numbers are derived from the position among _visible_ sections, so they renumber themselves and can never end up with a gap.
- **Rename** — change `label` (the nav entry) and, if you want the heading to differ from it, `title`. `projects` above renders as “Selected Work” while the nav says “Projects”.
- **Switch a section off** — set `"enabled": false`. The component and its content stay in the repo; the section disappears from the nav and the page together, and everything after it renumbers. There is no way to leave a dead `#anchor` link behind.
- **Empty means off** — Writing and References hide themselves while their content arrays are empty, so a fork that deletes the sample entries also loses the headings.

**How many sections fit in the nav?** The desktop bar shows the list only while it fits beside the wordmark — nine sections with the shipped labels. Past that the nav automatically uses the same menu as mobile at _every_ width, so a section can never be silently clipped out of the bar or break onto two lines. `FITTING_SECTIONS` in `app/components/Nav.tsx` sets the limit, and the comment above it records the measured budget if you want to retune it for longer labels.

`id` is the link between this list and the component that draws the section, so treat it as a primary key: renaming `label` is free, but renaming `id` also moves the URL fragment and needs the matching key in `COMPONENTS` in `app/page.tsx`.

**Adding a brand-new section** is the one change that touches code:

1. Write the component. It receives `{ anchor, index, title }` (see `SectionProps` in `app/types.ts`), puts `id={anchor}` on its outermost element, and passes `index`/`title` to `SectionHeader`.
2. Add it to `COMPONENTS` in `app/page.tsx`.
3. Add one row to `sections` in the config.

If a registry row has no component, the build fails with a message naming the `id` — rather than quietly shipping a nav link to nowhere. Reordering, renaming and switching off never require any of this.

### 3. Books — `lib/books.ts`

An optional "Bookshelf" section. Each entry is `{ title, author, isbn? }`. Covers are fetched from Open Library by ISBN with a text fallback.

### 4. Skill icons — `lib/iconMap.ts`

Maps a skill name to a [Simple Icons](https://simpleicons.org) slug. Unmapped skills render a neutral dot. Add entries to give a skill its brand icon.

### 5. Theme & design — `app/globals.css`

All colors are CSS variables under `:root` (dark) and `html.light` (light). Change the accent by editing `--accent` / `--accent-text` in both blocks. Fonts are wired in `app/layout.tsx`.

### 6. Assets — `public/`

#### Your photograph never enters the repository

The hero shows `config.photo`, a 1:1 image. That file is **not committed**. It is a
personal photograph, and anything committed to a public repository is published
permanently — including in the git history, via `raw.githubusercontent.com`, and to
every crawler that reads it. So the photograph is generated on your machine, kept out
of git (`.gitignore`), and injected into the deploy from repository secrets.

Frame your own with:

```
pip install pillow
python3 scripts/prepare-portrait.py --photo me.jpg --face 1231,877,1077
```

`--face` is `head centre x, eye-line y, crown-to-chin height` in pixels; `--guide out.png`
writes your photo back with a coordinate grid to measure them, and `--preview out.jpg`
shows the result at the hero's real sizes on both theme backgrounds. Add `--tone neutral`
for plain greyscale, or `--tone color` to keep the original colour. The script crops and
grades only — it never redraws the face, so the likeness stays exact because the output
*is* the photograph.

The default `warm` tone is tuned to the palette, not to taste: the page's large areas are
nearly neutral (`--bg` ink is +2 warm, paper +7) while its type is warm (bone `#c2b9ae`
is +20, muted +26). The grade is a duotone onto ink → bone with the chroma lifted and a
faint vignette, which lands the face at +21 warmth and the shadowed background at +7 —
the same family as the type, without sepia-washing the shadows.

#### Getting it into the deploy

Two repository secrets carry the two files as base64, and the build job writes them into
`public/` before `npm run build`. Set or rotate them with:

```
base64 -w0 public/portrait.webp      | gh secret set PORTRAIT_B64
base64 -w0 public/portrait-head.webp | gh secret set PORTRAIT_HEAD_B64
```

The step prints the byte count and `sha256` of each decoded file, so a bad paste is
visible against `sha256sum public/portrait.webp` locally, and a file that is not a WebP
fails the build instead of shipping a broken image. With no secret — a fork, or a pull
request from one — nothing is written and `lib/portrait.ts` resolves the missing file
away, so the hero renders the monogram it already falls back to. `config.photo` names
the path to *request*; only a path that exists reaches an `<Image>`.

#### What this does and does not protect

Honest scope, because it is easy to over-claim here:

- **The image is still public on the live site.** Any file a browser can display can be
downloaded by a person or a bot; there is no way around that while showing it.
- **`app/robots.ts` asks AI crawlers not to take it** (GPTBot, ClaudeBot, CCBot,
  Google-Extended and others are disallowed from the two portrait paths only — the rest
  of the site stays open, since being found is the point). That is a request that
  well-behaved crawlers honour, not access control.
- **The licence carves the personal content out.** `LICENSE` is MIT for the code, but the
  photographs, CV and other personal documents are © all rights reserved, so a fork
  cannot claim them as part of the template it licensed.
- **It is not in git, so it is not in the history** — which is the part that cannot be
  undone later. Removing a committed image means rewriting history and force-pushing.

If you would rather not publish a photograph at all, delete the two `photo`/`photoHead`
entries from `portfolio.config.json`: the hero renders your monogram and nothing is
exposed.

**Depth motion (optional).** Set `config.photoHead` to a second image — an alpha cutout of
the subject — and the hero drifts the two layers against each other as the pointer moves,
which reads as depth instead of a flat card:

```
python3 scripts/prepare-portrait.py --photo me.jpg --face 1231,877,1077 \
  --out public/portrait.webp --subject public/portrait-head.webp
```

The cutout is taken from the same crop, so at rest the layers line up exactly. A plain
background is cut automatically; for a busy one, pass `--subject-polygon "x,y x,y ..."`
with an outline read off `--guide`, and `--cutout-check out.jpg` to see it on a loud
background where a bad edge is obvious. Omit `photoHead` and the hero just shows `photo`.
Pointer motion is disabled under `prefers-reduced-motion`.

An outline is in source-photo pixels, so it is only reusable with the same crop — worth
keeping beside the photo (`portrait-preview/` is gitignored for exactly this).

**Where to put the edge of the cut.** The two layers hold the same photograph, so they
differ by the couple of pixels the drift pulls them apart. Where the cut crosses smooth
content that difference is invisible; where it crosses textured detail it shows as a
seam. So run the outline through the *smoothest* part of the subject — hair against sky,
smooth skin, a dark jacket — and never across a beard, stripes or a busy edge. You can
measure it instead of guessing:

```
python3 - <<'PY'
from PIL import Image
px = Image.open("me.jpg").convert("L").load()
for y in range(1300, 1700, 20):
    print(y, sum(abs(px[x, y + 3] - px[x, y - 3]) for x in range(1060, 1520, 4)) / 115)
PY
```

The lowest number is the best band to end the cut — in this photograph it is the neck at
y≈1560, where the cut sits, rather than y≈1330 across the beard, where it started.

Drop in `resume.pdf` (or let the generator build one). `og.png` is generated automatically.

---

## Build-Time Generation

The `prebuild` script runs automatically before every build:

```
fetch-github-stats.mjs  → public/github-stats.json   (repos, stars, followers, merged PRs)
fetch-npm-stats.mjs     → public/npm-stats.json       (weekly + total downloads per package)
generate-og.mjs         → public/og.png               (1200×630 social share card)
generate-resume.mjs     → public/resume.pdf           (one-page PDF résumé from config)
```

`scripts/prepare-portrait.py` is deliberately **not** in that chain: the portrait is an authored
asset, so a build must never regenerate or overwrite it. The deploy workflow does write it
into `public/` from repository secrets just before the build (see "Your photograph" above).

To refresh GitHub stats without hitting rate limits, set a `GITHUB_TOKEN` environment variable before building.

---

## Project Structure

```
app/
  components/        UI components (Hero, About, Projects, Skills, …)
  globals.css        Design system: theme tokens, component utilities
  layout.tsx         Metadata, fonts, JSON-LD, theme script
  page.tsx           Section composition
  opengraph-image…   (generated) — see scripts/generate-og.mjs
  robots.ts          robots.txt
  sitemap.ts         sitemap.xml
lib/
  config.ts          Typed loader for portfolio.config.json
  sections.ts        Derives the nav/page section list from the registry
  books.ts           Bookshelf data
  iconMap.ts         Skill → Simple Icons slug map
scripts/             Build-time generators (stats, OG, résumé)
public/              Static assets + generated JSON/PDF/PNG
portfolio.config.json  ← your content lives here
```

---

## Deployment

Pushing to `main` triggers the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Type-check and lint
2. `npm run build` (runs `prebuild` generators, then static export)
3. Deploy `out/` to GitHub Pages

To deploy elsewhere, run `npm run build` and serve the `out/` directory on any static host.

---

## License

Released under the [MIT License](LICENSE) — see the `LICENSE` file. Attribution appreciated but not required: fork it and make it yours.
