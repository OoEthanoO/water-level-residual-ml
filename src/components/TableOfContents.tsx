"use client";

import { useEffect, useState } from "react";
import { sections } from "@/lib/paper";

export function TableOfContents() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -62% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Paper contents" className="text-sm">
      <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
        Contents
      </p>
      <ul className="space-y-0.5 border-l border-border-base">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "location" : undefined}
                className={`-ml-px flex items-baseline gap-2 border-l-2 py-1.5 pl-4 transition-colors ${
                  isActive
                    ? "border-accent font-medium text-accent"
                    : "border-transparent text-muted hover:border-border-strong hover:text-ink"
                }`}
              >
                {s.numeral && (
                  <span className="num w-5 shrink-0 text-[0.68rem] opacity-70">
                    {s.numeral}.
                  </span>
                )}
                <span className={s.numeral ? "" : "pl-7"}>{s.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
