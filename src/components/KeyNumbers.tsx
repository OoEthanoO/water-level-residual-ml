const stats = [
  {
    value: "84.38%",
    label: "RMSE improvement",
    detail:
      "Geospatial XGBoost over the temporal LightGBM baseline on two-day autoregressive forecasting.",
    emphasis: true,
  },
  {
    value: "0.0763 m",
    label: "XGBoost autoregressive RMSE",
    detail: "Against 0.4887 m for the temporal-only baseline over the same window.",
  },
  {
    value: "15 + 1",
    label: "NOAA stations",
    detail: "Fifteen diverse stations for training, one fully held out for generalization.",
  },
  {
    value: "4 years",
    label: "of verified records",
    detail: "6-minute intervals, 2021-08-20 to 2025-08-19, from NOAA Tides and Currents.",
  },
  {
    value: "30 m",
    label: "Copernicus GLO-30 DEM",
    detail: "Sampled in a 3 km × 3 km clip centered on each station.",
  },
  {
    value: "22",
    label: "engineered features",
    detail: "Ten temporal predictors combined with twelve static terrain descriptors.",
  },
];

export function KeyNumbers() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border p-5 transition-colors ${
            s.emphasis
              ? "border-accent/45 bg-accent-soft"
              : "border-border-base bg-surface hover:border-border-strong"
          }`}
        >
          <p
            className={`num font-serif text-[1.9rem] font-semibold leading-none tracking-tight ${
              s.emphasis ? "text-accent" : "text-ink"
            }`}
          >
            {s.value}
          </p>
          <p className="mt-2.5 text-sm font-medium text-ink">{s.label}</p>
          <p className="mt-1.5 text-[0.84rem] leading-relaxed text-muted">{s.detail}</p>
        </div>
      ))}
    </div>
  );
}
