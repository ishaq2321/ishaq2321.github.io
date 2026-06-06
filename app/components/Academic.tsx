import { config } from "@/lib/config";

export function Academic() {
  return (
    <section className="section-container" id="education">
      <h2 className="section-title">Education</h2>
      <div className="card max-w-2xl">
        <h3 className="text-xl font-semibold">
          {config.education.degree}
        </h3>
        <p className="mt-1 font-mono text-sm text-accent">
          {config.education.university}
        </p>
        <p className="text-sm text-zinc-400">{config.education.faculty}</p>
        <p className="mt-1 inline-block rounded-full bg-accent/10 px-2.5 py-0.5 font-mono text-xs text-accent">
          {config.education.status}
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
              Thesis
            </p>
            <p className="text-sm text-zinc-300">{config.education.thesis}</p>
          </div>
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-wider text-zinc-500">
              Research
            </p>
            <p className="text-sm text-zinc-300">{config.education.tdk}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
