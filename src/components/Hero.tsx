import { paper } from "@/lib/paper";

export function Hero() {
  return (
    <div id="top" className="contour-field relative overflow-hidden border-b border-border-base">
      <TerrainBackdrop />

      <div className="relative mx-auto max-w-[100rem] px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
        <div className="max-w-3xl">
          <div className="fade-up flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.72rem]">
            <span className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1 font-semibold uppercase tracking-[0.14em] text-accent">
              {paper.journalShort} · {paper.volume}
            </span>
            <span className="text-muted">{paper.issue}</span>
            <span className="text-border-strong">/</span>
            <span className="num text-muted">pp. {paper.pages}</span>
          </div>

          <h1
            className="fade-up mt-7 font-serif text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-ink sm:text-[3.15rem] sm:leading-[1.08]"
            style={{ animationDelay: "80ms" }}
          >
            A Machine Learning Approach for Water Level Residual Correction Using{" "}
            <span className="text-accent">Geospatial Terrain Features</span>
          </h1>

          <p
            className="fade-up mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-ink-2"
            style={{ animationDelay: "150ms" }}
          >
            Static terrain — elevation, slope, and aspect drawn from 30&nbsp;m digital
            elevation models — gives an autoregressive forecaster something that does not
            drift. Across 15 NOAA tide stations, that anchor cuts two-day forecast error by{" "}
            <strong className="font-semibold text-ink">84.38%</strong>.
          </p>

          <div
            className="fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
            style={{ animationDelay: "220ms" }}
          >
            <div>
              <p className="font-serif text-lg font-semibold text-ink">{paper.author}</p>
              <p className="mt-0.5 text-sm text-muted">{paper.journal}</p>
            </div>
          </div>

          <div
            className="fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "290ms" }}
          >
            <a
              href="#abstract"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
            >
              Read the paper
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
            >
              Download PDF
            </a>
            <a
              href={paper.journalUrl}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full px-2 py-2.5 text-sm font-medium text-muted transition hover:text-accent"
            >
              View in journal
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.7}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M3 8h9M8.5 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Decorative only: abstract contour + wave field, not derived from study data. */
function TerrainBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMaxYMid slice"
        className="absolute -right-24 top-0 h-full w-[130%] text-accent opacity-[0.16] sm:right-0 sm:w-[70%] sm:opacity-25"
        fill="none"
      >
        <defs>
          <linearGradient id="fade-h" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.45" stopColor="currentColor" stopOpacity="0.75" />
            <stop offset="1" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <g stroke="url(#fade-h)" strokeWidth="1.15">
          {Array.from({ length: 13 }).map((_, i) => {
            const y = 90 + i * 30;
            const amp = 16 + i * 2.4;
            const d = `M -40 ${y} C 180 ${y - amp}, 320 ${y + amp}, 520 ${y} S 860 ${
              y - amp * 0.85
            }, 1240 ${y + amp * 0.3}`;
            return <path key={i} d={d} />;
          })}
        </g>
        <g stroke="currentColor" strokeWidth="1" opacity="0.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ellipse
              key={i}
              cx="905"
              cy="255"
              rx={54 + i * 46}
              ry={30 + i * 26}
              transform={`rotate(-14 905 255)`}
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
