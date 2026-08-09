"use client";

import { useState } from "react";
import { paper } from "@/lib/paper";

const citation = `Y. Xu, "A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features," The Columbia Junior Science Journal, vol. 11, pp. 1–6, 2025–2026.`;

const bibtex = `@article{xu2025waterlevel,
  title   = {A Machine Learning Approach for Water Level Residual Correction
             Using Geospatial Terrain Features},
  author  = {Xu, Yan (Ethan)},
  journal = {The Columbia Junior Science Journal},
  volume  = {11},
  pages   = {1--6},
  year    = {2025},
  url     = {${paper.journalUrl}}
}`;

export function CiteBox() {
  const [tab, setTab] = useState<"ieee" | "bibtex">("ieee");
  const [copied, setCopied] = useState(false);

  const value = tab === "ieee" ? citation : bibtex;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the text stays selectable below */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border-base bg-surface">
      <div className="flex items-center gap-1 border-b border-border-base px-3 py-2">
        {(["ieee", "bibtex"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-[0.78rem] font-medium transition ${
              tab === t
                ? "bg-surface-2 text-ink"
                : "text-muted hover:text-ink"
            }`}
          >
            {t === "ieee" ? "IEEE" : "BibTeX"}
          </button>
        ))}
        <button
          type="button"
          onClick={copy}
          className="ml-auto rounded-md px-3 py-1.5 text-[0.78rem] font-medium text-accent transition hover:bg-accent-soft"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="num overflow-x-auto px-5 py-4 text-[0.78rem] leading-relaxed text-ink-2">
        {value}
      </pre>
    </div>
  );
}
