"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { books, type BookData } from "@/lib/books";
import { SectionHeader } from "@/app/components/SectionHeader";

function BookCard({ book, index }: { book: BookData; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const coverUrl = book.isbn
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group w-32 sm:w-36">
        <div
          className="relative mb-3 flex h-48 w-full items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 sm:h-52"
          style={{
            border: "1px solid var(--line)",
            borderRadius: "2px",
            background: "var(--surface)",
            boxShadow: "var(--shadow)",
          }}
        >
          {coverUrl ? (
            <Image src={coverUrl} alt={book.title} fill className="object-cover" loading="lazy" />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center p-3 text-center"
              style={{ background: "linear-gradient(160deg, var(--surface-hover), var(--bg-inset))" }}
            >
              <p className="line-clamp-4 font-display text-sm leading-tight" style={{ color: "var(--text)" }}>
                {book.title}
              </p>
              <p className="mt-1 line-clamp-2 font-mono text-[10px] leading-tight" style={{ color: "var(--text-faint)" }}>
                {book.author}
              </p>
            </div>
          )}
        </div>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
          {book.title}
        </h3>
        <p className="mt-0.5 truncate font-mono text-xs" style={{ color: "var(--text-faint)" }}>
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
    <section className="section-shell" id="books">
      <SectionHeader index="08" title="Bookshelf" kicker="Off the clock" />

      <p className="mb-10 max-w-xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {books.length} books across existentialist philosophy, modern non-fiction, Sufism, Urdu
        Islamic scholarship, and Pashto poetry.
      </p>

      <div className="flex flex-wrap justify-center gap-5 sm:justify-start sm:gap-6">
        {displayed.map((book, i) => (
          <BookCard key={`${book.title}-${book.author}`} book={book} index={i} />
        ))}
      </div>

      {books.length > 12 && (
        <div className="mt-12">
          <button onClick={() => setShowAll(!showAll)} className="btn-ghost">
            {showAll ? "Show less" : `Show all ${books.length} books →`}
          </button>
        </div>
      )}
    </section>
  );
}
