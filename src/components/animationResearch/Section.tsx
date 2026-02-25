"use client";

import { motion } from "framer-motion";
import { type ResearchSection } from "./types";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

interface SectionProps {
  section: ResearchSection;
}

export default function Section({ section }: SectionProps) {
  const prefersReduced = usePrefersReducedMotion();

  const reveal = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-100px" } as const,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO } as const,
      };

  return (
    <motion.section
      data-section-id={section.id}
      className="mb-20 md:mb-28 scroll-mt-36"
      {...reveal}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-mono text-sm text-terracotta">
          {section.number}
        </span>
        <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-text">
          {section.title}
        </h2>
      </div>

      {section.summary && (
        <p className="font-mono text-sm opacity-60 mb-6 max-w-2xl">
          {section.summary}
        </p>
      )}

      <div className="space-y-4 max-w-2xl">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="font-sans text-base leading-relaxed opacity-90">
            {p}
          </p>
        ))}
      </div>

      {section.callouts && section.callouts.length > 0 && (
        <div className="mt-8 space-y-4">
          {section.callouts.map((callout, i) => (
            <div
              key={i}
              className={`border-l-2 pl-4 py-3 ${
                callout.type === "studio"
                  ? "border-terracotta/40 bg-terracotta/5"
                  : "border-lapis/40 bg-lapis/5"
              }`}
            >
              <p
                className={`font-mono text-xs uppercase tracking-widest mb-2 ${
                  callout.type === "studio" ? "text-terracotta" : "text-lapis"
                }`}
              >
                {callout.type === "studio"
                  ? "Studio Note"
                  : "Implementation Note"}
              </p>
              <p className="font-sans font-semibold text-sm mb-1">
                {callout.title}
              </p>
              <p className="font-sans text-sm leading-relaxed opacity-80">
                {callout.body}
              </p>
              {callout.source && (
                <p className="font-mono text-xs opacity-50 mt-2">
                  {callout.source}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {section.checklist && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-3">
              Use When
            </h4>
            <ul className="space-y-2">
              {section.checklist.useWhen.map((item, i) => (
                <li
                  key={i}
                  className="font-sans text-sm leading-relaxed opacity-80 pl-3 border-l border-terracotta/20"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest mb-3 opacity-60">
              Avoid When
            </h4>
            <ul className="space-y-2">
              {section.checklist.avoidWhen.map((item, i) => (
                <li
                  key={i}
                  className="font-sans text-sm leading-relaxed opacity-80 pl-3 border-l border-black/10"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs text-lapis uppercase tracking-widest mb-3">
              A11y & Perf
            </h4>
            <ul className="space-y-2">
              {section.checklist.a11yPerf.map((item, i) => (
                <li
                  key={i}
                  className="font-sans text-sm leading-relaxed opacity-80 pl-3 border-l border-lapis/20"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </motion.section>
  );
}
