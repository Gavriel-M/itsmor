import type { Metadata } from "next";
import ogCard from "@/assets/og-card.png";

/** itsmor.com 301s here, so www is the host every absolute URL must name. */
export const SITE_URL = "https://www.itsmor.com";
export const SITE_NAME = "itsmor";

const AUTHOR = "Gavriel Mor";
const TITLE = "Gavriel Mor — Full-Stack Engineer";
const TITLE_TEMPLATE = `%s | ${AUTHOR}`;
/**
 * The canonical opener from `07-voice.md > Worked example`, carried verbatim by
 * `02-linkedin.md` and `04-portfolio.md`. Do not reword it here — if the product
 * description changes, change `00-evidence.md` §8 first and propagate.
 *
 * It runs 167 characters, and Google truncates a meta description around 155,
 * so the two slots take different lengths of the same sentence rather than a
 * fourth variant: search gets the first sentence, which is complete on its own,
 * and the social card gets all of it, where the budget is far larger.
 */
const SOCIAL_DESCRIPTION =
  "Second engineer on OrionIQ at Logz.io, an agent platform that investigates " +
  "production and acts on it. I own the interface, and enough of the backend " +
  "to argue about it.";

const META_DESCRIPTION =
  "Second engineer on OrionIQ at Logz.io, an agent platform that investigates " +
  "production and acts on it.";

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
  description: META_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR, url: SITE_URL }],
  creator: AUTHOR,
  alternates: { canonical: "./" },
  ...socialCard(TITLE, SOCIAL_DESCRIPTION, "website"),
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
    description: description ?? META_DESCRIPTION,
    ...socialCard(socialTitle, description ?? SOCIAL_DESCRIPTION, type),
  };
}
