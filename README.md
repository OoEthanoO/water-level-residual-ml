# Water Level Residual Correction — paper site

A Next.js presentation site for:

**A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features**
Yan (Ethan) Xu — *The Columbia Junior Science Journal*, Volume 11, 2025–2026, pp. 1–6.

Published issue: <https://cjsjournal.squarespace.com/20252026-cjsj>

## Running it

```bash
npm run dev
```

```bash
npm run build && npm start
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/lib/paper.ts` | All paper content — abstract, section prose, features, metrics, figure metadata, references. Edit text here, not in components. |
| `src/app/page.tsx` | Page composition and section order. |
| `src/components/` | Presentational pieces (hero, TOC, figure cards, result charts, citation box). |
| `public/figures/` | Figures 1–6, extracted from the published PDF. |
| `public/xu-*.pdf` | The full published PDF, linked from the header and hero. |

## Notes on the figures

Figures 1–6 are the original matplotlib outputs from the `ccir-final` research
repo (711–1035 px wide), not the low-resolution rasters embedded in the PDF.
Each was matched to its published counterpart by plot title and curve shape.

Figure 6 was **regenerated**, because it is not saved anywhere in the research
repo. The cause is a filename collision: `model/validate_xgb_performance.py`
(one-step-ahead, Figure 4) and `model/validate_xgb_prediction.py`
(autoregressive, Figure 6) both write to

```
performances/prediction_{model_name}_on_{data_name}.png
```

so whichever runs last silently overwrites the other. To reproduce Figure 6:

```bash
python model/validate_xgb_prediction.py --model models/xgb_elevation_<15-stations>_20210820_20250819.json --data model_data/noaa_9411340_20250822_20250823_observed.csv
```

The regenerated figure reproduces the paper's reported autoregressive RMSE of
**0.0763 m** exactly. Requires `xgboost`, `rasterio`, `pandas`, `matplotlib`,
`scikit-learn`, and the `libomp` runtime (`brew install libomp` on macOS).

To swap any figure, drop a new PNG into `public/figures/` under the same
filename and update its `width` / `height` in `src/lib/paper.ts`.

## Theming

Light and dark themes are driven by CSS custom properties in
`src/app/globals.css`. A small pre-hydration script in `src/app/layout.tsx`
applies the stored or system preference before first paint, so there is no
flash. Accent (`--accent`) marks the geospatial XGBoost model throughout;
amber (`--baseline`) marks the temporal LightGBM baseline.
