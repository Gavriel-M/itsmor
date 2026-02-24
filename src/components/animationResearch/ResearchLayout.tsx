"use client";

import { useState, useEffect, useRef } from "react";
import { type ResearchSection } from "./types";
import Section from "./Section";
import Toc from "./Toc";
import DemoCard from "./DemoCard";

interface ResearchLayoutProps {
  sections: ResearchSection[];
}

export default function ResearchLayout({ sections }: ResearchLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const targets = content.querySelectorAll<HTMLElement>("[data-section-id]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-section-id");
          if (id) setActiveSectionId(id);
        }
      },
      { rootMargin: "-128px 0px -60% 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  const activeSection = sections.find((s) => s.id === activeSectionId);
  const activeDemoId = activeSection?.demoId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Content column */}
      <div ref={contentRef} className="md:col-span-7">
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>

      {/* Sidebar column */}
      <aside className="md:col-span-5 md:pl-8">
        <div className="sticky top-32 flex flex-col gap-6 max-h-[calc(100vh-10rem)]">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Toc sections={sections} activeSectionId={activeSectionId} />
          </div>
          <DemoCard demoId={activeDemoId} />
        </div>
      </aside>
    </div>
  );
}
