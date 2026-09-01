import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * `output: "export"` requires the metadata route conventions to opt in to static
 * generation explicitly; without this the build fails collecting page data.
 */
export const dynamic = "force-static";

/**
 * Generated into out/robots.txt at build time — the static export supports the
 * metadata route conventions.
 *
 * /cv is deliberately NOT disallowed here even though it must not be indexed. A
 * robots.txt disallow stops the crawl, which means the crawler never reads the
 * noindex on that page and the URL can still surface as a bare link. Noindex is
 * the right tool and it needs the page to stay crawlable.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
