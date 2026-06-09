"use client";

import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import { assetUrl } from "@/lib/basePath";
import { makeDummyParcel } from "./dummyParcel";

// TODO: replace these mocks with the real methods
type ParcelGeometry = Polygon | MultiPolygon;

type EnvelopeResult = {
  siteAreaM2: number;
  buildableAreaM2: number;
  coveragePercent: number;
  envelope: Feature<ParcelGeometry> | null;
  isSetbackBinding: boolean;
  isEmpty: boolean;
};

/** No-op stub: returns an empty envelope until the real logic is wired back in. */
function computeBuildableEnvelope(_parcel: Feature<ParcelGeometry>): EnvelopeResult {
  return {
    siteAreaM2: 0,
    buildableAreaM2: 0,
    coveragePercent: 0,
    envelope: null,
    isSetbackBinding: false,
    isEmpty: true,
  };
}

const STATIC_PARCELS_DATA = assetUrl("/data/parcels.geojson");

const INITIAL_CENTER: [number, number] = [174.7441, -36.8581];
const INITIAL_ZOOM = 16.5;

const EMPTY_GEOJSON: FeatureCollection = { type: "FeatureCollection", features: [] };

const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const MAP_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: OSM_ATTRIBUTION,
    },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#eceae4" } },
    { id: "osm", type: "raster", source: "osm" },
  ],
};

export type ParcelSelection = {
  id: string;
  address: string | null;
  result: EnvelopeResult;
};

export function MapContainer({
  onSelect,
}: {
  onSelect?: (selection: ParcelSelection | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Keep the latest callback without re-running the map setup effect.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /**
   * Side Effect:
   *
   * Maplibre is a JS lib and needs to hook into the react lifecycle
   * Here we attach to a DOM node which is what
   *
   * Be careful with cleanup ordering and accessing the instance in other useEffects
   * Since maplibre is async event driven
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;
    const byId: Record<string, Feature<ParcelGeometry>> = {};

    const map = new maplibregl.Map({
      container,
      style: MAP_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", async () => {
      const collection = (await fetch(STATIC_PARCELS_DATA).then((r) =>
        r.json(),
      )) as FeatureCollection<ParcelGeometry>;
      if (!active) return;

      for (const feature of collection.features) {
        const id = feature.properties?.id;
        if (typeof id === "string") byId[id] = feature;
      }

      map.addSource("parcels", { type: "geojson", data: collection });
      map.addSource("envelope", { type: "geojson", data: EMPTY_GEOJSON });

      map.addLayer({
        id: "parcels-fill",
        type: "fill",
        source: "parcels",
        paint: { "fill-color": "#c9cdd3", "fill-opacity": 0.6 },
      });
      map.addLayer({
        id: "parcels-line",
        type: "line",
        source: "parcels",
        paint: { "line-color": "#5b6470", "line-width": 1.5 },
      });
      map.addLayer({
        id: "parcels-selected",
        type: "line",
        source: "parcels",
        filter: ["==", ["get", "id"], ""],
        paint: { "line-color": "#0f766e", "line-width": 3 },
      });
      map.addLayer({
        id: "envelope-fill",
        type: "fill",
        source: "envelope",
        paint: { "fill-color": "#14b8a6", "fill-opacity": 0.5 },
      });

      map.on("click", "parcels-fill", (e) => {
        const id = e.features?.[0]?.properties?.id;
        if (typeof id !== "string") return;
        const feature = byId[id];
        if (!feature) return;

        const result = computeBuildableEnvelope(feature);
        map.setFilter("parcels-selected", ["==", ["get", "id"], id]);
        (map.getSource("envelope") as maplibregl.GeoJSONSource).setData(
          result.envelope ?? EMPTY_GEOJSON,
        );

        const address = feature.properties?.address;
        onSelectRef.current?.({
          id,
          address: typeof address === "string" ? address : null,
          result,
        });
      });

      map.on("click", (e) => {
        if (map.queryRenderedFeatures(e.point, { layers: ["parcels-fill"] }).length > 0) return;

        const dummy = makeDummyParcel(e.lngLat);
        map.setFilter("parcels-selected", ["==", ["get", "id"], ""]);
        (map.getSource("envelope") as maplibregl.GeoJSONSource).setData(
          dummy.result.envelope ?? EMPTY_GEOJSON,
        );
        onSelectRef.current?.(dummy);
      });

      map.on("mouseenter", "parcels-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "parcels-fill", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      active = false;
      map.remove();
    };
  }, []);

  // Add styles to ensure map has an absolute height to scale to, or it will render as 0x0
  return <div ref={containerRef} className="h-full w-full" />;
}
