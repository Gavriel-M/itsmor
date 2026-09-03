import type { Metadata } from "next";

/** itsmor.com 301s here, so www is the host every absolute URL must name. */
export const SITE_URL = "https://www.itsmor.com";
export const SITE_NAME = "itsmor";

const AUTHOR = "Gavriel Mor";
const TITLE = "Gavriel Mor — Full-Stack Engineer";
const TITLE_TEMPLATE = `%s | ${AUTHOR}`;
const DESCRIPTION =
  "Second engineer on OrionIQ at Logz.io, an agent that takes an alert and " +
  "works out what broke. I own the interface end to end, and enough of the " +
  "backend to argue about it.";

/** Drives sitemap.ts. /cv is absent because it is noindexed. */
export const INDEXABLE_ROUTES = [
  "/",
  "/work",
  "/work/2d-web-animation",
  "/about",
  "/contact",
] as const;

const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: TITLE,
} as const;

const TWITTER_IMAGE = { ...OG_IMAGE, url: "/twitter-image.png" } as const;

function socialCard(title: string, description: string, type: OgType) {
  return {
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: "./",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [TWITTER_IMAGE],
    },
  };
}

type OgType = "website" | "article";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: TITLE_TEMPLATE },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR, url: SITE_URL }],
  creator: AUTHOR,
  alternates: { canonical: "./" },
  ...socialCard(TITLE, DESCRIPTION, "website"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/itsmor-logo-full-split.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/itsmor-logo-full-split.svg",
  },
};

/**
 * Complete metadata for one route. There is no partial form on purpose: a child
 * segment's `openGraph` replaces the parent's rather than merging, so a partial
 * one drops og:image and og:url, and omitting it entirely leaves the route
 * claiming the homepage's og:title.
 *
 * `nested` is for a layout with children — resolving a plain-string title
 * consumes the parent's template and passes nothing down.
 */
export function routeMetadata(opts: {
  title: string;
  description?: string;
  type?: OgType;
  nested?: boolean;
}): Metadata {
  const { title, description = DESCRIPTION, type = "website", nested } = opts;
  const social = TITLE_TEMPLATE.replace("%s", title);

  return {
    title: nested ? { default: title, template: TITLE_TEMPLATE } : title,
    description,
    ...socialCard(social, description, type),
  };
}
