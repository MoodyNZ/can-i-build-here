import type { FeatureCollection } from "geojson";
import type { StyleSpecification } from "maplibre-gl";
import { assetUrl } from "@/lib/basePath";

export const STATIC_PARCELS_DATA = assetUrl("/data/parcels.geojson");

export const INITIAL_CENTER: [number, number] = [174.7441, -36.8581];
export const INITIAL_ZOOM = 16.5;

export const EMPTY_GEOJSON: FeatureCollection = { type: "FeatureCollection", features: [] };

const OSM_ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_STYLE: StyleSpecification = {
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
