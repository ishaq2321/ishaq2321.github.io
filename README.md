# ishaq2321.github.io

Personal developer portfolio — [ishaq2321.github.io](https://ishaq2321.github.io)

Built with **Next.js + Tailwind CSS + TypeScript**, static-exported to GitHub Pages.

### Features
- Live GitHub stats (repos, stars, followers, PRs) fetched via API
- Showcases notable open-source contributions (VS Code, Flutter)
- Project cards with stack pills and highlights
- Skills grid with categorized tools
- Academic section with thesis and TDK
- Bookshelf
- Dark-themed by default

### Development
```bash
npm install
npm run dev        # Development server
npm run build      # Static export to out/
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run preview    # Serve out/ locally
```

### Smart CI/CD
- Every push runs typecheck + lint
- Deploys only when `app/`, `lib/`, `public/`, or `portfolio.config.json` change
- Skips deploy on test-only or docs-only changes

### Data
- **Live**: GitHub stats, repos, PRs — fetched client-side, no tokens needed
- **Static**: Skills, projects, books, education — in `portfolio.config.json`
