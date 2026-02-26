"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

export default function HeroHeader() {
  return (
    <header className="mb-20 md:mb-28">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        className="cursor-default font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text mb-4"
      >
        2D ANIMATION
        <br />
        <span className="text-terracotta">ON THE WEB</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
        className="cursor-default font-mono text-sm md:text-base max-w-xl leading-relaxed opacity-80"
      >
        Translating classical animation principles into the constraints and
        opportunities of web UI motion — timing, easing, staging, and
        perception.
      </motion.p>
    </header>
  );
}
