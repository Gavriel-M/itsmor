import { routeMetadata } from "@/lib/site";
import { sections } from "@/data/animationResearchContent";
import ResearchLayout from "@/components/animationResearch/ResearchLayout";
import HeroHeader from "@/components/animationResearch/HeroHeader";

/**
 * Both strings are the page's own, lifted from the work index entry and from
 * HeroHeader's standfirst rather than written fresh. This is the only page on
 * the site with an argument long enough to be worth finding on its own terms.
 */
export const metadata = routeMetadata({
  title: "2D Animation on the Web",
  description:
    "Translating classical animation principles into the constraints and " +
    "opportunities of web UI motion — timing, easing, staging, and perception.",
  type: "article",
});

export default function AnimationResearchPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20">
      <div className="max-w-screen-xl mx-auto">
        <HeroHeader />
        <ResearchLayout sections={sections} />
      </div>
    </section>
  );
}
