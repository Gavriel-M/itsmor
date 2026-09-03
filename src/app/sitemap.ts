import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
    changeFrequency: "monthly" as const,
  }));
}
