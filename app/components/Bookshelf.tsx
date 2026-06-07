"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { books, type BookData } from "@/lib/books";

// ISBN fallback map for books whose cover isn't found by title+author search
const isbnMap: Record<string, string> = {
  "The Psychology Book: Big Ideas Simply Explained": "9780756689704",
  "In the Hands of the Taliban": "1861054955",
  "The Alchemist": "9780062315007",
  "Man's Search for Meaning": "9780807014295",
  "Atomic Habits": "9780735211292",
  "The 48 Laws of Power": "9780140280197",
  "The Kite Runner": "9781594480003",
  "A Thousand Splendid Suns": "9780743266470",
  "And the Mountains Echoed": "9781594632389",
  "The Brothers Karamazov": "9780140449242",
  "Animal Farm": "9780451526342",
  "The Fault in Our Stars": "9780525478812",
  "The Metamorphosis": "9780553213690",
  "The Stranger": "9780679720201",
  "The Subtle Art of Not Giving a F*ck": "9780062457714",
  "Think and Grow Rich": "9781585424337",
  "The Power of Positive Thinking": "9780743234806",
  "The Five Love Languages": "9780802412706",
  "The Great Philosophers": "9781847971735",
  "White Nights": "9780140446388",
  "Forty Rules of Love": "9780670021458",
  "The Bastard of Istanbul": "9780143114835",
  "Demons": "9780141441412",
  "The Afghanistan Papers": "9781982159009",
};

function BookCard({ book, index }: { book: BookData; index: number }) {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let cancelled = false;

    async function fetchCover() {
      try {
        // Try title+author search first
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(book.title)}+${encodeURIComponent(book.author)}&limit=1`
        );
        const data = await res.json();
        if (cancelled) return;

        if (data.docs?.[0]?.cover_i) {
          setCoverUrl(`https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-M.jpg`);
          if (!cancelled) setLoading(false);
          return;
        }

        // Fallback: try ISBN if available
        const isbn = isbnMap[book.title];
        if (isbn) {
          const isbnRes = await fetch(
            `https://openlibrary.org/search.json?isbn=${isbn}&limit=1`
          );
          const isbnData = await isbnRes.json();
          if (!cancelled && isbnData.docs?.[0]?.cover_i) {
            setCoverUrl(`https://covers.openlibrary.org/b/id/${isbnData.docs[0].cover_i}-M.jpg`);
          }
        }
      } catch {
        // Cover unavailable — show placeholder
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCover();
    return () => { cancelled = true; };
  }, [isInView, book.title, book.author]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <div className="group w-36 sm:w-40">
        <div className="mb-2 flex h-52 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 transition-colors group-hover:border-zinc-700 sm:h-56">
          {loading ? (
            <div className="h-full w-full animate-pulse bg-zinc-800/50" />
          ) : coverUrl ? (
            <img
              src={coverUrl}
              alt={book.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
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
          )}
        </div>
        <h3 className="text-sm font-semibold leading-snug text-zinc-200 line-clamp-2">
          {book.title}
        </h3>
        <p className="mt-0.5 truncate font-mono text-xs text-zinc-500">
          {book.author}
        </p>
      </div>
    </motion.div>
  );
}

export function Bookshelf() {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? books : books.slice(0, 12);

  return (
    <section className="section-container" id="books">
      <h2 className="section-title">Bookshelf</h2>
      <p className="mb-8 max-w-lg text-sm leading-relaxed text-zinc-500">
        {books.length} books across existentialist philosophy, modern non-fiction, Sufism, Urdu Islamic scholarship, and Pashto poetry. Covers fetched live from Open Library.
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:justify-start sm:gap-5">
        {displayed.map((book, i) => (
          <BookCard key={`${book.title}-${book.author}`} book={book} index={i} />
        ))}
      </div>
      {books.length > 12 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium transition-colors hover:border-zinc-500 hover:bg-zinc-800/50"
          >
            {showAll
              ? `Show less`
              : `Show all ${books.length} books →`}
          </button>
        </div>
      )}
    </section>
  );
}
