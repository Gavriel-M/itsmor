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

/**
 * Transform only, with opacity left at 1, for the reason `/about`'s body copy
 * is: this is the page's only positioning line and its only two CTAs, and an
 * opacity gate keeps them invisible until React hydrates — or forever, if the
 * bundle fails. It ships visible in the prerendered HTML and rises after.
 *
 * The delay stays short for the same reason; the hero's own beats run to 1.2s
 * and this no longer waits for them.
 *
 * Reduced motion is applied through `transition`, not `initial`.
 * `usePrefersReducedMotion` returns false on the server snapshot, so the first
 * client render always sees false, and framer-motion never re-reads `initial`
 * after mount — gating it there silently does nothing.
 */
const DELAY = 0.4;
const DISTANCE = 12;

export default function HeroInfoSlot() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ y: DISTANCE }}
      animate={{ y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: DELAY, duration: 0.6, ease: EASE_OUT_EXPO }
      }
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
