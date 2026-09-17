# Developer Portfolio

A fast, config-driven developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**, statically exported to GitHub Pages. Editorial "engineered monograph" design with a distinctive serif/mono/sans type system, one dark palette, and scroll-triggered motion.

**Live:** [ishaq2321.github.io](https://ishaq2321.github.io)

![Portfolio preview](public/og.png)

---

## Highlights

- **Single source of truth** — nearly all content lives in `portfolio.config.json`, including which sections appear and in what order. No component edits needed to update your info.
- **Static export** — ships as plain HTML/CSS/JS to GitHub Pages (or any static host). No server required.
- **Build-time data** — GitHub stats, npm download counts, the OG social image, and your PDF résumé are all generated during `prebuild`.
- **Accessible** — respects `prefers-reduced-motion`, visible focus rings, skip-to-content link, ARIA-annotated navigation, WCAG AA contrast.
- **SEO-ready** — rich metadata, JSON-LD `Person` schema, sitemap, robots, and an auto-generated Open Graph image.
- **Dark only** — a single CSS-variable palette in `app/globals.css`, so the accent, the hairlines and the graded hero portrait are all judged against the same ink. No theme switch, no boot script, nothing to flash.

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
| `location`                                         | Where you are — shown in the hero meta line and the Contact section                                                                                      |
| `emailEncoded`, `contactCategories`                | Contact addresses, base64-encoded so a scraper reading the HTML finds no literal address. `contactCategories` is what the section lists as labelled links (`{ label, encoded }`); `emailEncoded` is the single address the generated résumé prints. Put only addresses you are happy to publish — the site shows exactly these and nothing else. |
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

Out of the box these ids exist, in the order they ship: `contributions`, `projects`, `experience`, `stats`, `skills`, `writing`, `education`, `books`, `references`, `contact`. Any of them can be reordered, renamed or switched off from this one list; `writing` and `references` also disappear on their own while their content arrays are empty, and `books` reads its entries from `lib/books.ts` rather than the config.

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

All colors are CSS variables under `:root` — one palette, dark. Change the accent by editing `--accent` / `--accent-text`. Fonts are wired in `app/layout.tsx`.

A light palette (`html.light`), its toggle and its flash-prevention script used to live here and were removed deliberately: it had never been tuned as a set with the accent and the portrait, so it read as a different site. Adding one back means re-grading the portrait and re-checking every contrast pair — not just flipping a class.

That decision is enforced rather than remembered. `npm run check:palette` scans the
export for a light palette, a light token, a toggle or a stored-theme script, then
renders the built site under `prefers-color-scheme: light` — and with a stored `"light"`
preference — at desktop and mobile widths, asserting the ink background, `color-scheme:
dark`, no toggle in the DOM, and a hero that actually painted. The deploy runs it before
uploading the artifact, so a regression fails the build instead of reaching visitors who
happen to prefer light. `scripts/test-palette-guard.sh` mutates a build to prove the
guard still fails when it should (7 cases, including a light palette injected only via a
media query, which no string scan would name).

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
shows the result at the hero's real sizes on the page's ink. Add `--tone neutral`
for plain greyscale, or `--tone color` to keep the original colour. The script crops and
grades only — it never redraws the face, so the likeness stays exact because the output
*is* the photograph.

The default `warm` tone is tuned to the palette, not to taste: the page's large areas are
nearly neutral (`--bg` ink is +2 warm, paper +7) while its type is warm (bone `#c2b9ae`
is +20, muted +26). The grade is a duotone onto ink → bone with the chroma lifted and a
faint vignette, which lands the face at +21 warmth and the shadowed background at +7 —
the same family as the type, without sepia-washing the shadows.

#### Getting it into the deploy

One repository secret carries the file as base64, and the build job writes it into
`public/` before `npm run build`. Set or rotate it with:

```
base64 -w0 public/portrait.webp | gh secret set PORTRAIT_B64
```

The step prints the byte count and `sha256` of each decoded file, so a bad paste is
visible against `sha256sum public/portrait.webp` locally, and a file that is not a WebP
fails the build instead of shipping a broken image. With no secret — a fork, or a pull
request from one — nothing is written and `lib/portrait.ts` resolves the missing file
away, so the hero renders the monogram it already falls back to. `config.photo` names
the path to *request*; only a path that exists reaches an `<Image>`.

#### The offer letter — why it is encrypted instead

`public/tsinghua-offer.pdf` is a personal document and gets the same goal — still served
on the site, not published in the repository — but it **cannot** ride a secret the way
the photograph does. Its base64 is 893 KB, and GitHub refuses secrets anywhere near that
size (48 KB per secret), as does the kernel's limit for one process-environment string
(128 KB). So the repository carries the file **encrypted** and only the key is a secret:

```
# one-off: make a key, encrypt, keep the key out of git (temp/ is ignored)
openssl rand -base64 32 > temp/private/offer-letter.key
openssl enc -aes-256-cbc -pbkdf2 -iter 200000 -salt \
  -in public/tsinghua-offer.pdf -out encrypted/offer-letter.pdf.enc \
  -pass file:temp/private/offer-letter.key
gh secret set OFFER_LETTER_KEY < temp/private/offer-letter.key

# to rotate the key, or to replace the document: repeat the three lines above
```

A public repository holding ciphertext gives a crawler nothing, which is the point — the
plaintext is never committed, and a `raw.githubusercontent.com` hit returns noise. The
build decrypts it into `public/` before the export and checks the `%PDF` signature, so a
wrong key fails the deploy loudly instead of serving a corrupt file. The ciphertext is a
committed blob, so replacing the document adds a new blob and the old one stays in
history, which is worth knowing before you put anything genuinely sensitive in there.

When you fork: the link is not gated on the file existing, so a fork that keeps the
Tsinghua achievement without its own PDF links to a missing file (`OFFER_LETTER_KEY` is
unset, so the build warns and serves nothing). Drop the achievement, or bring your own
document — and if you want this treatment, keep your own copy of `encrypted/` intact.

#### What this does and does not protect

Honest scope, because it is easy to over-claim here:

- **The image is still public on the live site.** Any file a browser can display can be
downloaded by a person or a bot; there is no way around that while showing it.
- **`app/robots.ts` asks AI crawlers not to take it** (GPTBot, ClaudeBot, CCBot,
  Google-Extended and others are disallowed from the two personal paths only — the
  photograph and the offer letter — while the rest of the site stays open, since being
  found is the point). That is a request that well-behaved crawlers honour, not access
  control.
- **The licence carves the personal content out.** `LICENSE` is MIT for the code, but the
  photographs, CV and other personal documents are © all rights reserved, so a fork
  cannot claim them as part of the template it licensed.
- **It is not in git, so it is not in the history** — which is the part that cannot be
  undone later. Removing a committed image means rewriting history and force-pushing.

#### Which addresses appear, and where

Three places can carry an address, and they are all deliberate:

- **The page** lists `contactCategories` only — the labelled work addresses. Nothing else
  is printed, so a personal mailbox is not on the site even though the code could show it.
- **The résumé PDF** prints `emailEncoded`, chosen separately from the addresses above.
  It is one address, and it is the one you are willing to hand to recruiters.
- **Git** should not carry one at all. A personal address that was once written into
  `portfolio.config.json` was removed from every commit, not just from the current
  version, and the commits are authored with a GitHub `noreply` address so the history
  does not publish a mailbox either. If you fork this, that is the habit worth copying:
  an address you would not put on a business card does not belong in a commit.

Your git identity is what decides this, not the project, so set it once and every future
commit is safe by default — `noreply` addresses keep the commits attributed to your GitHub
account without exposing a mailbox:

```
git config --global user.name  "Your Name"
git config --global user.email "<your-github-user-id>+<your-username>@users.noreply.github.com"
```

Find the id with `gh api users/<your-username> --jq .id`. Worth checking the result of
`git log --format='%an <%ae>' | sort -u` in a repository you are about to make public:
every commit you ever make carries that address, and rewriting it later means rewriting
the whole history.

If you would rather not publish a photograph at all, delete the `photo` entry from
`portfolio.config.json`: the hero renders your monogram and nothing is exposed.

**The hero's motion.** The card tilts with the pointer and the photograph drifts and
zooms very slightly inside it — one image, moved as one piece, so the face stays crisp
while it moves. Pointer motion is disabled under `prefers-reduced-motion`, leaving a
still photograph.

An earlier version moved *two* layers — the photograph plus an alpha cutout of the head —
in opposite directions, which is the usual way to fake parallax. It was removed, and the
reason is worth recording so nobody rebuilds it: the two layers hold the same crop, so
any separation shows as a second copy of the subject offset by exactly that separation.
Measured at the card edge the two were **6.4px apart**, which put a doubled outline of the
head and beard over the real one and ran the cut visibly across the jaw; they were not
even registered at rest, because the near layer carried a larger scale than the far one.
Feathering the cut only converts a hard seam into a soft halo, and filling the hidden area
with reconstructed background (blur, then diffusion inpainting) leaves a smudge where the
surrounding night scene has detail — two copies of one photograph always disagree
somewhere, and a face is the worst place for it to happen.

If you want that effect anyway, `prepare-portrait.py --subject` still produces the cutout
(it is a good tool for a plain background), but expect the seam: it is inherent, not a
tuning problem. Motion on *one* image is the version that cannot break a face.

`resume.pdf` is generated from your config on every build and is **not committed** — it is a
personal document, and committing it puts an address and a phone number into the
repository permanently. `og.png` is committed, since it carries nothing private and social
previews need a stable URL for it.
`encrypted/offer-letter.pdf.enc` is the one committed blob a build decrypts — see above.

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
  layout.tsx         Metadata, fonts, JSON-LD
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
