import { regimes } from "@/lib/paper";

export function RegimeComparison() {
  return (
    <div className="space-y-4">
      <Legend />
      <div className="grid gap-4 lg:grid-cols-3">
        {regimes.map((r, panelIndex) => {
          const max = Math.max(...r.models.map((m) => m.rmse));
          return (
            <figure
              key={r.id}
              className="flex flex-col rounded-xl border border-border-base bg-surface p-5"
            >
              <figcaption className="mb-1">
                <h4 className="text-[0.95rem] font-semibold leading-snug text-ink">
                  {r.title}
                </h4>
                <p className="mt-1 text-[0.78rem] text-muted">{r.scope}</p>
              </figcaption>

              <div className="mt-5 space-y-4">
                {r.models.map((m, i) => {
                  const pct = (m.rmse / max) * 100;
                  const isWinner = m.key === r.winner;
                  return (
                    <div key={m.key}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-3">
                        <span
                          className={`text-[0.78rem] ${
                            isWinner ? "font-semibold text-ink" : "text-muted"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span className="num shrink-0 text-[0.82rem] font-medium text-ink">
                          {m.rmse.toFixed(4)}
                          <span className="ml-0.5 text-[0.7rem] font-normal text-muted">
                            m
                          </span>
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="bar-grow h-full origin-left rounded-full"
                          style={{
                            width: `${Math.max(pct, 1.2)}%`,
                            background:
                              m.key === "xgb" ? "var(--accent)" : "var(--baseline)",
                            animationDelay: `${panelIndex * 120 + i * 90}ms`,
                          }}
                        />
                      </div>
                      {m.r2 !== undefined && (
                        <p className="num mt-1.5 text-[0.7rem] text-muted">
                          R² {m.r2.toFixed(4)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-border-base pt-4">
                <span
                  className="num rounded-md px-2 py-0.5 text-[0.78rem] font-semibold"
                  style={{
                    color: r.winner === "xgb" ? "var(--accent)" : "var(--baseline)",
                    background:
                      r.winner === "xgb"
                        ? "var(--accent-soft)"
                        : "var(--baseline-soft)",
                  }}
                >
                  {r.delta}
                </span>
                <span className="text-[0.78rem] text-muted">{r.deltaLabel}</span>
              </div>

              <p className="mt-4 text-[0.82rem] leading-relaxed text-muted">{r.note}</p>
            </figure>
          );
        })}
      </div>
      <p className="text-[0.78rem] leading-relaxed text-muted">
        Lower RMSE is better. Bars are scaled within each panel, not across panels — the
        autoregressive errors are roughly fifty times larger than the one-step-ahead
        errors.
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.78rem] text-muted">
      <span className="flex items-center gap-2">
        <span
          className="h-2.5 w-6 rounded-full"
          style={{ background: "var(--baseline)" }}
        />
        LightGBM — temporal features only
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-6 rounded-full" style={{ background: "var(--accent)" }} />
        XGBoost — temporal + geospatial features
      </span>
    </div>
  );
}
