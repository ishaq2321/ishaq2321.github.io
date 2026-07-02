import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));

const edu = config.education;

function link(href, text) {
  return `<a href="${href}" style="color:#000;text-decoration:none;">${text}</a>`;
}

function prEntry(pr, isLastOrg) {
  const orgMap = { "microsoft/vscode": "Microsoft (VS Code)", "flutter/flutter": "Flutter" };
  const org = orgMap[pr.repo] || pr.repo.split("/")[0];

  return `
  <tr>
    <td style="width:14pt;vertical-align:top;padding-top:4pt;padding-right:6pt;text-align:right;">
      ${link(pr.url, `#${pr.pr_number}`)}
    </td>
    <td style="vertical-align:top;padding-top:4pt;font-size:9pt;line-height:1.35;${isLastOrg ? 'padding-bottom:8pt;' : ''}">
      ${pr.description}
    </td>
  </tr>`;
}

function orgBlock(orgName, prs) {
  return `
  <div style="margin-bottom:2pt;">
    <span style="font-weight:600;font-size:9.5pt;">${orgName}</span>
    <table style="border-collapse:collapse;width:100%;margin-top:1pt;">
      ${prs.map((pr, i) => prEntry(pr, i === prs.length - 1)).join("")}
    </table>
  </div>`;
}

const msftPRs = config.notable_contributions.filter((p) => p.repo === "microsoft/vscode");
const flutterPRs = config.notable_contributions.filter((p) => p.repo === "flutter/flutter");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${config.name} — Resume</title>
<style>
  @page { size: letter; margin: 0.35in 0.42in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #111;
    font-size: 8.5pt;
    line-height: 1.3;
  }
  a { color: #111; text-decoration: none; }
  h2 {
    font-size: 8.5pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.4pt; color: #111;
    border-bottom: 0.6pt solid #111;
    padding-bottom: 1pt; margin: 8pt 0 3pt 0;
  }
  header { text-align: center; margin-bottom: 8pt; }
  header h1 { font-size: 14pt; font-weight: 700; letter-spacing: 0.3pt; }
  header .contact { margin-top: 2pt; font-size: 8pt; }
  header .contact a { margin: 0 6pt; }
  .profile { font-size: 8pt; line-height: 1.3; margin-bottom: 0pt; }
  .entry { margin-bottom: 6pt; }
  .entry-title { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title .role { font-weight: 600; font-size: 8.5pt; }
  .entry-title .period { font-size: 7.5pt; }
  .entry-org { font-size: 8pt; font-style: italic; }
  .entry-desc { font-size: 8pt; margin-top: 1pt; line-height: 1.28; }
  .skills-cat { margin-bottom: 1.5pt; line-height: 1.25; }
  .skills-cat strong { font-size: 8pt; }
  .skills-cat span { font-size: 7.5pt; }
</style>
</head>
<body>

<header>
  <h1>${config.name}</h1>
  <p class="contact">
    ${link(`https://ishaq2321.github.io`, "ishaq2321.github.io")}
    ${link("https://github.com/ishaq2321", "github.com/ishaq2321")}
    ${link("https://linkedin.com/in/2321ishaq", "linkedin.com/in/2321ishaq")}
    ${link(`mailto:${config.email}`, config.email)}
  </p>
</header>

<h2>Profile</h2>
<p class="profile">
  Computer Science graduate from ELTE, Budapest. Founder of backbencher.cc &mdash; an AST-native code intelligence platform with 13 brain tools. Open-source contributor to Microsoft VS Code (3 merged PRs) and Flutter (2 merged/approved PRs). Builder of ProxiCall, a production super-app with Stripe payments and 32-language translation. Thesis on ML-based phishing detection (96.45% accuracy). Selected for Tsinghua University (world #1 CS, US News) with full scholarship.
</p>

<h2>Education</h2>
<div class="entry">
  <div class="entry-title">
    <span class="role">${edu.degree} &mdash; ${edu.university}</span>
    <span class="period">${edu.period}</span>
  </div>
  <p class="entry-desc">
    ${edu.faculty}. Thesis: ${edu.thesis} (96.45% accuracy, 99.41% AUC-ROC, 725 automated tests).
    ${edu.scholarship ? edu.scholarship + "." : ""}
    ${edu.achievements?.length ? edu.achievements[0] + "." : ""}
  </p>
</div>

<h2>Experience</h2>
${config.experience.map((exp) => `
  <div class="entry">
    <div class="entry-title">
      <span class="role">${exp.role}</span>
      <span class="period">${exp.period}</span>
    </div>
    ${exp.organization ? `<p class="entry-org">${exp.organization}</p>` : ""}
    <p class="entry-desc">${exp.description}</p>
  </div>
`).join("")}

<h2>Open Source Contributions</h2>
${orgBlock("Microsoft (VS Code)", msftPRs)}
${orgBlock("Flutter", flutterPRs)}

<h2>Projects</h2>
${config.projects.slice(0, 3).map((proj) => {
  const links = [];
  if (proj.live) links.push(link(proj.live, "live"));
  links.push(link(proj.url, "repo"));
  if (proj.npm) links.push(link(`https://www.npmjs.com/package/${proj.npm}`, "npm"));
  return `
  <div class="entry">
    <div class="entry-title">
      <span class="role">${proj.name} &mdash; <span style="font-weight:400;font-size:8.5pt;">${links.join(" &middot; ")}</span></span>
    </div>
    <p class="entry-desc">${proj.description}</p>
  </div>`;
}).join("")}

<h2>Skills</h2>
<div class="skills-cat"><strong>Languages:</strong> <span>${config.skills.languages.slice(0, 8).join(", ")}</span></div>
<div class="skills-cat"><strong>Frameworks:</strong> <span>${config.skills.frameworks.join(", ")}</span></div>
<div class="skills-cat"><strong>AI / ML &amp; Models:</strong> <span>${config.skills.ai_ml.slice(8, 22).join(", ")}</span></div>
<div class="skills-cat"><strong>Security:</strong> <span>${config.skills.security.slice(0, 8).join(", ")}</span></div>
<div class="skills-cat"><strong>Tools &amp; Platforms:</strong> <span>${config.skills.tools.slice(0, 6).join(", ")} &middot; ${config.skills.platforms.slice(0, 6).join(", ")}</span></div>

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
    margin: { top: "0.35in", bottom: "0.35in", left: "0.42in", right: "0.42in" },
    scale: 0.91,
  });
  await browser.close();
  console.log("Resume → public/resume.pdf");
}

main().catch((err) => {
  console.error("Failed to generate resume:", err.message);
  process.exit(1);
});
