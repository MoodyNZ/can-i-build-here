/**
 * Single source of truth for the GitHub Pages project subpath.
 *
 * At build it will use baseUrl require by github pages, and at development it will use the root path.
 *
 * Assumes this app will always run on GitHub Pages, and that the base path will be the same as the repository name.
 * If this ever changes, this file will need to be updated.
 *
 * Note: add a log to warn dev if runtime environment is not github pages when in prod
 */
export const PROD_BASE_PATH = "/can-i-build-here";

export const BASE_PATH = process.env.NODE_ENV === "production" ? PROD_BASE_PATH : "";

if (process.env.NODE_ENV === "production" && !process.env.GITHUB_PAGES) {
  console.error(
    "This app is configured to run on GitHub Pages, but the GITHUB_PAGES environment variable is not set.",
  );
}

export function assetUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}
