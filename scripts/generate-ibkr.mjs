import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));

function link(href, text) {
  return `<a href="${href}" style="color:#2563eb;text-decoration:none;">${text}</a>`;
}

const msftPRs = config.notable_contributions.filter((p) => p.repo === "microsoft/vscode");
const flutterPRs = config.notable_contributions.filter((p) => p.repo === "flutter/flutter");

function prLine(pr) {
  return `<span style="font-size:7.8pt;color:#444;">${link(pr.url, "#" + pr.pr_number)} ${pr.description}</span>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Muhammad Ishaq Khan — Resume</title>
<style>
  @page { size: letter; margin: 0.38in 0.42in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #111;
    font-size: 8.5pt;
    line-height: 1.33;
  }
  a { text-decoration: none; }
  h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 10pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.4pt; color: #111;
    border-bottom: 0.8pt solid #222;
    padding-bottom: 1.5pt; margin: 8pt 0 3pt 0;
  }
  header { text-align: center; margin-bottom: 8pt; }
  header h1 {
    font-family: Georgia, serif; font-size: 15pt;
    font-weight: 700; letter-spacing: 0.5pt; margin-bottom: 3pt;
  }
  header .contact { font-size: 7.5pt; }
  header .contact a { margin: 0 6pt; }
  .profile { font-size: 8pt; line-height: 1.32; margin-bottom: 0pt; }
  .entry { margin-bottom: 6pt; }
  .entry-title { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title .role { font-weight: 600; font-size: 8.5pt; }
  .entry-title .period { font-size: 7.5pt; color: #444; }
  .entry-org { font-size: 8pt; font-style: italic; margin-top: 0.5pt; }
  .entry-desc { font-size: 8pt; margin-top: 1pt; line-height: 1.28; }
  .entry-points { margin-top: 2pt; margin-left: 10pt; }
  .entry-points li { font-size: 7.8pt; line-height: 1.28; margin-bottom: 0.5pt; }
  .skills-cat { margin-bottom: 1.5pt; line-height: 1.25; }
  .skills-cat strong { font-size: 8pt; font-family: Georgia, serif; font-weight: 600; }
  .skills-cat span { font-size: 7.5pt; }
  .pr-block { margin-bottom: 5pt; }
  .pr-block .org { font-weight: 600; font-size: 8.5pt; }
  .pr-block .items { margin-left: 10pt; margin-top: 1pt; }
  .pr-block .items div { font-size: 7.8pt; line-height: 1.3; margin-bottom: 0.5pt; }
</style>
</head>
<body>

<header>
  <h1>${config.name}</h1>
  <p class="contact">
    ${link("https://ishaq2321.github.io", "ishaq2321.github.io")} &middot;
    ${link("https://github.com/ishaq2321", "github.com/ishaq2321")} &middot;
    ${link("https://linkedin.com/in/2321ishaq", "linkedin.com/in/2321ishaq")} &middot;
    ${link("mailto:" + config.email, config.email)}
    &nbsp;&middot;&nbsp; <span style="color:#555;">${config.location}</span>
  </p>
</header>

<h2>Profile</h2>
<p class="profile">
  Computer Science graduate from ELTE, Budapest, with full-stack development and systems engineering experience. Built production applications using <strong>Java</strong>, <strong>Python</strong>, and <strong>TypeScript/JavaScript</strong> across both server-side and front-end stacks. Designed and deployed RESTful APIs with FastAPI, real-time data pipelines with SQLite and PostgreSQL, and reactive front-end interfaces. Developed a quantitative ML-based phishing detection system (96.45% accuracy, XGBoost pipeline) and architected a code intelligence platform with 13 tools for code analysis and security scanning. Contributed performance and security fixes to <strong>Microsoft VS Code</strong> and <strong>Flutter</strong>. Passionate about building mission-critical systems with clean architecture and data-driven decision making.
</p>

<h2>Education</h2>
<div class="entry">
  <div class="entry-title">
    <span class="role">${config.education.degree} &mdash; ${config.education.university}</span>
    <span class="period">${config.education.period}</span>
  </div>
  <p class="entry-desc">
    ${config.education.faculty}. ${config.education.scholarship ? config.education.scholarship + ". " : ""}
    Thesis: ML-based phishing detection with XGBoost and OSINT-enriched features (96.45% accuracy, 99.41% AUC-ROC, 725 tests).
    Selected for <strong>Tsinghua University</strong> (world #1 in CS, US News) with full scholarship.
  </p>
</div>

<h2>Experience</h2>

<div class="entry">
  <div class="entry-title">
    <span class="role">Founder &amp; Full-Stack Developer</span>
    <span class="period">March 2026 &ndash; Present</span>
  </div>
  <p class="entry-org">backbencher.cc</p>
  <p class="entry-desc">
    Architected and built an open-core code intelligence platform with a SQLite knowledge graph processing 39 languages through Tree-sitter AST parsing.
  </p>
  <ul class="entry-points">
    <li>Designed a modular system architecture with 13 independent tools (search, refactoring, security scanning, migration planning) and LSP/MCP protocol integration</li>
    <li>Built RESTful API layer and CLI interface handling complex code queries, call-graph traversal, and vulnerability detection</li>
    <li>Integrated AI-assisted analysis with OpenAI, Gemini, and DeepSeek LLM providers for compiler-level code reasoning</li>
    <li>Wrote comprehensive testing and monitoring to ensure high availability of analysis pipelines</li>
  </ul>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Full-Stack Systems Developer</span>
    <span class="period">September 2025 &ndash; Present</span>
  </div>
  <p class="entry-org">ProxiCall</p>
  <p class="entry-desc">
    Developed a production multi-tenant super-app with GIS mapping, payment processing, and real-time notification systems.
  </p>
  <ul class="entry-points">
    <li>Built 5 integrated backend systems (CMS, PMS, OMS, NMS, ENS) with RESTful APIs using Node.js and Express</li>
    <li>Designed SQL database schemas across Supabase (PostgreSQL) and Firebase (Firestore) for relational and real-time data</li>
    <li>Integrated Stripe Connect for multi-currency payment routing and Mapbox for geospatial content delivery</li>
    <li>Implemented a 32-language translation pipeline and Sentry-based health monitoring across all services</li>
  </ul>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Quantitative Developer (BSc Thesis)</span>
    <span class="period">September 2025 &ndash; June 2026</span>
  </div>
  <p class="entry-org">ELTE Faculty of Informatics</p>
  <ul class="entry-points">
    <li>Built a full-stack risk detection system: Python FastAPI backend with XGBoost ML model (96.45% accuracy, 99.41% AUC-ROC), Next.js frontend with React/TypeScript</li>
    <li>Engineered a 21-feature data pipeline processing 23,374 samples with automated OSINT enrichment (WHOIS, DNS, VirusTotal)</li>
    <li>Optimized Oracle-compatible SQL queries and schema design for efficient feature storage and batch processing (50 concurrent URL analyses)</li>
    <li>Delivered 725 automated tests (592 pytest backend + 133 Jest frontend) with full regression coverage</li>
  </ul>
</div>

<h2>Open Source Contributions</h2>
<div class="pr-block">
  <div class="org">Microsoft (VS Code)</div>
  <div class="items">
    ${msftPRs.map((p) => `<div>&#8226; ${prLine(p)}</div>`).join("")}
  </div>
</div>
<div class="pr-block">
  <div class="org">Flutter</div>
  <div class="items">
    ${flutterPRs.map((p) => `<div>&#8226; ${prLine(p)}</div>`).join("")}
  </div>
</div>

<h2>Technical Skills</h2>
<div class="skills-cat"><strong>Back-End</strong> <span>Java, Python, Node.js, Express, FastAPI, TypeScript, RESTful API design, Vert.x concepts, event-driven architecture</span></div>
<div class="skills-cat"><strong>Front-End</strong> <span>React, Next.js, Vue.js concepts, JavaScript, HTML5, CSS3, Tailwind CSS, Flutter</span></div>
<div class="skills-cat"><strong>Databases &amp; Data</strong> <span>SQLite, PostgreSQL, Firebase/Firestore, Supabase, Oracle SQL concepts, schema design, query optimization, ETL pipelines</span></div>
<div class="skills-cat"><strong>Quantitative &amp; ML</strong> <span>XGBoost, scikit-learn, NLP (spaCy), SHAP, Optuna, statistical analysis, data visualization, 96.45% accuracy ML pipeline</span></div>
<div class="skills-cat"><strong>Infrastructure</strong> <span>Git, GitHub Actions, Docker, Sentry, Stripe, Vercel, Render, Linux, Agile development</span></div>

</body>
</html>`;

const outPath = "/home/ishaq2321/jobs/interactive-brokers.pdf";

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load", timeout: 15000 });
  await page.pdf({
    path: outPath,
    format: "letter",
    printBackground: true,
    margin: { top: "0.38in", bottom: "0.38in", left: "0.42in", right: "0.42in" },
    scale: 0.91,
  });
  await browser.close();
  console.log("CV -> " + outPath);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
