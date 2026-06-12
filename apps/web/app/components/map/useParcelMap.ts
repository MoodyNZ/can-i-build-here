"use client";

import type { Feature, FeatureCollection } from "geojson";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";
import {
  computeBuildableEnvelope,
  type ParcelGeometry,
  type ParcelSelection,
} from "@/lib/envelope";
import {
  EMPTY_GEOJSON,
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAP_STYLE,
  STATIC_PARCELS_DATA,
} from "./mapConfig";

export type ParcelMapHandlers = {
  onSelect?: (selection: ParcelSelection | null) => void;
};

/**
 * Owns the maplibre instance lifecycle and wires parcel selection.
 *
 * Maplibre is an JS lib, so we hook it into the React lifecycle here.
 *
 * Be careful with cleanup ordering and accessing the instance in other effects
 * since maplibre is async and event driven.
 *
 * @returns a ref
 */
export function useParcelMap(handlers: ParcelMapHandlers = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Create stable function refs
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Used to protect react lifecycle and maplibre JS eventing.
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

    const clearSelection = () => {
      map.setFilter("parcels-selected", ["==", ["get", "id"], ""]);
      (map.getSource("envelope") as maplibregl.GeoJSONSource).setData(EMPTY_GEOJSON);
      handlersRef.current.onSelect?.(null);
    };

    // Note: This is an async handler, and exists outside of the react lifecycle,
    // We need a JS variable to track this
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
        handlersRef.current.onSelect?.({
          id,
          address: typeof address === "string" ? address : null,
          result,
        });
      });

      map.on("click", (e) => {
        if (map.queryRenderedFeatures(e.point, { layers: ["parcels-fill"] }).length === 0) {
          clearSelection();
        }
      });

      map.on("mouseenter", "parcels-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "parcels-fill", () => {
        map.getCanvas().style.cursor = "";
      });
    });

    return () => {
      // The `load` handler is async, so it may still be in flight when this runs.
      // Use a JS variable to track whether the map is active. This will prevent map.remove() is undefined and other map errors
      active = false;
      // Tears down the maplibre instance: removes the canvas, event listeners, sources, layers. Safe to call even ifthe map never finished loading.
      map.remove();
    };
  }, []);

  return containerRef;
}
