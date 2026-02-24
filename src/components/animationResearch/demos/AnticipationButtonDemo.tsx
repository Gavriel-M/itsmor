"use client";

import { motion, useAnimationControls } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DemoLabel } from "./shared";

export default function AnticipationButtonDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const withoutControls = useAnimationControls();
  const withControls = useAnimationControls();

  const handleWithout = async () => {
    if (prefersReduced) return;
    await withoutControls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.25, ease: "easeOut" },
    });
  };

  const handleWith = async () => {
    if (prefersReduced) return;
    await withControls.start({
      scale: [1, 0.93, 1.08, 1.0],
      transition: {
        duration: 0.5,
        times: [0, 0.15, 0.5, 1],
        ease: "easeOut",
      },
    });
  };

  return (
    <div className="flex items-center justify-center h-full gap-6 p-4">
      <div className="flex flex-col items-center gap-2">
        <motion.button
          animate={withoutControls}
          onClick={handleWithout}
          className="px-5 py-2.5 border border-black/10 font-mono text-xs uppercase tracking-widest hover:border-black/30 transition-colors"
        >
          Without
        </motion.button>
        <DemoLabel>Immediate</DemoLabel>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.button
          animate={withControls}
          onClick={handleWith}
          className="px-5 py-2.5 border border-terracotta text-terracotta font-mono text-xs uppercase tracking-widest hover:bg-terracotta/5 transition-colors"
        >
          With
        </motion.button>
        <DemoLabel>Anticipation</DemoLabel>
      </div>
    </div>
  );
}
