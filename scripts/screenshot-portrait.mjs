import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, existsSync, mkdirSync } from "fs";
import { join, extname } from "path";

// Captures the hero portrait card in dark + light themes so you can compare
// your AnimatedPortrait params side-by-side with a reference photo.
//
// Usage:
//   npm run build && node scripts/screenshot-portrait.mjs [outDir]

const outDir = process.argv[2] ?? "portrait-preview";
mkdirSync(outDir, { recursive: true });

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

const server = createServer((req, res) => {
  let path = req.url.split("?")[0];
  if (path === "/") path = "/index.html";
  const file = join("out", path);
  if (existsSync(file)) {
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  } else {
    res.writeHead(404);
    res.end("not found");
  }
});

await new Promise((resolve) => server.listen(4173, resolve));
console.log("Serving out/ on http://localhost:4173");

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto("http://localhost:4173/", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2500));

const card = await page.$("header .relative.h-56");
if (!card) {
  console.error("Portrait card not found — is portrait.enabled true and viewport >= lg?");
} else {
  await card.screenshot({ path: join(outDir, "portrait-dark.png") });
  console.log(`Saved ${outDir}/portrait-dark.png`);
}

await page.evaluate(() => localStorage.setItem("theme", "light"));
await page.reload({ waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 2500));
const cardLight = await page.$("header .relative.h-56");
if (cardLight) {
  await cardLight.screenshot({ path: join(outDir, "portrait-light.png") });
  console.log(`Saved ${outDir}/portrait-light.png`);
}

await browser.close();
server.close();
console.log(`Done — compare ${outDir}/portrait-*.png with your reference photo,`);
console.log("tune the `portrait` block in portfolio.config.json, rebuild, re-run.");
