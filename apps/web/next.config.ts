import type { NextConfig } from "next";
import { BASE_PATH } from "./lib/basePath";

/**
 * Static export for GitHub Pages.
 *
 * Served at the root of the project Pages site:
 *   https://moodynz.github.io/can-i-build-here/
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
