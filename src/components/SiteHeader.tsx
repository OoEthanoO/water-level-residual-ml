"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { paper } from "@/lib/paper";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border-base bg-bg/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[100rem] items-center gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-3 text-ink transition hover:text-accent"
        >
          <WaveMark />
          <span
            className={`min-w-0 truncate text-sm font-medium transition-opacity duration-300 ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            Water Level Residual Correction
          </span>
        </a>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <a
            href={paper.journalUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-border-base px-3.5 py-1.5 text-xs font-medium text-ink-2 transition hover:border-accent hover:text-accent sm:inline-block"
          >
            Published in CJSJ
          </a>
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-bg transition hover:opacity-90"
          >
            PDF
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function WaveMark() {
  return (
    <svg
      viewBox="0 0 28 28"
      className="h-7 w-7 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="14" cy="14" r="12.25" className="opacity-30" />
      <path d="M3 15.4c2.4 0 2.4-2.6 4.8-2.6s2.4 2.6 4.8 2.6 2.4-2.6 4.8-2.6 2.4 2.6 4.8 2.6" />
      <path d="M4.6 20c2.2 0 2.2-2.3 4.4-2.3S11.2 20 13.4 20s2.2-2.3 4.4-2.3S20 20 22.2 20" className="opacity-45" />
      <path d="M5.5 10.2 9.8 6l4 3.4L18.4 5l4 4.2" className="opacity-55" />
    </svg>
  );
}
