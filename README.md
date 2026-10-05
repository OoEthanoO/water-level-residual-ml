# Water Level Residual Correction — paper site

A Next.js presentation site for:

**A Machine Learning Approach for Water Level Residual Correction Using Geospatial Terrain Features**
Yan (Ethan) Xu — *The Columbia Junior Science Journal*, Volume 11, 2025–2026, pp. 1–6.

Published issue: <https://cjsjournal.squarespace.com/20252026-cjsj>

## Running it

```bash
npm run dev
```

`npm run build` exports the site to `out/`. Serve that directory with a static
web server; this site does not require `next start` or a production Node process.

## Deployment

Production: <https://tides.ethanyanxu.com>, served by the existing Caddy instance
on the native Windows home server `finprint-host`.

From a Windows machine with SSH access to that host, install dependencies with
`npm ci`, commit the changes, then run:

```powershell
npm run deploy
```

The deploy command requires a clean working tree, runs lint and the production
build (including TypeScript), uploads only the static export, and activates a
new release under `C:\ProgramData\water-level-residual-ml`. It validates Caddy
before reloading and confirms the commit at `/version.txt` through trusted
HTTPS, both on the host and through public DNS. A failed activation restores
the previous Caddy configuration. Releases are retained for rollback:

```powershell
npm run deploy -- -Rollback
```

The host's `state.json` records the active and previous releases. The site's
own `Caddyfile` is imported from the shared Finprint Caddy configuration;
`finprint-caddy` already starts at boot. No additional service is needed.
Figures, fonts, and the paper PDF are all served locally, with long caching
only for content-hashed assets. The paper content and canonical URL are unchanged.

DNS is a Cloudflare DNS-only CNAME from `tides.ethanyanxu.com` to
`finprint.ethanyanxu.com`, so the existing home-server DDNS updater handles IP
changes. The original DNS record is backed up on the host as
`dns-before-migration.json`. Credentials remain on the host. Caddy obtains and
renews HTTPS certificates automatically. Initial setup requires this DNS
record to point at the home server before certificate validation can complete.

`vercel.json` disables Vercel Git deployments. Future releases use the command
above; pushing to GitHub alone does not deploy the site.

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
