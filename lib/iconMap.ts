/**
 * Maps skill names to their Simple Icons slug for displaying official brand icons.
 * Icons are loaded from https://cdn.simpleicons.org/ via <img>.
 * Skills without a mapping (null) show text-only pills.
 */
export const skillIcons: Record<string, string | null> = {
  // ── Languages ──
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  Dart: "dart",
  "C++": "cplusplus",
  "Shell/Bash": "gnubash",
  PowerShell: "powershell",
  SQL: "sqlite",
  "HTML/CSS": "html5",
  Go: "go",
  Rust: "rust",
  Java: "openjdk",
  Kotlin: "kotlin",

  // ── Frameworks ──
  Flutter: "flutter",
  "Next.js": "nextdotjs",
  React: "react",
  "Node.js": "nodedotjs",
  Express: "express",
  "Tailwind CSS": "tailwindcss",
  "Flutter Bloc": null,
  tRPC: "trpc",

  // ── Mobile ──
  Android: "android",
  "Firebase SDK (Auth, Firestore, Storage, Functions, Messaging)": "firebase",
  "Google Sign-In": "google",
  "Stripe Connect": "stripe",
  Geolocator: null,
  "Push Notifications": null,

  // ── AI / ML ──
  XGBoost: null,
  "scikit-learn": "scikitlearn",
  NLP: null,
  SHAP: null,
  "OSINT enrichment": null,
  "Word Embeddings": null,
  "Tree-sitter AST": "tree-sitter",
  "Semantic Search": null,
  "OpenAI API": "openai",
  "Google AI Studio": "googlegemini",
  Mistral: "mistral",
  Cohere: "cohere",

  // ── Security ──
  "Aircrack-ng": null,
  Amass: null,
  Bettercap: null,
  "BLE recon": null,
  "Command injection hardening": null,
  "DNS spoofing": null,
  "Kali Linux": "kalilinux",
  Metasploit: "metasploit",
  Nessus: null,
  Nmap: "nmap",
  OnionShare: "onionshare",
  "Parrot Security": null,
  "PGP/GPG": "gnupg",
  Phishing: null,
  "recon-ng": null,
  SecureDrop: "securedrop",
  SpiderFoot: null,
  "Tails OS": "tails",
  "Vulnerability scanning (SQLi, XSS, secrets)": null,
  Wireshark: "wireshark",

  // ── Platforms ──
  Supabase: "supabase",
  Firebase: "firebase",
  Stripe: "stripe",
  Docker: "docker",
  "GitHub Actions": "githubactions",
  "SST (Serverless Stack)": null,
  SQLite: "sqlite",
  PostgreSQL: "postgresql",
  Sentry: "sentry",
  Vercel: "vercel",
  Netlify: "netlify",

  // ── Operating Systems ──
  Linux: "linux",
  macOS: "apple",
  Windows: "windows",

  // ── Tools ──
  Git: "git",
  "VS Code": "vscode",
  Bun: "bun",
  "npm/pnpm": "npm",
  "Tree-sitter": "tree-sitter",
  LSP: null,
  MCP: null,
  "curl/jq": "curl",
};
