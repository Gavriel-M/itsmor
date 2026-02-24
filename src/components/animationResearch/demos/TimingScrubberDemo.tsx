"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { EASE_OUT_EXPO, EASE_OUT_FAST } from "@/lib/motion/easing";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { PlayButton, DemoLabel } from "./shared";

const TRACKS = [
  { label: "Linear", ease: "linear" as const, color: "bg-black/40" },
  {
    label: "Ease-out",
    ease: EASE_OUT_FAST,
    color: "bg-lapis",
  },
  { label: "Expo", ease: EASE_OUT_EXPO, color: "bg-terracotta" },
];

const DURATION = 0.8;

export default function TimingScrubberDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const [cycle, setCycle] = useState<"idle" | "forward" | "return">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(0);

  const ctrl0 = useAnimationControls();
  const ctrl1 = useAnimationControls();
  const ctrl2 = useAnimationControls();
  const controls = useMemo(() => [ctrl0, ctrl1, ctrl2], [ctrl0, ctrl1, ctrl2]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setRailWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dotSize = 12;
  const travel = Math.max(0, railWidth - dotSize);

  const completedCount = useRef(0);

  const handlePlay = useCallback(() => {
    if (prefersReduced || cycle !== "idle") return;
    setCycle("forward");
    completedCount.current = 0;

    controls.forEach((ctrl, i) => {
      ctrl.start({
        x: travel,
        transition: {
          duration: DURATION,
          ease: TRACKS[i].ease,
        },
      });
    });
  }, [prefersReduced, cycle, controls, travel]);

  const handleForwardComplete = useCallback(() => {
    if (cycle !== "forward") return;
    completedCount.current += 1;
    if (completedCount.current >= TRACKS.length) {
      setCycle("return");
      completedCount.current = 0;

      setTimeout(() => {
        controls.forEach((ctrl) => {
          ctrl.start({
            x: 0,
            transition: { duration: 0.3, ease: "easeOut" },
          });
        });
      }, 200);
    }
  }, [cycle, controls]);

  const handleReturnComplete = useCallback(() => {
    if (cycle !== "return") return;
    completedCount.current += 1;
    if (completedCount.current >= TRACKS.length) {
      setCycle("idle");
    }
  }, [cycle]);

  const handleAnimationComplete = useCallback(() => {
    if (cycle === "forward") {
      handleForwardComplete();
    } else if (cycle === "return") {
      handleReturnComplete();
    }
  }, [cycle, handleForwardComplete, handleReturnComplete]);

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div
        ref={containerRef}
        className="flex-1 flex flex-col justify-center gap-5"
      >
        {TRACKS.map((track, i) => (
          <div key={track.label} className="space-y-1">
            <DemoLabel>{track.label}</DemoLabel>
            <div className="relative h-3">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10" />
              <motion.div
                className={`absolute top-1/2 -translate-y-1/2 rounded-full ${track.color}`}
                style={{ width: dotSize, height: dotSize }}
                initial={{ x: prefersReduced ? travel : 0 }}
                animate={controls[i]}
                onAnimationComplete={handleAnimationComplete}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pt-3 flex justify-center">
        <PlayButton
          onClick={handlePlay}
          disabled={cycle !== "idle" || prefersReduced}
        />
      </div>
    </div>
  );
}
