import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * Served at the root of the project Pages site:
 *   https://moodynz.github.io/can-i-build-here/
 *
 * `basePath` is applied in every environment so the exported HTML is
 * deterministic (this is what makes assets resolve under /can-i-build-here/
 * once deployed). `next dev` therefore also serves under that path.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/can-i-build-here",
  trailingSlash: true,
  images: {
    // Required for static export — the default image optimizer needs a server.
    unoptimized: true,
  },
};

export default nextConfig;
