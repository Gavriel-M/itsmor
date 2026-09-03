import { routeMetadata } from "@/lib/site";
import { ARTICLE, sections } from "@/data/animationResearchContent";
import ResearchLayout from "@/components/animationResearch/ResearchLayout";
import HeroHeader from "@/components/animationResearch/HeroHeader";

export const metadata = routeMetadata({
  title: ARTICLE.title,
  description: ARTICLE.standfirst,
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
