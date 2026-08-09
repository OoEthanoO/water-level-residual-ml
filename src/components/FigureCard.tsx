"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { FigureSpec } from "@/lib/paper";

export function FigureCard({ figure }: { figure: FigureSpec }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const accent = figure.tag === "xgb" ? "var(--accent)" : "var(--baseline)";

  return (
    <figure
      id={figure.id}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-border-base bg-surface"
    >
      <div className="flex items-center gap-2.5 border-b border-border-base px-5 py-3">
        <span
          className="num rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold"
          style={{
            color: accent,
            background:
              figure.tag === "xgb" ? "var(--accent-soft)" : "var(--baseline-soft)",
          }}
        >
          Fig. {figure.number}
        </span>
        <h4 className="min-w-0 flex-1 truncate text-[0.88rem] font-medium text-ink">
          {figure.title}
        </h4>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 text-muted transition hover:text-accent"
          aria-label={`Enlarge Figure ${figure.number}`}
        >
          <ExpandIcon />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in bg-white p-3 sm:p-5"
        aria-label={`Enlarge Figure ${figure.number}`}
      >
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          className="mx-auto h-auto w-full"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 30rem"
        />
      </button>

      <figcaption className="border-t border-border-base px-5 py-4 text-[0.82rem] leading-relaxed text-muted">
        <span className="font-medium text-ink-2">Figure {figure.number}.</span>{" "}
        {figure.caption}
      </figcaption>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Figure ${figure.number}: ${figure.title}`}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3">
              <p className="text-sm font-medium text-neutral-900">
                Figure {figure.number} — {figure.title}
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Close figure"
              >
                <CloseIcon />
              </button>
            </div>
            <Image
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              className="h-auto w-full p-4 sm:p-8"
              sizes="(max-width: 896px) 100vw, 896px"
            />
            <p className="border-t border-neutral-200 px-5 py-4 text-[0.82rem] leading-relaxed text-neutral-600">
              {figure.caption}
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}

function ExpandIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5 9 7M2.5 13.5 7 9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}
