import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"),
);

const [firstName, ...rest] = config.name.split(" ");
const lastName = rest.pop() ?? "";
const middle = rest.join(" ");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #0d0c0b;
    color: #f4efe9;
    font-family: Georgia, "Times New Roman", serif;
    padding: 72px 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .glow {
    position: absolute; top: -180px; left: 320px;
    width: 820px; height: 520px;
    background: #e2523b; opacity: 0.16; filter: blur(120px);
    border-radius: 9999px;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(#ffffff08 1px, transparent 1px),
      linear-gradient(90deg, #ffffff08 1px, transparent 1px);
    background-size: 64px 64px;
    -webkit-mask-image: radial-gradient(ellipse 120% 80% at 50% 0%, #000 30%, transparent 80%);
  }
  .rail { display: flex; align-items: center; gap: 20px; position: relative; }
  .logo {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; background: #e2523b; border-radius: 4px;
    color: #fff; font-size: 26px; font-weight: 700;
    font-family: "JetBrains Mono", monospace;
  }
  .kicker {
    font-family: "JetBrains Mono", monospace; font-size: 22px;
    letter-spacing: 4px; color: #f0836f; text-transform: uppercase;
  }
  .name { font-size: 92px; line-height: 0.98; letter-spacing: -2px; position: relative; }
  .name .last { font-style: italic; color: #f0836f; }
  .sub {
    margin-top: 30px; font-family: "JetBrains Mono", monospace;
    font-size: 25px; color: #b8afa4; max-width: 920px; line-height: 1.45;
  }
  .foot {
    display: flex; align-items: center; gap: 24px; position: relative;
    font-family: "JetBrains Mono", monospace; font-size: 22px; color: #7c736a;
  }
  .foot .divider { width: 40px; height: 1px; background: #3a352f; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="grid"></div>

  <div class="rail">
    <div class="logo">i</div>
    <div class="kicker">Portfolio / 2026</div>
  </div>

  <div>
    <div class="name">${firstName} ${middle} <span class="last">${lastName}</span></div>
    <div class="sub">Software engineer · Builder of ProxiCall &amp; backbencher.cc · Contributor to VS Code &amp; Flutter</div>
  </div>

  <div class="foot">
    <span>ishaq2321.github.io</span>
    <span class="divider"></span>
    <span>CS · ELTE, Budapest</span>
  </div>
</body>
</html>`;

const outPath = join(__dirname, "..", "public", "og.png");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load", timeout: 10000 });
  await page.screenshot({ path: outPath, type: "png" });
  await browser.close();
  console.log("OG image → public/og.png (1200×630)");
}

main().catch((err) => {
  console.error("Failed to generate OG image:", err.message);
  process.exit(1);
});
