"use client";

import { motion } from "framer-motion";
import CvDownloads from "./CvDownloads";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";

/**
 * Transform only. This page's entire content is the CV, so an opacity gate
 * would hide all of it until hydration.
 *
 * The download block sits beside the heading on wide screens and above the
 * document on narrow ones, so a phone visitor does not scroll two pages to
 * reach it.
 */
export default function CvHeader() {
  return (
    <motion.div
      initial={{ y: 12 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
      className="grid grid-cols-1 gap-8 items-end lg:grid-cols-[1fr_minmax(320px,360px)] lg:gap-12"
    >
      <div>
        <h1 className="cursor-default font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text">
          CV
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-lapis mt-3.5">
          Full-Stack Software Engineer
        </p>
      </div>

      <CvDownloads />
    </motion.div>
  );
}
