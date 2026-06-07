# ishaq2321.github.io

Personal developer portfolio — [ishaq2321.github.io](https://ishaq2321.github.io)

Built with **Next.js 16 + Tailwind CSS v4 + TypeScript**, statically exported to GitHub Pages. Animations via **Framer Motion**.

### Sections
- **Hero** — photo, tagline, GitHub / Contact / Resume links
- **About** — two-paragraph bio (ELTE, backbencher.cc, VS Code, Flutter, thesis)
- **GitHub Stats** — live stats (repos, stars, followers, merged PRs) via GitHub REST API v3
- **Notable Contributions** — open-source PRs to VS Code and Flutter
- **Projects** — 5 project cards (backbencher.cc, ProxiCall, PhishGuard, hide-and-lock, phantomVault) with stack tags and highlights
- **Skills & Tools** — 2-column grid: Languages, Frameworks, Mobile, AI/ML, Security, Platforms, OS, Tools
- **Education & Achievements** — Tsinghua University full-scholarship highlight, ELTE (BSc, thesis, Stipendium Hungaricum), BRC Loralai (Provincial Topper)
- **Bookshelf** — 72 books across existentialist philosophy, Sufism, Urdu Islamic scholarship, and Pashto poetry. Covers fetched live from Open Library with ISBN fallback.
- **Contact** — categorized email buttons + GitHub, LinkedIn, Resume, Email links

### Design
- Dark/light mode with persistent toggle and flash-prevention script
- Responsive: mobile-first with collapsible navigation
- Framer Motion scroll-triggered animations throughout
- Section-scoped active link highlighting in nav bar
- Consistent card, pill, and section layout system using custom Tailwind components

### Development

```bash
npm install
npm run dev        # Development server (http://localhost:3000)
npm run build      # Static export to out/
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run preview    # Serve out/ locally
```

### CI/CD

GitHub Actions workflow (`.github/workflows/deploy.yml`):
- TypeScript check and lint on every push to `main`
- Builds and deploys to GitHub Pages only when `app/`, `lib/`, `public/`, or `portfolio.config.json` change
- Uses `actions/deploy-pages` for the deployment step

### Configuration

| Data | Source |
|------|--------|
| Personal info, skills, projects, education | `portfolio.config.json` |
| Books (72 titles) | `lib/books.ts` |
| GitHub stats | Live API fetch (unauthenticated, rate-limited) |
