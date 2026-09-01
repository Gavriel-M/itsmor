"use client";

import { motion, useReducedMotion } from "framer-motion";
import TransitionLink from "@/components/ui/TransitionLink";

/**
 * The homepage's information slot.
 *
 * Above the fold was a wordmark on a grid and nothing else: a strong brand
 * moment and a weak landing page. A recruiter arriving from the CV had about
 * twenty seconds and got no answer to what he does and no route onward. See
 * ~/logzio/career/04-portfolio.md, P1.
 *
 * Copy is from the spec in ~/logzio/career/04-portfolio.md, which owns it. The
 * earlier placeholder was that document's own illustrative line, and the spec
 * replaced it for failing Rule 1 of 07-voice.md: "AI product surfaces" is a
 * category noun where a concrete one belongs.
 *
 * ROUTES is Work and Contact, not the Work-and-CV the document asks for. /cv
 * currently serves an interim state because the PDF it used to serve was the
 * April draft (see src/app/cv/page.tsx), and pointing the hero's primary call
 * to action at "the CV is being rewritten" is worse than not offering it.
 * Add { label: "CV", href: "/cv" } here the day the new export lands.
 *
 * Why it is positioned absolutely rather than stacked under the wordmark: the
 * hero's geometry is `absolute inset-0` inside a wrapper whose height comes from
 * the h1. A sibling below the h1 grows that wrapper, and the circle and both
 * lapis bars re-centre against the new box — the composition shifts. Sitting
 * outside that wrapper leaves the geometry untouched.
 */
const POSITIONING =
  "Full-stack engineer. I build AI products at Logz.io and own the " +
  "interface end to end.";

const ROUTES = [
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

/**
 * Arrives after "Portfolio 2026" (delay 1.2) so it reads as the last beat of the
 * opening rather than competing with the wordmark.
 */
const DELAY = 1.5;

export default function HeroInfoSlot() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduceMotion ? 0 : DELAY,
        duration: reduceMotion ? 0.3 : 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      /*
        Bottom-left, clear of two things: the hero geometry, and the
        ScrollNavigationLoader, which mounts fixed bottom-centre at 250px wide
        the moment the visitor wheels or swipes.

        Desktop is roomy — at 1440x900 the ring's lower arc ends at y 629 and
        this block starts at y 741 — and the loader is far away horizontally.

        Mobile is tight and measured rather than guessed. At 390x844 the ring is
        8 grid cells across on a 390px viewport, so its arc reaches y 601 and the
        loader occupies roughly y 752-812. That leaves a ~150px band, and
        bottom-28 puts this block at y 624-732 inside it. bottom-36 was the first
        attempt and it overlapped the arc by 9px.

        VERTICAL BUDGET, mobile: about 110px. The placeholder line wraps to three
        lines at 390px and just fits. A longer line grows this block upward, back
        into the ring — so when the real copy lands, re-measure at 390px rather
        than assuming it fits.
      */
      className="absolute z-20 left-4 right-4 bottom-28 md:left-[var(--grid-cell)] md:right-auto md:bottom-[var(--grid-cell)] md:max-w-md"
    >
      <p className="cursor-default font-mono text-xs md:text-sm leading-relaxed text-text/70 text-balance">
        {POSITIONING}
      </p>

      <ul className="mt-4 flex gap-3">
        {ROUTES.map((route) => (
          <li key={route.label}>
            <TransitionLink
              href={route.href}
              className="inline-block font-mono text-xs uppercase tracking-widest border border-text/15 px-3 py-2 hover:bg-text hover:text-background focus-visible:bg-text focus-visible:text-background transition-colors duration-300"
            >
              {route.label}
            </TransitionLink>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
