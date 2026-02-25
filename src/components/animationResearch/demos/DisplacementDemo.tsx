"use client";

import { motion, useAnimationControls } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DemoLabel } from "./shared";

export default function DisplacementDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const shakeControls = useAnimationControls();

  const handleShake = async () => {
    if (prefersReduced) return;
    await shakeControls.start({
      x: [0, -6, 6, -4, 4, -2, 2, 0],
      borderColor: [
        "rgba(0,0,0,0.1)",
        "#b85b40",
        "#b85b40",
        "#b85b40",
        "#b85b40",
        "#b85b40",
        "rgba(0,0,0,0.1)",
        "rgba(0,0,0,0.1)",
      ],
      transition: { duration: 0.5, ease: "easeOut" },
    });
  };

  return (
    <div className="flex items-center justify-center h-full gap-4 p-4">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          whileHover={
            prefersReduced
              ? undefined
              : {
                  y: -6,
                  borderColor: "#b85b40",
                }
          }
          whileTap={
            prefersReduced
              ? undefined
              : {
                  y: -4,
                  scale: 0.98,
                  borderColor: "#b85b40",
                }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 border border-black/10 flex items-center justify-center cursor-pointer"
        >
          <span className="font-mono text-[10px] opacity-40">Hover</span>
        </motion.div>
        <DemoLabel>Lift</DemoLabel>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.div
          whileTap={
            prefersReduced
              ? undefined
              : {
                  scale: 0.96,
                  borderColor: "#b85b40",
                }
          }
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-16 h-16 border border-black/10 flex items-center justify-center cursor-pointer"
        >
          <span className="font-mono text-[10px] opacity-40">Press</span>
        </motion.div>
        <DemoLabel>Press</DemoLabel>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={shakeControls}
          initial={{ borderColor: "rgba(0,0,0,0.1)" }}
          onClick={handleShake}
          className="w-16 h-16 border flex items-center justify-center cursor-pointer"
        >
          <span className="font-mono text-[10px] opacity-40">Click</span>
        </motion.div>
        <DemoLabel>Shake</DemoLabel>
      </div>
    </div>
  );
}
