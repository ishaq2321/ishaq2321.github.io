import { config } from "@/lib/config";

export function Bookshelf() {
  return (
    <section className="section-container" id="books">
      <h2 className="section-title">Bookshelf</h2>
      <div className="flex flex-wrap gap-4">
        {config.books.map((book) => (
          <div
            key={book.title}
            className="card w-48"
          >
            <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-zinc-800/50">
              <svg
                className="h-10 w-10 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold leading-snug">{book.title}</h3>
            <p className="mt-1 font-mono text-xs text-zinc-500">{book.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
