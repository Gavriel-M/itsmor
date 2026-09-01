import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, SITE_URL } from "@/lib/site";

/**
 * `output: "export"` requires the metadata route conventions to opt in to static
 * generation explicitly; without this the build fails collecting page data.
 */
export const dynamic = "force-static";

/**
 * Generated into out/sitemap.xml at build time.
 *
 * The site is five pages and every one of them is linked from the nav, so this
 * is not doing heavy lifting for discovery. It is here so robots.txt has
 * something to point at and so a new route has to be added deliberately, in
 * INDEXABLE_ROUTES, rather than appearing by accident — which is exactly how
 * /banner nearly shipped.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
    changeFrequency: "monthly" as const,
  }));
}
