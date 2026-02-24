"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { DEMO_MAP } from "./demos";
import type { DemoId } from "./types";

interface DemoCardProps {
  demoId: DemoId | undefined;
}

export default function DemoCard({ demoId }: DemoCardProps) {
  const DemoComponent = demoId ? DEMO_MAP[demoId] : undefined;

  return (
    <div className="border border-black/10 bg-background aspect-[4/3] flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {DemoComponent ? (
          <motion.div
            key={demoId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="w-full h-full"
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <p className="font-mono text-xs uppercase tracking-widest opacity-30">
                    Loading…
                  </p>
                </div>
              }
            >
              <DemoComponent />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key={demoId || "empty"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="text-center px-4"
          >
            <p className="font-mono text-xs uppercase tracking-widest opacity-40">
              {demoId ? `Demo: ${demoId}` : "No demo for this section"}
            </p>
            <p className="font-mono text-xs opacity-30 mt-1">Coming soon</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
