import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Auto-cleanup isn't wired up without `globals`, so unmount between tests to
// avoid leaking rendered DOM across cases.
afterEach(() => {
  cleanup();
});
