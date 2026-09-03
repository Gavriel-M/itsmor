import { routeMetadata } from "@/lib/site";
import CvInterim from "@/components/cv/CvInterim";

/**
 * Interim state. The PDF this route used to serve was the April draft, and it
 * was deleted from public/ as well as unlinked — S3 served the file path
 * directly, so gating the page alone would have left it reachable.
 * Restore: `git show 2cd2bad:src/app/cv/page.tsx`.
 */
export const metadata = {
  ...routeMetadata({ title: "CV" }),
  robots: { index: false, follow: false },
};

export default function CvPage() {
  return <CvInterim />;
}
