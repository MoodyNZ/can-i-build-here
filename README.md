# Can I build here?

Pick a property on a map of one New Zealand suburb and see roughly what you could put on it. It's a basic version of the first question every landowner asks.

The whole thing runs in your browser. No backend, no database, no accounts. You click a parcel, and the app shows the **buildable envelope**: the area left after a boundary setback and a site-coverage cap are applied to the real parcel boundary.

> This app assumes a fixed setback and coverage rule, and is not planning advice.

---

## Why this repo exists

I'm a hands-on engineering manager. This is a small project I use to keep my hands in the code and to show how I think about building software.

---

## How it works

1. Real parcel boundaries for one suburb ship as a static GeoJSON file bundled with the app.
2. You click a parcel on a [MapLibre](https://maplibre.org) map.
3. [Turf.js](https://turfjs.org) insets the boundary by the setback and applies the coverage cap, all client-side.
4. A side panel shows the site area, the buildable area, the coverage percentage, and which rule is the binding constraint.

Parcel data comes from the [LINZ Data Service](https://data.linz.govt.nz). Geometry is projected into NZTM for area calculations, since the WGS84 web mercator projection is not accurate flor local mesaurements

---

## Stack

TypeScript, Next.js, React, MapLibre GL JS, Turf.js, Proj4, Tailwind, hosted on GitHub Pages

Tooling: pnpm, Turborepo, Biome, Vitest

---

## Run locally

```bash
pnpm install
pnpm dev          # start the web app
```

Other useful scripts, run from the repo root:

```bash
pnpm typecheck    # tsc, no emit
pnpm test         # Vitest
pnpm check        # Biome lint + format check
pnpm build        # static export to apps/web/out
```