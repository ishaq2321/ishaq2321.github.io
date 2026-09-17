#!/usr/bin/env node
/**
 * Palette guard.
 *
 * The site is dark only, deliberately: one palette, tuned as a set with the accent
 * and the graded hero portrait. A light theme is not a class away — re-adding one
 * means re-grading the portrait and re-checking every contrast pair, which is exactly
 * the work that made the previous light mode read as a different site.
 *
 * That makes "a light mode came back" a regression worth failing a build over, and it
 * is the kind of regression that hides: it only shows on a machine that prefers light,
 * and only if someone opens the page there. So this checks both halves:
 *
 *   1. the exported files (no html.light block, no light token, no toggle, no boot script)
 *   2. the rendered page, under `prefers-color-scheme: light` and with a stored "light"
 *      preference, at desktop and mobile widths
 *
 * It also asserts the hero actually painted, because a blank page would satisfy every
 * "nothing light here" check while showing a visitor nothing at all.
 *
 * Usage: node scripts/check-palette.mjs      (after `npm run build`)
 * Env:   OUT_DIR (default: out), PALETTE_EVIDENCE (default: palette-guard)
 */
import { createServer } from "node:http";
import { mkdir, readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import puppeteer from "puppeteer";

const OUT = process.env.OUT_DIR || "out";
const EVIDENCE = process.env.PALETTE_EVIDENCE || "palette-guard";

// The values the design was tuned on (app/globals.css). Changing the palette on purpose
// means changing these too, on purpose.
const INK = "rgb(13, 12, 11)"; // --bg
const BONE = "rgb(244, 239, 233)"; // --text

const FORBIDDEN = [
  {
    label: "the light palette block",
    re: /html\.light\s*\{/i,
    why: "app/globals.css declares an html.light palette again",
  },
  {
    label: "the light paper token",
    re: /f6f4ef/i,
    why: "the removed light background (#f6f4ef) is back in the output",
  },
  {
    label: "the theme toggle",
    re: /switch to (light|dark) mode/i,
    why: "something renders a theme toggle again (its aria-label is the tell)",
  },
  {
    label: "the theme boot script",
    re: /localstorage\s*\.\s*getitem\(\s*["']theme["']\s*\)/i,
    why: "a script reads a stored theme again, so the palette can flash",
  },
];

const TEXT_EXT = new Set([
  ".html",
  ".css",
  ".js",
  ".mjs",
  ".json",
  ".txt",
  ".xml",
  ".webmanifest",
  ".svg",
]);

const SCENARIOS = [
  { label: "desktop-dark-os", width: 1440, height: 900, scheme: "dark" },
  { label: "desktop-light-os", width: 1440, height: 900, scheme: "light" },
  {
    label: "desktop-light-os-stored-light",
    width: 1440,
    height: 900,
    scheme: "light",
    storedTheme: "light",
  },
  {
    label: "mobile-light-os-stored-light",
    width: 390,
    height: 844,
    dsf: 2,
    scheme: "light",
    storedTheme: "light",
  },
];

const failures = [];
const notes = [];

// ---------------------------------------------------------------------------
// 1. the exported files
// ---------------------------------------------------------------------------
async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(path)));
    else if (TEXT_EXT.has(extname(entry.name))) found.push(path);
  }
  return found;
}

async function checkFiles() {
  let files;
  try {
    files = await walk(OUT);
  } catch {
    failures.push(`${OUT}/ does not exist — run \`npm run build\` first`);
    return;
  }
  if (files.length === 0) {
    failures.push(`${OUT}/ contains no HTML/CSS/JS to check`);
    return;
  }

  for (const file of files) {
    const body = await readFile(file, "utf8");
    for (const rule of FORBIDDEN) {
      if (rule.re.test(body)) failures.push(`${rule.label} in ${file} — ${rule.why}`);
    }
  }
  notes.push(`scanned ${files.length} exported files for ${FORBIDDEN.length} forbidden patterns`);
}

// ---------------------------------------------------------------------------
// 2. the rendered page
// ---------------------------------------------------------------------------
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
};

