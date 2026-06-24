"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { books, type BookData } from "@/lib/books";

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
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <div className="group w-36 sm:w-40">
        <div className="relative mb-2 flex h-52 w-full items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 transition-colors group-hover:border-zinc-700 sm:h-56">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-3 text-center">
              <p className="text-xs font-semibold leading-tight text-zinc-300 line-clamp-4">
                {book.title}
              </p>
              <p className="mt-1 font-mono text-[10px] leading-tight text-zinc-500 line-clamp-2">
                {book.author}
              </p>
            </div>
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
        {books.length} books across existentialist philosophy, modern non-fiction, Sufism, Urdu Islamic scholarship, and Pashto poetry.
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
