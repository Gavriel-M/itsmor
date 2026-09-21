/**
 * The published CV set: one declaration serving the page, the download block and
 * the check that verifies both against the files on disk.
 *
 * Deliberately free of bundler-only imports so `tools/check-cv.mjs` can read it
 * from plain Node, the same way `routes.ts` is read by the route check.
 *
 * `pnpm cv:check` asserts every value here against the actual PDFs. The sizes and
 * page counts used to be hand-written numbers that went stale on the next export
 * while nothing failed, and `hasPhoto` exists because the export filenames and the
 * published filenames do not mean the same thing — `CV.pdf` is the photographed
 * variant on the way out and the unphotographed one once published. Copying by
 * name puts the photographed CV behind the primary download, which is the one
 * outcome the default exists to prevent, and both files are valid CVs so nothing
 * else would notice.
 */

/** Bumped on every re-export: deploy.sh caches non-HTML for a year. */
export const CV_VERSION = "2026-09-21";

export const CV_PUBLIC_DIR = `public/cv/${CV_VERSION}`;

export interface CvFile {
  /** Published filename, which is also the filename the browser saves. */
  filename: string;
  /** Whether this variant embeds the photograph. */
  hasPhoto: boolean;
  pages: number;
  /** As rendered, in KiB rounded to whole units. */
  size: string;
}

export const CV_PRIMARY: CvFile = {
  filename: "Gavriel-Mor-Full-Stack-Engineer-CV.pdf",
  hasPhoto: false,
  pages: 2,
  size: "194 KB",
};

export const CV_ALTERNATES: (CvFile & { what: string })[] = [
  {
    filename: "Gavriel-Mor-Full-Stack-Engineer-CV-Photo.pdf",
    what: "With photo",
    hasPhoto: true,
    pages: 2,
    size: "209 KB",
  },
  {
    filename: "Gavriel-Mor-Full-Stack-Engineer-CV-Plain.pdf",
    what: "Single column",
    hasPhoto: false,
    pages: 3,
    size: "186 KB",
  },
];

export const CV_FILES: CvFile[] = [CV_PRIMARY, ...CV_ALTERNATES];

export const cvHref = (filename: string) => `/cv/${CV_VERSION}/${filename}`;

/**
 * The stats strip. Floors rather than exact figures: the precise counts were two
 * behind within a day of shipping and a reader cannot verify the digit anyway.
 * These strings must read identically in the PDFs — the page is a port of the
 * same source, and nothing but a re-export keeps them together.
 */
export const CV_STATS = [
  { value: "790+", label: "PRs merged" },
  { value: "700+", label: "tickets shipped" },
  { value: "30+", label: "design docs authored" },
];
