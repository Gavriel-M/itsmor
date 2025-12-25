"use client";

import { motion } from "framer-motion";

const events = [
  { label: "30 YEARS (IL)", year: "1994" },
  { label: "RELOCATING (MUNICH)", year: "2018" },
  { label: "EDUCATION", year: "2020" },
  { label: "CLIMBING", year: "2021" },
  { label: "DESIGN", year: "2024" },
];

export default function Timeline() {
  return (
    <div className="w-full mt-12">
      <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-8">
        Personal Timeline
      </h3>

      <div className="relative h-40 w-full overflow-hidden">
        {/* SVG Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <motion.path
            d="M0,50 L100,50 L150,80 L250,80 L300,20 L400,50 L500,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-terracotta"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Points (Simplified positioning for this aesthetic abstract timeline) */}
        <div className="absolute top-[50px] left-0 -translate-y-1/2">
          <div className="w-3 h-3 bg-terracotta rounded-full" />
          <span className="absolute top-4 left-0 font-mono text-xs whitespace-nowrap">
            30 YEARS (IL)
          </span>
        </div>

        <div className="absolute top-[80px] left-[150px] -translate-y-1/2">
          <div className="w-2 h-2 bg-lapis rounded-full" />
          <span className="absolute top-4 left-0 font-mono text-xs whitespace-nowrap">
            RELOCATING
          </span>
        </div>

        <div className="absolute top-[20px] left-[300px] -translate-y-1/2">
          <div className="w-2 h-2 bg-lapis rounded-full" />
          <span className="absolute bottom-3 left-0 font-mono text-xs whitespace-nowrap">
            CLIMBING
          </span>
        </div>

        <div className="absolute top-[10px] left-[500px] -translate-y-1/2">
          <div className="w-3 h-3 bg-terracotta rounded-full" />
          <span className="absolute top-4 right-0 font-mono text-xs whitespace-nowrap">
            DESIGN
          </span>
        </div>
      </div>
    </div>
  );
}
