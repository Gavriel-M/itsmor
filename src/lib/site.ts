import type { Metadata } from "next";
import ogCard from "@/assets/og-card.png";

/** itsmor.com 301s here, so www is the host every absolute URL must name. */
export const SITE_URL = "https://www.itsmor.com";
export const SITE_NAME = "itsmor";

const AUTHOR = "Gavriel Mor";
const TITLE = "Gavriel Mor — Full-Stack Engineer";
const TITLE_TEMPLATE = `%s | ${AUTHOR}`;
/**
 * One product, one sentence, shared verbatim with every other place the product
 * is described — so it is not reworded here.
 *
 * It runs 112 characters, inside the ~155 Google truncates a meta description
 * at, so search and the social card carry the same string. If a longer social
 * variant is ever wanted, split it then rather than keeping two names for one
 * value now.
 */
const DESCRIPTION =
  "Full-stack engineer at Logz.io, working on OrionIQ, an agent platform " +
  "that investigates production and acts on it.";

const OG_IMAGE = {
  url: ogCard.src,
  width: ogCard.width,
  height: ogCard.height,
  alt: TITLE,
} as const;

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
      images: [OG_IMAGE],
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
  const { title, description, type = "website", nested } = opts;
  const socialTitle = TITLE_TEMPLATE.replace("%s", title);

  return {
    title: nested ? { default: title, template: TITLE_TEMPLATE } : title,
    description: description ?? DESCRIPTION,
    ...socialCard(socialTitle, description ?? DESCRIPTION, type),
  };
}
