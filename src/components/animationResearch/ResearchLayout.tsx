"use client";

import { useState, useEffect, useRef } from "react";
import { type ResearchSection } from "./types";
import Section from "./Section";
import Toc from "./Toc";
import DemoPopover from "./DemoPopover";
import DemoCard from "./DemoCard";

interface ResearchLayoutProps {
  sections: ResearchSection[];
}

export default function ResearchLayout({ sections }: ResearchLayoutProps) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0].id);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialRender = useRef(true);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const targets = content.querySelectorAll<HTMLElement>("[data-section-id]");
    if (targets.length === 0) return;

    const entriesById = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-section-id");
          if (id) entriesById.set(id, entry);
        }

        const visible = Array.from(entriesById.values()).filter(
          (e) => e.isIntersecting
        );
        if (visible.length === 0) return;

        const targetLine =
          (typeof window !== "undefined" ? window.innerHeight : 0) * 0.25;

        const best = visible
          .map((e) => ({
            e,
            d: Math.abs(e.boundingClientRect.top - targetLine),
          }))
          .sort((a, b) => a.d - b.d)[0]?.e;

        const bestId = best?.target.getAttribute("data-section-id");
        if (bestId) setActiveSectionId(bestId);
      },
      {
        rootMargin: "-128px 0px -60% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    history.replaceState(null, "", `#${activeSectionId}`);
  }, [activeSectionId]);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "auto" });
        setActiveSectionId(hash);
      }
    });
  }, []);

  const activeSection = sections.find((s) => s.id === activeSectionId);
  const activeDemoId = activeSection?.demoId;

  return (
    <div className="relative">
      {/* Mobile/tablet: TOC above content */}
      <div className="lg:hidden mb-10">
        <Toc sections={sections} activeSectionId={activeSectionId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Content column */}
        <div ref={contentRef} className="lg:col-span-7">
          {sections.map((section) => (
            <Section key={section.id} section={section} />
          ))}
        </div>

        {/* Desktop: TOC sidebar only */}
        <aside className="hidden lg:block lg:col-span-5 lg:pl-8">
          <div className="sticky top-32 flex flex-col gap-6 max-h-[calc(100vh-10rem)]">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <Toc sections={sections} activeSectionId={activeSectionId} />
            </div>
            <DemoCard demoId={activeDemoId} />
          </div>
        </aside>
      </div>

      <DemoPopover
        className="lg:hidden"
        demoId={activeDemoId}
        title={activeSection?.title}
        hint={activeSection?.demoHint}
        legend={activeSection?.demoLegend}
      />
    </div>
  );
}
