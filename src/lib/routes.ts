/**
 * Every route the sitemap advertises.
 *
 * Kept free of bundler-only imports so `tools/check-routes.mjs` can read it
 * from plain Node and compare it against what the export actually publishes.
 */
export const INDEXABLE_ROUTES = [
  "/",
  "/work",
  "/work/2d-web-animation",
  "/about",
  "/contact",
  "/cv",
] as const;
