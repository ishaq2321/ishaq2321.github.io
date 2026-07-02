import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));

const edu = config.education;

function link(href, text, subtle) {
  const style = subtle
    ? "color:#333;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:0.5px;text-decoration-color:#999;"
    : "color:#111;text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:0.6px;";
  return `<a href="${href}" style="${style}">${text}</a>`;
}

function prEntry(pr, isLastOrg) {
  return `
  <tr>
    <td style="width:14pt;vertical-align:top;padding-top:3pt;padding-right:6pt;text-align:right;">
      ${link(pr.url, `#${pr.pr_number}`, true)}
    </td>
    <td style="vertical-align:top;padding-top:3pt;font-size:8pt;line-height:1.28;${isLastOrg ? 'padding-bottom:6pt;' : ''}">
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
  if (proj.live) links.push(link(proj.live, "live", true));
  links.push(link(proj.url, "repo", true));
  if (proj.npm) links.push(link(`https://www.npmjs.com/package/${proj.npm}`, "npm", true));
  return `
  <tr>
    <td style="width:4pt;vertical-align:top;padding-top:2pt;">&#8226;</td>
    <td style="vertical-align:top;padding-top:2pt;font-size:8pt;line-height:1.25;">
      <span style="font-weight:600;">${proj.name}</span>
      <span style="font-size:7pt;margin-left:4pt;">${links.join(" &middot; ")}</span>
      &mdash; <span style="color:#444;">${proj.description.length > 160 ? proj.description.slice(0, 157) + "..." : proj.description}</span>
    </td>
  </tr>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${config.name} — Resume</title>
<style>
  @page { size: letter; margin: 0.4in 0.45in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #111;
    font-size: 8.5pt;
    line-height: 1.3;
  }
  a { text-decoration: none; }
  h2 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 10pt; font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.4pt; color: #111;
    border-bottom: 0.8pt solid #222;
    padding-bottom: 1.5pt; margin: 9pt 0 4pt 0;
  }
  header { text-align: center; margin-bottom: 9pt; }
  header h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15pt; font-weight: 700;
    letter-spacing: 0.5pt;
    margin-bottom: 3pt;
  }
  header .contact { font-size: 7.5pt; }
  header .contact a { margin: 0 4pt; }
  .icon-link {
    display: inline-flex; align-items: center; gap: 2pt;
    border: 0.5pt solid #999; border-radius: 3pt;
    padding: 0.5pt 4pt;
    font-size: 7pt; color: #333;
  }
  .profile { font-size: 8pt; line-height: 1.32; margin-bottom: 0pt; }
  .entry { margin-bottom: 6pt; }
  .entry-title { display: flex; justify-content: space-between; align-items: baseline; }
  .entry-title .role { font-weight: 600; font-size: 8.5pt; }
  .entry-title .period { font-size: 7.5pt; color: #444; }
  .entry-org { font-size: 8pt; font-style: italic; }
  .entry-desc { font-size: 8pt; margin-top: 1pt; line-height: 1.28; }
  .entry-points { margin-top: 2pt; margin-left: 10pt; }
  .entry-points li { font-size: 7.8pt; line-height: 1.28; margin-bottom: 0.5pt; }
  .skills-cat { margin-bottom: 1.5pt; line-height: 1.25; }
  .skills-cat strong { font-size: 8pt; font-family: Georgia, serif; font-weight: 600; }
  .skills-cat span { font-size: 7.5pt; }
</style>
</head>
<body>

<header>
  <h1>${config.name}</h1>
  <p class="contact">
    <a href="https://ishaq2321.github.io" class="icon-link" style="text-decoration:none;">
      <span style="font-weight:700;">&#9741;</span> Portfolio
    </a>
    <a href="https://github.com/ishaq2321" class="icon-link" style="text-decoration:none;">
      <span style="font-weight:700;font-family:monospace;">&#10209;</span> GitHub
    </a>
    <a href="https://linkedin.com/in/2321ishaq" class="icon-link" style="text-decoration:none;">
      <span style="font-weight:700;">&#9654;</span> LinkedIn
    </a>
    <a href="mailto:${config.email}" class="icon-link" style="text-decoration:none;">
      <span style="font-weight:700;">@</span> Email
    </a>
    <span style="margin-left:8pt;color:#555;">${config.location}</span>
  </p>
</header>

<h2>Profile</h2>
<p class="profile">
  Computer Science graduate from ELTE, Budapest. Founded <strong>backbencher.cc</strong>, an AST-native code intelligence platform with 13 brain tools. Contributed to <strong>Microsoft VS Code</strong> (3 merged PRs) and <strong>Flutter</strong> (2 PRs, 1 approved). Built <strong>ProxiCall</strong>, a production super-app with Stripe payments and 32-language translation. BSc thesis on ML-based phishing detection achieved 96.45% accuracy with 725 automated tests.
</p>

<h2>Education</h2>
<div class="entry">
  <div class="entry-title">
    <span class="role">${edu.degree} &mdash; ${edu.university}</span>
    <span class="period">${edu.period}</span>
  </div>
  <p class="entry-desc">
    ${edu.faculty}. ${edu.scholarship ? edu.scholarship + "." : ""}
    <br/>Selected for BSc Computer Science at <strong>Tsinghua University</strong> (world #1 in CS, US News) with full scholarship.
  </p>
</div>

<h2>Experience</h2>

<div class="entry">
  <div class="entry-title">
    <span class="role">Founder & Developer</span>
    <span class="period">March 2026 &ndash; Present</span>
  </div>
  <p class="entry-org">backbencher.cc</p>
  <p class="entry-desc">
    Building an open-core AST-native code intelligence platform that indexes codebases into a SQLite knowledge graph. Ships with 13 brain tools for semantic search, call-graph traversal, AST-precise refactoring, architecture detection, cross-language migration planning, and security scanning across 39 languages.
  </p>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Full-Stack Developer</span>
    <span class="period">September 2025 &ndash; Present</span>
  </div>
  <p class="entry-org">ProxiCall</p>
  <p class="entry-desc">
    Production Flutter super-app: Stripe Connect payments, geo-fenced content delivery, 32-language auto-translation pipeline, and AI-segmented notifications. Built five integrated systems: Content Management, Payment Management, Order Management, Notification Management, and Entity Notification System.
  </p>
</div>

<div class="entry">
  <div class="entry-title">
    <span class="role">Security Engineer</span>
    <span class="period">April 2020 &ndash; May 2025</span>
  </div>
  <p class="entry-desc">
    Offensive security and privacy-preserving technology across multiple independent engagements.
  </p>
  <ul class="entry-points">
    <li>DNS spoofing attack simulation and network-layer prevention techniques</li>
    <li>MITM attack execution, traffic analysis, and defense hardening</li>
    <li>Cross-site scripting (XSS) exploitation, payload crafting, and input sanitization</li>
    <li>Wireless network penetration: WPA/WPA2 cracking, deauthentication, rogue AP deployment</li>
    <li>OSINT reconnaissance: passive and active information gathering via social media, Shodan, WHOIS</li>
    <li>Privacy-preserving communication: PGP/GPG encryption, Tails OS, OnionShare, SecureDrop</li>
    <li>Vulnerability scanning: SQLi, XSS, and secrets detection across web applications</li>
  </ul>
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
<div class="skills-cat"><strong>AI &amp; Models</strong> <span>${config.skills.ai_ml.slice(8, 22).join(", ")}</span></div>
<div class="skills-cat"><strong>Tools &amp; Platforms</strong> <span>${config.skills.tools.slice(0, 8).join(", ")} &middot; ${config.skills.platforms.slice(0, 8).join(", ")}</span></div>

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
    margin: { top: "0.4in", bottom: "0.4in", left: "0.45in", right: "0.45in" },
    scale: 0.91,
  });
  await browser.close();
  console.log("Resume → public/resume.pdf");
}

main().catch((err) => {
  console.error("Failed to generate resume:", err.message);
  process.exit(1);
});
