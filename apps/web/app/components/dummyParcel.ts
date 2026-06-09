import type { Feature, MultiPolygon, Polygon } from "geojson";
import type { ParcelSelection } from "./MapContainer";

type ParcelGeometry = Polygon | MultiPolygon;

/**
 * Demo helper: builds a fixed buildable result anchored at the given point so
 * that clicking anywhere on the map surfaces a populated parcel, even where no
 * real parcel data exists yet.
 */
export function makeDummyParcel(lngLat: { lng: number; lat: number }): ParcelSelection {
  const half = 0.0002; // ~20m square around the click
  const envelope: Feature<ParcelGeometry> = {
    type: "Feature",
    properties: { id: "dummy" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [lngLat.lng - half, lngLat.lat - half],
          [lngLat.lng + half, lngLat.lat - half],
          [lngLat.lng + half, lngLat.lat + half],
          [lngLat.lng - half, lngLat.lat + half],
          [lngLat.lng - half, lngLat.lat - half],
        ],
      ],
    },
  };

  return {
    id: "dummy",
    address: "Dummy parcel",
    result: {
      siteAreaM2: 650,
      buildableAreaM2: 320,
      coveragePercent: 49,
      envelope,
      isSetbackBinding: true,
      isEmpty: false,
    },
  };
}
