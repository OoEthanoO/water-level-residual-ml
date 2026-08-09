import { Hero } from "@/components/Hero";
import { SiteHeader } from "@/components/SiteHeader";
import { TableOfContents } from "@/components/TableOfContents";
import { Callout, Section, SubHeading } from "@/components/Section";
import { KeyNumbers } from "@/components/KeyNumbers";
import { RegimeComparison } from "@/components/RegimeComparison";
import { FigureCard } from "@/components/FigureCard";
import { MethodPipeline } from "@/components/MethodPipeline";
import { FeatureTables } from "@/components/FeatureTables";
import { CiteBox } from "@/components/CiteBox";
import {
  background,
  conclusion,
  discussion,
  evaluationCriteria,
  figures,
  heldOutStation,
  hyperparameters,
  introduction,
  methodology,
  objectives,
  paper,
  references,
  results,
  stations,
} from "@/lib/paper";

const figureById = Object.fromEntries(figures.map((f) => [f.id, f]));

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />

      <main className="mx-auto max-w-[100rem] px-5 sm:px-8">
        <div className="flex gap-12">
          <aside className="hidden w-56 shrink-0 xl:block">
            <div className="sticky top-24 py-16">
              <TableOfContents />
            </div>
          </aside>

          <div className="min-w-0 flex-1 pb-8 xl:max-w-[54rem]">
            {/* ---------------------------------------------------- Abstract */}
            <Section id="abstract" title="Abstract">
              <div className="paper-prose max-w-[46rem]">
                <p className="text-[1.08rem] leading-[1.8]">{paper.abstract}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  "Residual correction",
                  "LightGBM",
                  "XGBoost",
                  "Copernicus DEM",
                  "Autoregressive forecasting",
                  "Coastal hydrology",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-base bg-surface px-3 py-1 text-[0.76rem] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            {/* -------------------------------------------------- Highlights */}
            <Section id="highlights" title="At a Glance" kicker="Key figures">
              <KeyNumbers />
            </Section>

            {/* ------------------------------------------------ Introduction */}
            <Section id="introduction" numeral="I" title="Introduction">
              <div className="paper-prose max-w-[46rem]">
                {introduction.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <SubHeading>Study objectives</SubHeading>
              <ol className="max-w-[46rem] space-y-2.5">
                {objectives.map((o) => (
                  <li key={o.key} className="flex gap-3.5">
                    <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent-soft text-[0.72rem] font-semibold text-accent">
                      {o.key}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-ink-2">
                      {o.text}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>

            {/* -------------------------------------------------- Background */}
            <Section
              id="background"
              numeral="II"
              title="Literature Review / Background"
            >
              <div className="paper-prose max-w-[46rem]">
                {background.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Section>

            {/* ------------------------------------------------- Methodology */}
            <Section id="methodology" numeral="III" title="Methodology">
              <MethodPipeline />

              <SubHeading>Water level data</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {methodology.data.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border-base bg-surface p-5">
                <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  NOAA station identifiers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stations.map((s) => (
                    <a
                      key={s}
                      href={`https://tidesandcurrents.noaa.gov/stationhome.html?id=${s}`}
                      target="_blank"
                      rel="noreferrer"
                      className="num rounded-md border border-border-base px-2 py-1 text-[0.76rem] text-ink-2 transition hover:border-accent hover:text-accent"
                    >
                      {s}
                    </a>
                  ))}
                  <a
                    href={`https://tidesandcurrents.noaa.gov/stationhome.html?id=${heldOutStation}`}
                    target="_blank"
                    rel="noreferrer"
                    className="num rounded-md border border-accent/45 bg-accent-soft px-2 py-1 text-[0.76rem] font-medium text-accent transition hover:opacity-80"
                  >
                    {heldOutStation} · held out
                  </a>
                </div>
              </div>

              <SubHeading>Geospatial data and terrain features</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {methodology.geospatial.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <SubHeading>Feature set</SubHeading>
              <FeatureTables />

              <SubHeading>Model selection and training</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {methodology.model.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border-base bg-surface p-5">
                <p className="mb-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  Final XGBoost hyperparameters
                </p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                  {hyperparameters.map((h) => (
                    <div
                      key={h.name}
                      className="flex items-baseline justify-between gap-2 border-b border-border-base pb-2"
                    >
                      <dt className="num text-[0.78rem] text-muted">{h.name}</dt>
                      <dd className="num text-[0.82rem] font-medium text-ink">
                        {h.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <SubHeading>Validation criteria</SubHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {evaluationCriteria.map((c) => (
                  <div
                    key={c.key}
                    className="rounded-xl border border-border-base bg-surface p-5"
                  >
                    <div className="mb-2.5 flex items-center gap-2.5">
                      <span className="num grid h-6 w-6 place-items-center rounded-md bg-accent-soft text-[0.72rem] font-semibold text-accent">
                        {c.key}
                      </span>
                      <h4 className="text-[0.92rem] font-semibold text-ink">
                        {c.title}
                      </h4>
                    </div>
                    <p className="text-[0.86rem] leading-relaxed text-muted">{c.text}</p>
                  </div>
                ))}
              </div>

              <Callout label="Evaluation metrics">{methodology.metricsNote}</Callout>
            </Section>

            {/* ----------------------------------------------------- Results */}
            <Section id="results" numeral="IV" title="Results">
              <div className="paper-prose max-w-[46rem]">
                {results.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <SubHeading>Performance across all three regimes</SubHeading>
              <RegimeComparison />

              <SubHeading>Feature importance</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {results.importance.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <FigureCard figure={figureById["figure-1"]} />
                <FigureCard figure={figureById["figure-2"]} />
              </div>

              <SubHeading>Generalization to an unseen station</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {results.generalization.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <Callout label="Reading the validation plots">
                {results.curveLegend}
              </Callout>

              <div className="grid gap-4 lg:grid-cols-2">
                <FigureCard figure={figureById["figure-3"]} />
                <FigureCard figure={figureById["figure-4"]} />
              </div>

              <SubHeading>Multi-step autoregressive forecasting</SubHeading>
              <div className="paper-prose max-w-[46rem]">
                {results.autoregressive.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <FigureCard figure={figureById["figure-5"]} />
                <FigureCard figure={figureById["figure-6"]} />
              </div>
            </Section>

            {/* -------------------------------------------------- Discussion */}
            <Section id="discussion" numeral="V" title="Discussion">
              <div className="paper-prose max-w-[46rem]">
                {discussion.opening.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <SubHeading>Limitations</SubHeading>
              <div className="grid gap-3 sm:grid-cols-2">
                {discussion.limitations.map((l) => (
                  <div
                    key={l.title}
                    className="rounded-xl border border-border-base bg-surface p-5"
                  >
                    <h4 className="mb-1.5 text-[0.9rem] font-semibold text-ink">
                      {l.title}
                    </h4>
                    <p className="text-[0.85rem] leading-relaxed text-muted">{l.text}</p>
                  </div>
                ))}
              </div>

              <SubHeading>Future work</SubHeading>
              <div className="grid gap-3 sm:grid-cols-3">
                {discussion.future.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-xl border border-accent/30 bg-accent-soft p-5"
                  >
                    <h4 className="mb-1.5 text-[0.9rem] font-semibold text-ink">
                      {f.title}
                    </h4>
                    <p className="text-[0.85rem] leading-relaxed text-ink-2">{f.text}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* -------------------------------------------------- Conclusion */}
            <Section id="conclusion" numeral="VI" title="Conclusion">
              <div className="paper-prose max-w-[46rem]">
                {conclusion.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Section>

            {/* -------------------------------------------------- References */}
            <Section id="references" numeral="VII" title="References">
              <ol className="max-w-[46rem] space-y-3">
                {references.map((r) => (
                  <li key={r.n} className="flex gap-3.5">
                    <span className="num mt-px shrink-0 text-[0.78rem] text-muted">
                      [{r.n}]
                    </span>
                    <span className="text-[0.86rem] leading-relaxed text-ink-2">
                      {r.text}{" "}
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-accent underline decoration-accent/30 underline-offset-2 transition hover:decoration-accent"
                        >
                          {shortUrl(r.url)}
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>

              <SubHeading>Cite this paper</SubHeading>
              <div className="max-w-[46rem]">
                <CiteBox />
              </div>
            </Section>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-border-base bg-surface-2">
        <div className="mx-auto flex max-w-[100rem] flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div className="max-w-md">
            <p className="font-serif text-lg font-semibold text-ink">{paper.author}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {paper.title}
            </p>
            <p className="mt-3 text-[0.8rem] text-muted">
              {paper.journal} · {paper.volume} · {paper.issue} · pp. {paper.pages}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a
              href={paper.journalUrl}
              target="_blank"
              rel="noreferrer"
              className="text-ink-2 transition hover:text-accent"
            >
              Journal issue
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-ink-2 transition hover:text-accent"
            >
              Full PDF
            </a>
            <a
              href="https://tidesandcurrents.noaa.gov/"
              target="_blank"
              rel="noreferrer"
              className="text-ink-2 transition hover:text-accent"
            >
              NOAA Tides & Currents
            </a>
            <a href="#top" className="text-ink-2 transition hover:text-accent">
              Back to top
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

function shortUrl(url: string) {
  const trimmed = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return trimmed.length > 58 ? `${trimmed.slice(0, 55)}…` : trimmed;
}
