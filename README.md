# Can I build here?

Search your address in Auckland and see roughly what you could build on your property. It's a basic version of the first question every homeowner asks.

The whole thing runs in your browser. No backend, database or accounts. You search your address, and the app shows the **buildable envelope**: the area left after a boundary setback and a site coverage cap are applied to the real parcel boundary.

---

## Goal & motivation

**Goal:** Let a user search an address in Auckland and instantly see the buildable envelope, site area, site coverage %, and perscribe next steps. This is a discover and market education tool, so the goal is a simple, sleek and consise user experience. The user should leave knowing what do do next based on how much buildable area they have available.

**Motivation:**

- Reading a council district plan is hard, complicated and unclear as to what acitivies are permitted for your property. Users want a simple description of their property and perscription of what the next steps are.

## Non goals

- Not a planning advise tool, GIS layer management or advanced spatial interface
- No accounts, backend, database, or persistence.
- No nationwide coverage, one major city, one rule set to start.

**Target user:** a auckland based homeowner, not a developer or land planner. The homeowner does not understand zoning jargon and wont read a district plan. They want a plain language answer and a clear next step.

- [ ] **As a homeowner**, I can search my address and have the map jump straight to my property, so I don't have to hunt for it on a map.
- [ ] **As a homeowner**, I can see in plain language how much of my section I could build on, so I get a quick gut check without reading the district plan.
- [ ] **As a homeowner**, I'm told what to do next based on my buildable area, so I leave knowing my options rather than just a number.
- [ ] **As a mobile user**, I get a mobile first expereince as this is my preffered web browsing device.
- [ ] **As any visitor**, I can load the app instantly from a public URL with no sign-up, so there's zero friction to trying it.

## SPIKE — core decisions proven ✅

A spike to confirm tech decisions, and identify any risks up front. **Complete.**

- [x] Next.js boilerplate app hosted on github pages
- [x] Monorepo + tooling wired up (pnpm, Turborepo, Biome, Vitest)
- [x] MapLibre GL map renders with a **free** tile provider (no API key / billing)

## Roadmap & acceptance criteria

### Milestone 1 — Real data & buildable envelope

- [ ] Source real parcel boundaries for one Auckland area from the [LINZ Data Service](https://data.linz.govt.nz) or Auckland Council
- [ ] Project geometry into NZTM for accurate local area calculations (WGS84 / web mercator is not accurate for local measurement)
- [ ] **Address search** is the primary entry point — typing an address selects the matching parcel and centres the map on it
- [ ] Tapping / clicking a parcel also selects it (secondary path)
- [ ] [Turf.js](https://turfjs.org) insets the boundary by the setback and applies the coverage cap, client side
- [ ] Side panel shows: site area, buildable area, coverage %, and the binding constraint
- [ ] Simple **next steps** based on the result (e.g. enough room to extend → what to check / who to talk to)
- [ ] Buildable envelope is drawn on the map over the selected parcel

**Acceptance criteria**

- [ ] A homeowner can go from typing their address to seeing their buildable envelope without ever touching the map
- [ ] Selecting a parcel returns a buildable area that matches a hand calculated check within a small tolerance
- [ ] Areas are computed in NZTM m2, not lat/lng
- [ ] The binding constraint label correctly reflects whichever rule produces the smaller envelope
- [ ] Results are explained in plain language, with a concrete next step
- [ ] All calculations run in the browser with no network calls after initial load

### Milestone 2 — Polish & ship

- [ ] Deployed and publicly reachable on GitHub Pages
- [ ] **Mobile first**, responsive layout designed for a standard phone screen
- [ ] Address search and the results panel are comfortable to use one handed on a mobile
- [ ] Empty / edge states handled (address not found, no parcel, tiny parcels, malformed geometry)
- [ ] Clear "not planning advice" disclaimer visible in the UI

### Future / maybe

- [ ] Adjustable setback & coverage inputs to model different rules
- [ ] More than one suburb
- [ ] Height / volume envelope, not just footprint

## How it works

1. Real parcel boundaries for one Auckland area ship as a static GeoJSON file bundled with the app.
2. You search your address (or tap a parcel) on a [MapLibre](https://maplibre.org) map.
3. [Turf.js](https://turfjs.org) insets the boundary by the setback and applies the coverage cap, all client side.
4. A side panel shows the site area, buildable area, and site coverage percentage (both % and m2), and a simple next step.

Parcel data comes from the [LINZ Data Service](https://data.linz.govt.nz). Geometry is projected into NZTM for area calculations, since the WGS84 / web mercator projection is not accurate for local measurements.

## Stack & design decisions

TypeScript, Next.js, React, MapLibre GL JS, Turf.js, Proj4, Tailwind, hosted on GitHub Pages.

Tooling: pnpm, Turborepo, Biome, Vitest.

**Why these choices:**

- **Why React** — Most familiar web framework, it has a mature ecosystem if i need to use react map lifecycle libraries.
- **Why Next.js** — simple but opinionated project structure. Good Dev Ex without committing to a server.
- **Why GitHub Pages** — the app is client only, so static hosting is all it needs. (+ free)
- **Why MapLibre + a free tile provider** — open source, no vendor lockin, free to use.
- **Why client side geometry (Turf.js + Proj4)** — keeps the architecture app simple. There is currently no requirement or user story for any persisted data.

## Run locally

```bash
pnpm install
pnpm dev          # start the web app
```

```bash
pnpm typecheck    # tsc, no emit
pnpm test         # Vitest
pnpm check        # Biome lint + format check
pnpm build        # static export to apps/web/out
```
