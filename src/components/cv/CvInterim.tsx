"use client";

import { motion } from "framer-motion";

/**
 * COPY NOTE. One status sentence, deliberately not a positioning statement —
 * positioning for this site is owned by the copy spec being written against
 * ~/logzio/career/04-portfolio.md. Replace this string, not the structure, when
 * the new CV export lands; at that point delete this component and restore the
 * PDF viewer with `git show 2cd2bad:src/app/cv/page.tsx`.
 */
const STATUS = "The CV is being rewritten.";
const SUBSTATUS =
  "Rather than leave the old one here, these are the surfaces that are current.";

const ROUTES = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gavriel-mor/" },
  { label: "GitHub", href: "https://github.com/Gavriel-M" },
  { label: "Email", href: "mailto:gavriel.mor@itsmor.com" },
];

export default function CvInterim() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full flex-grow flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cursor-default font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text mb-12"
        >
          CV
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-xl"
        >
          <p className="font-sans text-xl md:text-2xl tracking-tight text-text mb-3">
            {STATUS}
          </p>
          <p className="font-mono text-sm md:text-base leading-relaxed opacity-70">
            {SUBSTATUS}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          {ROUTES.map((route) => (
            <li key={route.label}>
              <a
                href={route.href}
                {...(route.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-block font-mono text-sm uppercase tracking-widest border border-black/10 px-4 py-2 hover:bg-black hover:text-white transition-all duration-300"
              >
                {route.label}
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