function serve(root) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";
    const file = join(root, path);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "content-type": MIME[extname(file)] || "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  return new Promise((resolve) => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function checkRendered(port, heroName) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });
  await mkdir(EVIDENCE, { recursive: true });

  for (const scenario of SCENARIOS) {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("console", (m) => m.type() === "error" && pageErrors.push(m.text()));
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    await page.setViewport({
      width: scenario.width,
      height: scenario.height,
      deviceScaleFactor: scenario.dsf ?? 1,
    });
    if (scenario.scheme) {
      await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scenario.scheme }]);
    }
    if (scenario.storedTheme) {
      await page.evaluateOnNewDocument((t) => {
        try {
          localStorage.setItem("theme", t);
        } catch {
          /* a browser that refuses storage is still expected to render dark */
        }
      }, scenario.storedTheme);
    }

    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((r) => setTimeout(r, 900));

    const seen = await page.evaluate(() => {
      const html = document.documentElement;
      const hero = document.querySelector("h1");
      const style = hero ? getComputedStyle(hero) : null;
      return {
        bodyBg: getComputedStyle(document.body).backgroundColor,
        bodyColor: getComputedStyle(document.body).color,
        colorScheme: getComputedStyle(html).colorScheme,
        htmlClass: html.className,
        toggles: [...document.querySelectorAll("button")].filter((b) =>
          /switch to (light|dark) mode/i.test(b.getAttribute("aria-label") || "")
        ).length,
        heroText: hero ? hero.textContent.replace(/\s+/g, " ").trim() : null,
        heroWidth: hero ? Math.round(hero.getBoundingClientRect().width) : 0,
        heroOpacity: style ? Number(style.opacity) : 0,
      };
    });

    const at = `${scenario.label} (${scenario.width}px${scenario.dsf ? ` @${scenario.dsf}x` : ""}` +
      `${scenario.scheme ? `, prefers-${scenario.scheme}` : ""}` +
      `${scenario.storedTheme ? `, stored "${scenario.storedTheme}"` : ""})`;

    if (seen.bodyBg !== INK) failures.push(`${at}: body background is ${seen.bodyBg}, expected ${INK}`);
    if (seen.bodyColor !== BONE) failures.push(`${at}: body text is ${seen.bodyColor}, expected ${BONE}`);
    if (seen.colorScheme !== "dark") failures.push(`${at}: color-scheme is "${seen.colorScheme}", expected "dark"`);
    if (/\blight\b/.test(seen.htmlClass)) failures.push(`${at}: <html> carries a light class`);
    if (seen.toggles !== 0) failures.push(`${at}: ${seen.toggles} theme toggle(s) rendered`);
    if (pageErrors.length) failures.push(`${at}: console errors — ${pageErrors.slice(0, 3).join(" | ")}`);
    if (!seen.heroText || !seen.heroText.includes(heroName)) {
      failures.push(`${at}: the hero name did not render (saw ${JSON.stringify(seen.heroText)})`);
    }
    if (seen.heroWidth < 80 || seen.heroOpacity < 0.9) {
      failures.push(`${at}: the hero name is not visible (width ${seen.heroWidth}px, opacity ${seen.heroOpacity})`);
    }

    await page.screenshot({ path: join(EVIDENCE, `${scenario.label}.png`) });
    await page.close();
  }

  await browser.close();
  notes.push(`rendered ${SCENARIOS.length} screenshots into ${EVIDENCE}/`);
}

// ---------------------------------------------------------------------------
async function main() {
  let heroName = "";
  try {
    heroName = JSON.parse(await readFile("portfolio.config.json", "utf8")).name || "";
  } catch {
    /* the hero check below reports an empty name plainly */
  }

  await checkFiles();

  let server;
  try {
    server = await serve(OUT);
    await checkRendered(server.address().port, heroName);
  } catch (error) {
    failures.push(`could not render the export: ${error.message}`);
  } finally {
    server?.close();
  }

  for (const note of notes) console.log(`· ${note}`);
  if (failures.length) {
    console.error(`\n✗ palette guard failed (${failures.length}):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    console.error(
      "\nThe site is dark only on purpose. If a light theme is genuinely wanted back,\n" +
        "re-grade the hero portrait and re-check contrast first, then update this guard —\n" +
        "do not delete it."
    );
    process.exit(1);
  }
  console.log("✓ palette guard passed: dark in every colour-scheme state, no toggle, hero painted");
}

main();
