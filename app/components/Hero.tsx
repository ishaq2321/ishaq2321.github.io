import { config } from "@/lib/config";

export function Hero() {
  return (
    <header className="section-container flex min-h-[90vh] flex-col justify-center pb-10">
      <p className="mb-4 font-mono text-sm text-accent">Hi, I&apos;m</p>
      <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl">
        {config.name}
      </h1>
      <p className="mb-8 max-w-xl text-xl leading-relaxed text-zinc-400">
        {config.tagline}
      </p>
      <p className="mb-10 font-mono text-sm text-zinc-500">{config.location}</p>
      <div className="flex gap-4">
        <a
          href={config.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
        >
          GitHub
        </a>
        <a
          href={`mailto:${config.email}`}
          className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
