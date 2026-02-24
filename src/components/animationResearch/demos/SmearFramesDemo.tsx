"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { PlayButton, ToggleButton, useResetKey } from "./shared";

const CIRCLE_SIZE = 40;

export default function SmearFramesDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const [key, reset] = useResetKey();
  const [playing, setPlaying] = useState(false);
  const [withSmear, setWithSmear] = useState(false);

  const handlePlay = () => {
    reset();
    setPlaying(true);
  };

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-full relative h-12 flex items-center justify-center">
          <motion.div
            key={key}
            className="bg-terracotta rounded-full"
            style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
            initial={{ x: 0 }}
            animate={
              playing && !prefersReduced
                ? {
                    x: [0, 80, 0, -80, 0],
                    ...(withSmear
                      ? {
                          scaleX: [1, 1.4, 1, 1.4, 1],
                          scaleY: [1, 0.85, 1, 0.85, 1],
                        }
                      : {}),
                  }
                : { x: 0 }
            }
            transition={
              prefersReduced
                ? { duration: 0 }
                : {
                    duration: 0.8,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.5, 0.75, 1],
                    repeat: 0,
                  }
            }
            onAnimationComplete={() => setPlaying(false)}
          />
        </div>
      </div>
      <div className="pt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <ToggleButton active={!withSmear} onClick={() => setWithSmear(false)}>
            No Smear
          </ToggleButton>
          <ToggleButton active={withSmear} onClick={() => setWithSmear(true)}>
            With Smear
          </ToggleButton>
        </div>
        <PlayButton onClick={handlePlay} disabled={playing || prefersReduced} />
      </div>
    </div>
  );
}
