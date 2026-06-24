import { writeFileSync } from "fs";

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github.v3+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const [userRes, reposRes, prsRes] = await Promise.all([
    fetch("https://api.github.com/users/ishaq2321", { headers }),
    fetch("https://api.github.com/users/ishaq2321/repos?per_page=100", { headers }),
    fetch("https://api.github.com/search/issues?q=author:ishaq2321+type:pr+is:merged&per_page=1", { headers }),
  ]);

  if (!userRes.ok) throw new Error(`GitHub user: ${userRes.status}`);
  if (!reposRes.ok) throw new Error(`GitHub repos: ${reposRes.status}`);

  const user = await userRes.json();
  const repos = await reposRes.json();
  const prs = prsRes.ok ? await prsRes.json() : { total_count: 0 };

  const totalStars = repos
    .filter((r) => !r.fork)
    .reduce((sum, r) => sum + r.stargazers_count, 0);

  const stats = {
    repos: user.public_repos,
    followers: user.followers,
    stars: totalStars,
    prs: prs.total_count,
    updatedAt: new Date().toISOString(),
  };

  writeFileSync("public/github-stats.json", JSON.stringify(stats, null, 2));
  console.log(`GitHub stats → public/github-stats.json (${stats.repos} repos, ${stats.stars} stars, ${stats.prs} PRs)`);
}

main().catch((err) => {
  console.error("Failed to fetch GitHub stats:", err.message);
  process.exit(1);
});
