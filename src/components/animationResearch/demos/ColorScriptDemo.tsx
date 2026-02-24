"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { ToggleButton } from "./shared";

const WARM = [
  "#b85b40",
  "#c96b50",
  "#d4845a",
  "#a84e35",
  "#c27755",
  "#b06045",
  "#d19070",
  "#a04530",
];
const COOL = [
  "#004e98",
  "#1a6ab5",
  "#3380c2",
  "#005aa0",
  "#2670b0",
  "#004080",
  "#1570b8",
  "#003878",
];

export default function ColorScriptDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const [isWarm, setIsWarm] = useState(true);
  const palette = isWarm ? WARM : COOL;

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-4 gap-3">
          {palette.map((color, i) =>
            prefersReduced ? (
              <div
                key={i}
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: color }}
              />
            ) : (
              <motion.div
                key={i}
                className="w-8 h-8 rounded-full"
                animate={{
                  backgroundColor: color,
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              />
            )
          )}
        </div>
      </div>
      <div className="pt-3 flex justify-center gap-2">
        <ToggleButton active={isWarm} onClick={() => setIsWarm(true)}>
          Warm
        </ToggleButton>
        <ToggleButton
          active={!isWarm}
          onClick={() => setIsWarm(false)}
          activeColor="lapis"
        >
          Cool
        </ToggleButton>
      </div>
    </div>
  );
}
