import { routeMetadata } from "@/lib/site";
import CvInterim from "@/components/cv/CvInterim";

/**
 * INTERIM STATE. This route used to embed and offer public/gavriel-mor-cv.pdf
 * for download. That file was the April 2026 draft — "Software Engineer –
 * Frontend", "over 2 years of experience", "seeking a mid-level role in Munich"
 * — which contradicts every other surface and argues against him. The PDF has
 * been removed from public/ as well as unlinked, because the route is not the
 * exposure: /gavriel-mor-cv.pdf was served directly by S3 and gating the page
 * alone would have left that URL live and guessable.
 *
 * noindex is here so the interim state does not get indexed under his name and
 * then outlive itself in search results. Drop the robots key when the real CV
 * lands.
 *
 * The route itself stays, rather than 404ing, because it is the URL that gets
 * pasted into an application form, and a dead link reads as carelessness.
 *
 * To restore: `git show 2cd2bad:src/app/cv/page.tsx` and
 * `git checkout 2cd2bad -- public/gavriel-mor-cv.pdf`.
 */
export const metadata = {
  ...routeMetadata({ title: "CV" }),
  robots: { index: false, follow: false },
};

export default function CvPage() {
  return <CvInterim />;
}
