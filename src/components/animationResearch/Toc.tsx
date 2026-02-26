"use client";

import { useEffect, useRef, useState } from "react";
import { type ResearchSection } from "./types";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

interface TocProps {
  sections: ResearchSection[];
  activeSectionId: string;
}

export default function Toc({ sections, activeSectionId }: TocProps) {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    const container = navRef.current?.parentElement;
    if (!el || !container) return;
    if (container.scrollHeight <= container.clientHeight + 1) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offset = elRect.top - containerRect.top + container.scrollTop;

    container.scrollTo({
      top: offset - container.clientHeight / 2 + el.clientHeight / 2,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, [activeSectionId, prefersReduced]);

  const handleClick = (id: string) => {
    const el = document.querySelector(`[data-section-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      history.replaceState(null, "", `#${id}`);
    }
    setIsOpen(false);
  };

  return (
    <nav ref={navRef} aria-label="Table of contents">
      {/* Mobile: collapsible accordion */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center justify-between w-full font-mono text-xs uppercase tracking-widest py-3 border-b border-black/10"
        aria-expanded={isOpen}
      >
        <span>Contents</span>
        <span
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          &darr;
        </span>
      </button>

      {/* Desktop: always visible. Mobile: toggleable */}
      <ul className={`space-y-1 ${isOpen ? "block" : "hidden"} lg:block`}>
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          return (
            <li key={section.id}>
              <button
                ref={isActive ? activeRef : undefined}
                onClick={() => handleClick(section.id)}
                aria-current={isActive ? "true" : undefined}
                className={`w-full text-left py-1.5 px-3 font-sans text-sm transition-colors duration-150 border-l-2 ${
                  isActive
                    ? "border-terracotta text-terracotta"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <span className="font-mono text-xs mr-2">{section.number}</span>
                <span className="leading-snug wrap-break-word">
                  {section.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
