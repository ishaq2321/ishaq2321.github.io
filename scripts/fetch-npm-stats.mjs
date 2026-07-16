import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(
  readFileSync(join(__dirname, "..", "portfolio.config.json"), "utf-8"),
);

// Collect every npm package name declared on a project.
const packages = config.projects
  .map((p) => p.npm)
  .filter((name) => typeof name === "string" && name.length > 0);

async function fetchPackage(name) {
  const today = new Date().toISOString().slice(0, 10);
  const [weeklyRes, totalRes] = await Promise.all([
    fetch(`https://api.npmjs.org/downloads/point/last-week/${name}`),
    fetch(`https://api.npmjs.org/downloads/range/2000-01-01:${today}/${name}`),
  ]);

  const weeklyData = weeklyRes.ok ? await weeklyRes.json() : {};
  const totalData = totalRes.ok ? await totalRes.json() : {};

  const total = Array.isArray(totalData.downloads)
    ? totalData.downloads.reduce((sum, d) => sum + (d.downloads ?? 0), 0)
    : 0;

  return { weekly: weeklyData.downloads ?? 0, total };
}

async function main() {
  const stats = {};

  await Promise.all(
    packages.map(async (name) => {
      try {
        stats[name] = await fetchPackage(name);
      } catch (err) {
        console.warn(`  npm stats for ${name} unavailable: ${err.message}`);
        stats[name] = { weekly: 0, total: 0 };
      }
    }),
  );

  const payload = { packages: stats, updatedAt: new Date().toISOString() };
  writeFileSync(
    join(__dirname, "..", "public", "npm-stats.json"),
    JSON.stringify(payload, null, 2),
  );
  console.log(
    `npm stats → public/npm-stats.json (${Object.keys(stats).length} package${
      Object.keys(stats).length === 1 ? "" : "s"
    })`,
  );
}

main().catch((err) => {
  console.error("Failed to fetch npm stats:", err.message);
  // Non-fatal: write an empty payload so the build still succeeds offline.
  writeFileSync(
    join(__dirname, "..", "public", "npm-stats.json"),
    JSON.stringify({ packages: {}, updatedAt: new Date().toISOString() }, null, 2),
  );
});
