import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));

const edu = config.education;

function link(href, text) {
  return `<a href="${href}" style="color:#3b82f6;text-decoration:none;">${text}</a>`;
}

function prEntry(pr, isLastOrg) {
  return `
  <tr>
    <td style="width:14pt;vertical-align:top;padding-top:2pt;padding-right:6pt;text-align:right;">
      ${link(pr.url, `#${pr.pr_number}`)}
    </td>
    <td style="vertical-align:top;padding-top:2pt;font-size:8pt;line-height:1.3;${isLastOrg ? 'padding-bottom:6pt;' : ''}">
      ${pr.description}
    </td>
  </tr>`;
}

function orgBlock(orgName, prs) {
  return `
  <div style="margin-bottom:1pt;">
    <span style="font-weight:600;font-size:8.5pt;">${orgName}</span>
    <table style="border-collapse:collapse;width:100%;margin-top:0.5pt;">
      ${prs.map((pr, i) => prEntry(pr, i === prs.length - 1)).join("")}
    </table>
  </div>`;
}

const msftPRs = config.notable_contributions.filter((p) => p.repo === "microsoft/vscode");
const flutterPRs = config.notable_contributions.filter((p) => p.repo === "flutter/flutter");

function projectLine(proj) {
  const links = [];
  if (proj.live) links.push(link(proj.live, "site"));
  links.push(link(proj.url, "repo"));
  if (proj.npm) links.push(link(`https://www.npmjs.com/package/${proj.npm}`, "npm"));
  if (proj.benchmarkUrl) links.push(link(proj.benchmarkUrl, "benchmark"));

  const desc = proj.description.length > 140
    ? proj.description.slice(0, 137) + "..."
    : proj.description;

  return `
  <tr>
    <td style="width:4pt;vertical-align:top;padding-top:2pt;">&#8226;</td>
    <td style="vertical-align:top;padding-top:2pt;font-size:8pt;line-height:1.3;">
      <span style="font-weight:600;">${proj.name}</span>
      ${links.length ? `<span style="font-size:7pt;color:#3b82f6;"> [${links.join(" &middot; ")}]</span>` : ""}
      <br/><span style="font-size:7.5pt;color:#444;">${desc}</span>
    </td>
  </tr>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${config.name} — Resume</title>
<style>
  @page { size: letter; margin: 0.38in 0.42in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #111;
    font-size: 8.5pt;
    line-height: 1.32;
  }
  a { text-decoration: none; }
  h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 10pt; font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4pt; color: #111;
    border-bottom: 0.8pt solid #222;
    padding-bottom: 1.5pt; margin: 8pt 0 3pt 0;
  }
  header { text-align: center; margin-bottom: 8pt; }
  header h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15pt; font-weight: 700; letter-spacing: 0.5pt;
    margin-bottom: 3pt;
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
  .skills-cat { margin-bottom: 1.5pt; line-height: 1.25; }
  .skills-cat strong { font-size: 8pt; font-family: Georgia, serif; font-weight: 600; }
  .skills-cat span { font-size: 7.5pt; }
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
  Computer Science graduate from ELTE, Budapest. Founded <strong>backbencher.cc</strong>, an AST-native code intelligence platform shipping 13 brain tools for semantic search, call-graph traversal, AST-precise refactoring, and security scanning across 39 languages. Contributed to <strong>Microsoft VS Code</strong> (3 fixes merged) and <strong>Flutter</strong> (security hardening and gesture engine fix). Built <strong>ProxiCall</strong>, a production super-app with Stripe Connect payments and 32-language translation. BSc thesis on ML-based phishing detection achieved 96.45% accuracy across 725 automated tests.
</p>

<h2>Education</h2>
<div class="entry">
  <div class="entry-title">
    <span class="role">${edu.degree} &mdash; ${edu.university}</span>
    <span class="period">${edu.period}</span>
  </div>
  <p class="entry-desc">
    ${edu.faculty}. ${edu.scholarship ? edu.scholarship + ". " : ""}Selected for <strong>Tsinghua University</strong> (world #1 in CS, US News) with full scholarship.
  </p>
</div>

<h2>Experience</h2>

<div class="entry">
  <div class="entry-title">
    <span class="role">Founder &amp; Developer</span>
    <span class="period">March 2026 &ndash; Present</span>
  </div>
  <p class="entry-org">backbencher.cc</p>
  <p class="entry-desc">
    Building an open-core code intelligence platform that indexes codebases into a SQLite knowledge graph. Ships 13 brain tools (bb_search, bb_select, bb_refactor, bb_security, bb_migrate, bb_relationships, and more). Benchmarked against TypeScript and Roslyn codebases.
  </p>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Full-Stack Developer</span>
    <span class="period">September 2025 &ndash; Present</span>
  </div>
  <p class="entry-org">ProxiCall</p>
  <p class="entry-desc">
    Production Flutter super-app: Stripe Connect payment management, geo-fenced content delivery, 32-language auto-translation, and AI-segmented push notifications. Five integrated systems: CMS, PMS, OMS, NMS, ENS.
  </p>
</div>

<h2>Open Source Contributions</h2>
${orgBlock("Microsoft (VS Code)", msftPRs)}
${orgBlock("Flutter", flutterPRs)}

<h2>Projects</h2>
<table style="border-collapse:collapse;width:100%;">
  ${config.projects.slice(0, 6).map(projectLine).join("")}
</table>

<h2>Technical Skills</h2>
<div class="skills-cat"><strong>Languages</strong> <span>${config.skills.languages.join(", ")}</span></div>
<div class="skills-cat"><strong>Frameworks</strong> <span>${config.skills.frameworks.join(", ")}</span></div>
<div class="skills-cat"><strong>AI &amp; Models</strong> <span>${config.skills.ai_ml.slice(8, 23).join(", ")}</span></div>
<div class="skills-cat"><strong>Tools &amp; Platforms</strong> <span>${config.skills.tools.slice(0, 8).join(", ")} &middot; ${config.skills.platforms.join(", ")}</span></div>

</body>
</html>`;

const outPath = join(__dirname, "..", "public", "resume.pdf");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load", timeout: 10000 });
  await page.pdf({
    path: outPath,
    format: "letter",
    printBackground: true,
    margin: { top: "0.38in", bottom: "0.38in", left: "0.42in", right: "0.42in" },
    scale: 0.91,
  });
  await browser.close();
  console.log("Resume -> public/resume.pdf");
}

main().catch((err) => {
  console.error("Failed to generate resume:", err.message);
  process.exit(1);
});
