"use client";

import { motion } from "framer-motion";
import LinkButton from "@/components/ui/LinkButton";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

const POSITIONING =
  "Full-stack engineer. I build AI products at Logz.io and own the " +
  "interface end to end.";

const ROUTES = [
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

/** Lands after the hero's "Portfolio 2026" beat at 1.2s. */
const DELAY = 1.5;

export default function HeroInfoSlot() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduceMotion ? 0 : DELAY,
        duration: reduceMotion ? 0.3 : 0.8,
        ease: EASE_OUT_EXPO,
      }}
      className="absolute z-20 left-4 right-4 bottom-28 md:left-[var(--grid-cell)] md:right-auto md:bottom-[var(--grid-cell)] md:max-w-md"
    >
      <p className="cursor-default font-mono text-xs md:text-sm leading-relaxed text-text/70 text-balance">
        {POSITIONING}
      </p>

      <ul className="mt-4 flex gap-3">
        {ROUTES.map((route) => (
          <li key={route.label}>
            <LinkButton href={route.href}>{route.label}</LinkButton>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
