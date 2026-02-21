"use client";

import { motion } from "framer-motion";
import { useNavigation } from "@/contexts/NavigationContext";
import Logo from "../ui/Logo";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const { transitionStage, onExitComplete, targetPath } = useNavigation();

  const isActive = transitionStage !== "idle";

  // Top bar: left → center → right
  const topBarX =
    transitionStage === "exiting" || transitionStage === "navigating"
      ? "0%"
      : transitionStage === "entering"
        ? "100%"
        : "-100%"; // idle: parked offscreen left

  // Bottom bar: right → center → left
  const bottomBarX =
    transitionStage === "exiting" || transitionStage === "navigating"
      ? "0%"
      : transitionStage === "entering"
        ? "-100%"
        : "100%"; // idle: parked offscreen right

  const barDuration =
    transitionStage === "idle"
      ? 0 // instant snap back to start position
      : transitionStage === "entering"
        ? 0.35
        : 0.4;

  // 60ms stagger on bottom bar only during entry
  const bottomDelay = transitionStage === "exiting" ? 0.06 : 0;

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  // Center content visible during exiting and navigating, fades during entering
  const contentVisible =
    transitionStage === "exiting" || transitionStage === "navigating";

  return (
    <>
      <div>{children}</div>

      <div
        className="fixed inset-0 z-100 overflow-hidden"
        style={{ pointerEvents: isActive ? "auto" : "none" }}
        aria-hidden="true"
      >
        {/* Top bar — upper half */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1/2 bg-terracotta"
          initial={false}
          animate={{ x: topBarX }}
          transition={{ duration: barDuration, ease }}
        />

        {/* Bottom bar — lower half */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-terracotta"
          initial={false}
          animate={{ x: bottomBarX }}
          transition={{ duration: barDuration, ease, delay: bottomDelay }}
          onAnimationComplete={() => {
            if (transitionStage === "exiting") {
              onExitComplete();
            }
          }}
        />

        {/* Center content: horizontal rule + logo */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* 1px horizontal center rule */}
            <motion.div
              className="absolute left-0 w-full h-px bg-background"
              style={{ top: "50%" }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: contentVisible ? 1 : 0,
                opacity: contentVisible ? 1 : 0,
              }}
              transition={{
                duration: contentVisible ? 0.35 : 0.15,
                ease,
              }}
            />

            {/* Logo */}
            <motion.div
              key={targetPath}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={
                contentVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.85 }
              }
              transition={{
                duration: contentVisible ? 0.35 : 0.15,
                ease,
              }}
            >
              <Logo className="w-14 h-14 md:w-30 md:h-30 text-background" />
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
