"use client";

import { motion } from "framer-motion";
import { useNavigation } from "@/contexts/NavigationContext";
import Logo from "../ui/Logo";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const { transitionStage, onExitComplete, onEnterComplete } = useNavigation();

  const isAnimating = transitionStage !== "idle";

  return (
    <>
      <div>{children}</div>

      {isAnimating && (
        <motion.div
          className="fixed inset-0 z-100 bg-terracotta flex items-center justify-center"
          initial={{ y: "100%" }}
          animate={{
            y:
              transitionStage === "exiting" || transitionStage === "navigating"
                ? "0%"
                : "-100%",
          }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.34, 1],
          }}
          onAnimationComplete={() => {
            if (transitionStage === "exiting") {
              onExitComplete();
            } else if (transitionStage === "entering") {
              onEnterComplete();
            }
          }}
          style={{ pointerEvents: "none" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.35, 1, 0.36, 1] }}
          >
            <Logo className={`w-14 h-14 md:w-30 md:h-30 text-background`} />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
