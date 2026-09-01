import type { Metadata } from "next";

/**
 * Canonical origin for the live site.
 *
 * itsmor.com 301s to www.itsmor.com, so www is the host every absolute URL has
 * to name. Verified 1 Sep 2026:
 *   curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://itsmor.com/
 *   → 301 https://www.itsmor.com/
 */
export const SITE_URL = "https://www.itsmor.com";

/**
 * Every route the site publishes, minus /cv, which is noindexed while it serves
 * an interim state. Kept here so the sitemap and any future route audit read
 * from one list rather than drifting apart.
 */
export const INDEXABLE_ROUTES = [
  "/",
  "/work",
  "/work/2d-web-animation",
  "/about",
  "/contact",
] as const;

/**
 * Tab and search-result title.
 *
 * TITLE_TEMPLATE has to be re-declared by any layout that sets its own title,
 * because a segment that resolves a plain-string title consumes the parent's
 * template and passes nothing down — which is how /work/2d-web-animation ended
 * up titled "2D Animation on the Web" with the name missing.
 */
export const NAME = "Gavriel Mor";
export const TITLE = "Gavriel Mor — Full-Stack Engineer";
export const TITLE_TEMPLATE = `%s | ${NAME}`;

/**
 * PROVISIONAL. The approved About opening from ~/logzio/career/02-linkedin.md,
 * reused verbatim rather than invented, because the portfolio's own copy spec is
 * still being written. It is the right register for a search result and a pasted
 * link — domain first, one concrete action a reader can picture. If the copy spec
 * lands a portfolio-specific line, this is the string it replaces.
 */
export const DESCRIPTION =
  "Second engineer on OrionIQ at Logz.io, an agent that takes an alert and " +
  "works out what broke. I own the interface end to end, and enough of the " +
  "backend to argue about it.";

/** The link-preview card, built by tools/og-card.html. */
const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: TITLE,
} as const;

const TWITTER_IMAGE = { ...OG_IMAGE, url: "/twitter-image.png" } as const;

/**
 * Complete metadata for one route.
 *
 * This exists because of a defect that shipped twice. A child segment's
 * `openGraph` object REPLACES the parent's rather than merging into it, so any
 * route that declares a partial one silently drops og:image, og:site_name,
 * og:locale and og:url. Declaring *no* openGraph is just as wrong the other way:
 * the route then inherits the root's og:title, and every page's social card
 * claims to be the homepage.
 *
 * There is no partial form of this call, so neither mistake is reachable. Any
 * new route should use it rather than hand-rolling a metadata object.
 *
 * `nested` controls the title shape. A plain-string title lets the parent's
 * template apply, which is what a leaf route wants. A segment with children has
 * to re-declare the template, because resolving a plain string consumes the
 * parent's and passes nothing down.
 */
export function routeMetadata(opts: {
  /** Bare route title, e.g. "Work". The name is appended by the template. */
  title: string;
  description?: string;
  type?: "website" | "article";
  /** True for a layout whose children need the title template. */
  nested?: boolean;
}): Metadata {
  const { title, description = DESCRIPTION, type = "website", nested } = opts;
  // og:title and twitter:title take no template, so the name goes in by hand.
  const social = TITLE_TEMPLATE.replace("%s", title);

  return {
    title: nested ? { default: title, template: TITLE_TEMPLATE } : title,
    description,
    openGraph: {
      type,
      siteName: "itsmor",
      title: social,
      description,
      url: "./",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}
