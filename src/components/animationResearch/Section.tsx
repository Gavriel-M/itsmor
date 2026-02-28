"use client";

import { motion } from "framer-motion";
import { type ResearchSection } from "./types";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { TextCascade } from "text-cascade";

interface SectionProps {
  section: ResearchSection;
}

export default function Section({ section }: SectionProps) {
  const prefersReduced = usePrefersReducedMotion();

  const revealProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 } as const,
        whileInView: { opacity: 1, y: 0 } as const,
        viewport: { once: true, margin: "-100px" } as const,
        transition: { duration: 0.6, ease: EASE_OUT_EXPO } as const,
      };

  return (
    <motion.section
      id={section.id}
      data-section-id={section.id}
      className="mb-20 md:mb-28 scroll-mt-36"
      {...revealProps}
    >
      <div className="group flex items-baseline gap-3 mb-4">
        <span className="font-mono text-sm text-terracotta">
          {section.number}
        </span>
        <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-text">
          {section.title}
        </h2>
        <TextCascade
          as="button"
          hoverText="Copy"
          clickText="Copied"
          onClick={() => {
            const url = `${window.location.origin}${window.location.pathname}#${section.id}`;
            navigator.clipboard.writeText(url);
          }}
          textClassName="pl-1.5 font-mono"
          className="group/copy flex items-center self-end mb-1 text-terracotta cursor-pointer"
          aria-label={`Copy link to ${section.title}`}
          glowClassName="text-gold"
          cascadeWeight={600}
          trigger={({ clicked }) => (
            <span className="relative w-[14px] h-[14px]">
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${clicked ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${clicked ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </span>
          )}
        />
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
