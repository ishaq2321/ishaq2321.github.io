import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));
const email = Buffer.from(config.emailEncoded, "base64").toString("utf-8");

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
    ${link("mailto:" + email, email)}
    &nbsp;&middot;&nbsp; <span style="color:#555;">${config.location}</span>
  </p>
</header>

<h2>Profile</h2>
<p class="profile">
  Computer Science graduate from ELTE, Budapest, with a strong quantitative and systems engineering background. Built an AST-native code intelligence platform (<strong>backbencher.cc</strong>) with 13 tools for semantic search and code analysis across 39 languages. Developed a full-stack ML-based phishing detection system achieving 96.45% accuracy with a 21-feature XGBoost pipeline and 725 automated tests. Contributed performance and security fixes to <strong>Microsoft VS Code</strong> and <strong>Flutter</strong>. Experienced with AI-assisted development (GitHub Copilot, Claude Code, custom tooling). Proficient in Python, C++, Java, TypeScript, and JavaScript across production systems.
</p>

<h2>Education</h2>
<div class="entry">
  <div class="entry-title">
    <span class="role">${config.education.degree} &mdash; ${config.education.university}</span>
    <span class="period">${config.education.period}</span>
  </div>
  <p class="entry-desc">
    ${config.education.faculty}. ${config.education.scholarship ? config.education.scholarship + ". " : ""}
    Thesis: Machine Learning-based phishing detection using XGBoost with OSINT-enriched features (96.45% accuracy, 99.41% AUC-ROC, 725 tests).
    Selected for <strong>Tsinghua University</strong> (world #1 in CS, US News) with full scholarship.
  </p>
</div>

<h2>Experience</h2>

<div class="entry">
  <div class="entry-title">
    <span class="role">Founder &amp; Systems Architect</span>
    <span class="period">March 2026 &ndash; Present</span>
  </div>
  <p class="entry-org">backbencher.cc</p>
  <p class="entry-desc">
    Designed and built an open-core code intelligence platform with a SQLite knowledge graph backend supporting 39 languages.
  </p>
  <ul class="entry-points">
    <li>Architected 13 brain tools for semantic search, AST-precise refactoring, call-graph analysis, and security scanning</li>
    <li>Engineered Tree-sitter AST parsing pipeline processing codebases across 39 languages into queryable knowledge graphs</li>
    <li>Integrated AI-assisted code analysis with LLM providers (OpenAI, Gemini, Mistral, DeepSeek) and MCP/LSP protocol support</li>
    <li>Benchmarked against TypeScript and Roslyn codebases, demonstrating compiler-level code reasoning capabilities</li>
  </ul>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Full-Stack Systems Developer</span>
    <span class="period">September 2025 &ndash; Present</span>
  </div>
  <p class="entry-org">ProxiCall</p>
  <p class="entry-desc">
    Architected a production Flutter proximity super-app with multi-currency Stripe Connect payments serving global users.
  </p>
  <ul class="entry-points">
    <li>Designed 5 integrated systems: Content Management, Payment Management, Order Management, Notification Management, and Entity Notification System</li>
    <li>Built a 32-language auto-translation pipeline with AI-segmented geo-targeted push notifications</li>
    <li>Integrated Firebase, Supabase, and Sentry for real-time data, authentication, and monitoring across the platform</li>
  </ul>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Quantitative ML Research (BSc Thesis)</span>
    <span class="period">September 2025 &ndash; June 2026</span>
  </div>
  <p class="entry-org">ELTE Faculty of Informatics</p>
  <ul class="entry-points">
    <li>Developed a phishing detection system combining XGBoost ML (96.45% accuracy, 99.41% AUC-ROC), NLP with 10 tactic detectors, and OSINT enrichment</li>
    <li>Engineered a 21-feature pipeline (17 URL structural + 4 OSINT: WHOIS, DNS, VirusTotal, AbuseIPDB) trained on 23,374 samples</li>
    <li>Built a full-stack application: FastAPI backend (Python), Next.js frontend (TypeScript), deployed on Vercel and Render</li>
    <li>Implemented SHAP model explainability, batch processing (50 URLs parallel), and 725 automated tests (592 pytest + 133 Jest)</li>
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
<div class="skills-cat"><strong>Languages</strong> <span>Python, C++, Java, TypeScript, JavaScript, Dart, SQL, Shell/Bash, HTML/CSS</span></div>
<div class="skills-cat"><strong>System Architecture</strong> <span>Distributed system design, REST API design, SQLite, PostgreSQL, Docker, SST, Vercel, Render</span></div>
<div class="skills-cat"><strong>AI / ML</strong> <span>XGBoost, scikit-learn, NLP (spaCy), SHAP, Optuna, OpenAI API, Gemini, GitHub Copilot, Claude Code, Mistral, DeepSeek v4 Pro, Semantic Search</span></div>
<div class="skills-cat"><strong>Data &amp; Infrastructure</strong> <span>Firebase, Supabase, Stripe, Sentry, Git, GitHub Actions, Mapbox, Brevo, Zoho</span></div>

</body>
</html>`;

const outPath = "/home/ishaq2321/jobs/morgan-stanley-gcm.pdf";

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
