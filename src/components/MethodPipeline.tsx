const stages = [
  {
    step: "01",
    title: "Observations",
    lines: [
      "15 NOAA stations",
      "6-minute intervals",
      "2021-08-20 → 2025-08-19",
    ],
  },
  {
    step: "02",
    title: "Residual target",
    lines: ["Residual = Observed − Predicted", "NOAA operational forecast", "as the baseline"],
    formula: true,
  },
  {
    step: "03",
    title: "Terrain extraction",
    lines: ["Copernicus GLO-30", "3 km × 3 km clip", "Rasterio + NumPy"],
  },
  {
    step: "04",
    title: "Model fitting",
    lines: ["70 / 30 split", "GridSearchCV, 5-fold", "temporal CV on RMSE"],
  },
  {
    step: "05",
    title: "Corrected level",
    lines: ["NOAA prediction", "+ predicted residual", "evaluated by RMSE & R²"],
  },
];

export function MethodPipeline() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {stages.map((s) => (
        <li
          key={s.step}
          className="relative flex flex-col rounded-xl border border-border-base bg-surface p-4"
        >
          <span className="num text-[0.68rem] font-semibold tracking-[0.14em] text-accent">
            {s.step}
          </span>
          <h4 className="mt-2 text-[0.92rem] font-semibold text-ink">{s.title}</h4>
          <ul className="mt-2.5 space-y-1">
            {s.lines.map((l, i) => (
              <li
                key={l}
                className={
                  s.formula && i === 0
                    ? "num text-[0.76rem] font-medium leading-relaxed text-ink"
                    : "text-[0.8rem] leading-relaxed text-muted"
                }
              >
                {l}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
