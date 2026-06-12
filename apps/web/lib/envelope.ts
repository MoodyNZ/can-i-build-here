import type { Feature, MultiPolygon, Polygon } from "geojson";

// TODO: replace these mocks with the real methods
export type ParcelGeometry = Polygon | MultiPolygon;

export type SquareMetres = number & { readonly __unit: "m²" };

export const squareMetres = (value: number): SquareMetres => value as SquareMetres;

export type EnvelopeResult = {
  siteArea: SquareMetres;
  buildableArea: SquareMetres;
  /** Buildable area as a fraction of site area, 0–1. */
  coverageRatio: number;
  envelope: Feature<ParcelGeometry> | null;
  isSetbackBinding: boolean;
  isEmpty: boolean;
};

export type ParcelSelection = {
  id: string;
  address: string | null;
  result: EnvelopeResult;
};

export function computeBuildableEnvelope(_parcel: Feature<ParcelGeometry>): EnvelopeResult {
  return {
    siteArea: squareMetres(0),
    buildableArea: squareMetres(0),
    coverageRatio: 0,
    envelope: null,
    isSetbackBinding: false,
    isEmpty: true,
  };
}
