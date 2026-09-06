import { routeMetadata } from "@/lib/site";
import CvHeader from "@/components/cv/CvHeader";
import CvDocument from "@/components/cv/CvDocument";

export const metadata = routeMetadata({
  title: "CV",
  description:
    "Full-stack engineer at Logz.io. Second engineer on OrionIQ, an agent " +
    "platform that investigates production and acts on it.",
});

export default function CvPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20">
      <div className="max-w-screen-xl mx-auto w-full">
        <CvHeader />
        <div className="mt-14">
          <CvDocument />
        </div>
      </div>
    </section>
  );
}
