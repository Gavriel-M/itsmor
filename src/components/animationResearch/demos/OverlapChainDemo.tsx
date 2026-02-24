"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { PlayButton, ToggleButton, useResetKey } from "./shared";

export default function OverlapChainDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const [key, reset] = useResetKey();
  const [playing, setPlaying] = useState(false);
  const [overlapping, setOverlapping] = useState(false);

  const handlePlay = () => {
    reset();
    setPlaying(true);
  };

  const lockstepTransition = {
    duration: 0.4,
    ease: EASE_OUT_EXPO,
  };

  const overlappingTransition = {
    x: {
      duration: 0.35,
      ease: EASE_OUT_EXPO,
    },
    opacity: { duration: 0.2, ease: "easeOut" as const },
    scale: {
      duration: 0.5,
      ease: EASE_OUT_EXPO,
    },
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <motion.div
          key={key}
          initial={
            prefersReduced
              ? { x: 0, opacity: 1, scale: 1 }
              : { x: -120, opacity: 0, scale: 0.92 }
          }
          animate={
            playing || prefersReduced
              ? { x: 0, opacity: 1, scale: 1 }
              : { x: -120, opacity: 0, scale: 0.92 }
          }
          transition={
            prefersReduced
              ? { duration: 0 }
              : overlapping
                ? overlappingTransition
                : lockstepTransition
          }
          onAnimationComplete={() => setPlaying(false)}
          className="border border-black/10 p-4 w-48 space-y-2"
        >
          <div className="h-2 w-3/4 bg-black/10 rounded-sm" />
          <div className="h-2 w-1/2 bg-black/10 rounded-sm" />
          <div className="h-8 w-full bg-black/5 rounded-sm" />
          <div className="h-2 w-2/3 bg-black/10 rounded-sm" />
        </motion.div>
      </div>
      <div className="pt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <ToggleButton
            active={!overlapping}
            onClick={() => {
              if (overlapping) {
                setOverlapping(false);
                reset();
                setPlaying(true);
              }
            }}
          >
            Lockstep
          </ToggleButton>
          <ToggleButton
            active={overlapping}
            onClick={() => {
              if (!overlapping) {
                setOverlapping(true);
                reset();
                setPlaying(true);
              }
            }}
          >
            Overlap
          </ToggleButton>
        </div>
        <PlayButton onClick={handlePlay} disabled={playing || prefersReduced} />
      </div>
    </div>
  );
}
