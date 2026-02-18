"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimelineEvent {
  label: string;
  year: string;
  yPosition: number; // 0-1 normalized (0=top, 1=bottom)
  emphasis: "primary" | "secondary";
}

const EVENTS: TimelineEvent[] = [
  { label: "30 YEARS (IL)", year: "1994", yPosition: 0.4, emphasis: "primary" },
  { label: "RELOCATING", year: "2018", yPosition: 0.6, emphasis: "secondary" },
  { label: "EDUCATION", year: "2020", yPosition: 0.5, emphasis: "secondary" },
  { label: "CLIMBING", year: "2021", yPosition: 0.2, emphasis: "secondary" },
  { label: "DESIGN", year: "2024", yPosition: 0.15, emphasis: "primary" },
];

const PADDING_X = 40;
const PADDING_Y = 30;

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // Calculate positions for each event
  const positions = EVENTS.map((event, i) => {
    const usableWidth = dimensions.width - PADDING_X * 2;
    const x =
      EVENTS.length > 1
        ? PADDING_X + (i / (EVENTS.length - 1)) * usableWidth
        : dimensions.width / 2;
    const usableHeight = dimensions.height - PADDING_Y * 2;
    const y = PADDING_Y + event.yPosition * usableHeight;
    return { x, y };
  });

  // Generate SVG path from positions (straight line segments)
  const pathD =
    positions.length > 0 && dimensions.width > 0
      ? positions
          .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`)
          .join(" ")
      : "";

  return (
    <div className="w-full mt-12">
      <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-8">
        Personal Timeline
      </h3>

      <div ref={containerRef} className="relative h-40 w-full overflow-visible">
        {dimensions.width > 0 && (
          <>
            {/* SVG Line */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
              <motion.path
                d={pathD}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-terracotta"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>

            {/* Event dots + labels */}
            {EVENTS.map((event, i) => {
              const pos = positions[i];
              const isPrimary = event.emphasis === "primary";
              const labelBelow = event.yPosition <= 0.5;

              return (
                <div
                  key={event.year + event.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pos.x, top: pos.y }}
                >
                  {/* Dot */}
                  <div
                    className={`rounded-full ${
                      isPrimary ? "w-3 h-3 bg-terracotta" : "w-2 h-2 bg-lapis"
                    }`}
                  />

                  {/* Label */}
                  <span
                    className={`absolute left-0 font-mono text-xs whitespace-nowrap ${
                      labelBelow ? "top-4" : "bottom-3"
                    }`}
                  >
                    {event.label}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
