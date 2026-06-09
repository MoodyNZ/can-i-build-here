import { describe, expect, it } from "vitest";
import { assetUrl, BASE_PATH } from "./basePath";

describe("assetUrl", () => {
  it("prefixes an absolute public path with the base path", () => {
    expect(assetUrl("/data/parcels.geojson")).toBe(`${BASE_PATH}/data/parcels.geojson`);
  });

  it("normalises a path that is missing its leading slash", () => {
    expect(assetUrl("data/parcels.geojson")).toBe(`${BASE_PATH}/data/parcels.geojson`);
  });
});
