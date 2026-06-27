import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"));

function pill(skills) {
  return skills
    .map((s) => `<span style="display:inline-block;padding:2px 7px;margin:1px 3px 1px 0;font-size:8pt;border-radius:10px;color:#3f3f46;background:#f4f4f5;border:1px solid #e4e4e7;">${s}</span>`)
    .join("");
}

function experienceEntry(exp) {
  const org = exp.organization ? `<span style="color:#3b82f6;font-size:9pt;">${exp.organization}</span> &mdash; ` : "";
  return `
  <div style="margin-bottom:10pt;">
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <span style="font-weight:600;font-size:10pt;">${exp.role}</span>
      <span style="font-size:8pt;color:#71717a;">${exp.period}</span>
    </div>
    <p style="margin:2pt 0 0 0;font-size:9pt;color:#52525b;">${org}${exp.description}</p>
    <div style="margin-top:3pt;">${pill(exp.skills)}</div>
  </div>`;
}

function projectEntry(proj) {
  const links = [];
  if (proj.live) links.push(`<a href="${proj.live}" style="color:#3b82f6;text-decoration:none;font-size:8pt;">live</a>`);
  links.push(`<a href="${proj.url}" style="color:#3b82f6;text-decoration:none;font-size:8pt;">repo</a>`);
  const linkStr = links.join(" &middot; ");

  return `
  <div style="margin-bottom:10pt;">
    <div style="display:flex;justify-content:space-between;align-items:baseline;">
      <span>
        <span style="font-weight:600;font-size:10pt;">${proj.name}</span>
        <span style="font-size:8pt;color:#71717a;margin-left:6pt;">${linkStr}</span>
      </span>
    </div>
    <p style="margin:2pt 0 0 0;font-size:9pt;color:#52525b;">${proj.description}</p>
    <div style="margin-top:3pt;">${pill(proj.stack)}</div>
  </div>`;
}

function prEntry(pr) {
  return `
  <div style="margin-bottom:6pt;font-size:9pt;line-height:1.45;">
    &bull;&nbsp;
    <a href="${pr.url}" style="color:#3b82f6;text-decoration:none;">${pr.repo}#${pr.pr_number}</a>
    &mdash; ${pr.description}
  </div>`;
}

const edu = config.education;
const eduExtra = [
  edu.faculty,
  `Thesis: ${edu.thesis}`,
  edu.scholarship,
].filter(Boolean).join(" &middot; ");

const achievement = edu.achievements?.[0]
  ? `<p style="font-size:9pt;color:#52525b;margin-top:1pt;">&#127942; ${edu.achievements[0]}</p>`
  : "";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${config.name} — Resume</title>
<style>
  @page { size: letter; margin: 0.55in 0.6in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #18181b;
    font-size: 10pt;
    line-height: 1.35;
  }
  a { color: #3b82f6; text-decoration: none; }
  h2 {
    font-size: 10pt; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.8pt; color: #18181b;
    border-bottom: 1.5px solid #3b82f6;
    padding-bottom: 2pt; margin: 14pt 0 6pt 0;
  }
  header { text-align: center; margin-bottom: 14pt; }
  header h1 { font-size: 22pt; font-weight: 700; letter-spacing: -0.5pt; }
  header p { font-size: 9pt; color: #52525b; margin-top: 3pt; }
  header .links { margin-top: 4pt; font-size: 9pt; }
  header .links a { margin: 0 6pt; }
  .two-col { display: flex; gap: 14pt; }
  .two-col > div { flex: 1; }
</style>
</head>
<body>

<header>
  <h1>${config.name}</h1>
  <p>${config.location}</p>
  <p class="links">
    <a href="https://ishaq2321.github.io">ishaq2321.github.io</a> &middot;
    <a href="mailto:${config.email}">${config.email}</a> &middot;
    <a href="${config.social.github}">github</a> &middot;
    <a href="${config.social.linkedin}">linkedin</a>
  </p>
</header>

<h2>Education</h2>
<div style="display:flex;justify-content:space-between;align-items:baseline;">
  <span style="font-weight:600;font-size:10pt;">${edu.degree} &mdash; ${edu.university}</span>
  <span style="font-size:8pt;color:#71717a;">${edu.period}</span>
</div>
<p style="font-size:9pt;color:#52525b;margin-top:1pt;">${eduExtra}</p>
${achievement}

<h2>Experience</h2>
${config.experience.map(experienceEntry).join("")}

<h2>Projects</h2>
${config.projects.filter((p) => p.featured).map(projectEntry).join("")}

<h2>Open Source</h2>
${config.notable_contributions.map(prEntry).join("")}

<h2>Skills</h2>
<div class="two-col">
  <div>
    <p style="font-weight:600;font-size:9pt;margin-bottom:4pt;">Languages</p>
    ${pill(config.skills.languages.slice(0, 8))}
    <p style="font-weight:600;font-size:9pt;margin:7pt 0 4pt 0;">Frameworks</p>
    ${pill(config.skills.frameworks)}
    <p style="font-weight:600;font-size:9pt;margin:7pt 0 4pt 0;">Platforms</p>
    ${pill(config.skills.platforms.slice(0, 6))}
  </div>
  <div>
    <p style="font-weight:600;font-size:9pt;margin-bottom:4pt;">AI / ML</p>
    ${pill(config.skills.ai_ml.slice(0, 8))}
    <p style="font-weight:600;font-size:9pt;margin:7pt 0 4pt 0;">Security</p>
    ${pill(config.skills.security.slice(0, 10))}
    <p style="font-weight:600;font-size:9pt;margin:7pt 0 4pt 0;">Tools</p>
    ${pill(config.skills.tools.slice(0, 6))}
  </div>
</div>

</body>
</html>`;

const outPath = join(__dirname, "..", "public", "resume.pdf");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({
    path: outPath,
    format: "letter",
    printBackground: true,
    margin: { top: "0.55in", bottom: "0.55in", left: "0.6in", right: "0.6in" },
    scale: 0.94,
  });
  await browser.close();
  console.log(`Resume → public/resume.pdf`);
}

main().catch((err) => {
  console.error("Failed to generate resume:", err.message);
  process.exit(1);
});
