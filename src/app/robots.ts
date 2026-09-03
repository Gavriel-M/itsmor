import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /cv is not disallowed here despite being noindexed: a disallow stops the
 * crawl, so the crawler never reads the noindex and the bare URL can still
 * surface.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
