"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { books, type BookData } from "@/lib/books";
import { SectionHeader } from "@/app/components/SectionHeader";

/** Deterministic hue from title, so fallbacks vary but never clash. */
function spineTint(title: string): { hue: number; dark: string; light: string } {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return {
    hue,
    dark: `hsl(${hue} 22% 16%)`,
    light: `hsl(${hue} 26% 24%)`,
  };
}

/**
 * Styled stand-in for books without a cover image — reads as a book spine
 * with a deterministic per-title tint instead of a flat grey box.
 */
function SpineFallback({ book }: { book: BookData }) {
  const tint = spineTint(book.title);
  return (
    <div
      className="flex h-full w-full flex-col justify-between p-3 text-left"
      style={{ background: `linear-gradient(150deg, ${tint.dark}, ${tint.light})` }}
    >
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: `hsl(${tint.hue} 45% 55%)`, opacity: 0.75 }}
      />
      <p className="line-clamp-4 pl-1 font-display text-sm leading-tight" style={{ color: "var(--text)" }}>
        {book.title}
      </p>
      <div>
        <span
          className="mb-2 block h-px w-6"
          style={{ background: `hsl(${tint.hue} 45% 55%)`, opacity: 0.6 }}
        />
        <p className="line-clamp-2 pl-1 font-mono text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
          {book.author}
        </p>
      </div>
    </div>
  );
}

function BookCard({ book, index }: { book: BookData; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  // default=false → Open Library returns a real 404 instead of a blank
  // placeholder image, so onError fires and the title card takes over.
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUrl =
    !coverFailed && book.isbn
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`
      : null;

  const cover = coverUrl ? (
    <Image
      src={coverUrl}
      alt={book.title}
      fill
      className="object-cover"
      loading="lazy"
      onError={() => setCoverFailed(true)}
    />
  ) : (
    <SpineFallback book={book} />
  );

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
          {cover}
        </div>        <h3 className="line-clamp-2 text-sm font-medium leading-snug" style={{ color: "var(--text)" }}>
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
      <SectionHeader index="07" title="Bookshelf" kicker="Off the clock" />

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
