"use client";

import { motion } from "framer-motion";
import LinkButton from "@/components/ui/LinkButton";

const HEADLINE = "The CV is being rewritten.";
const STANDFIRST =
  "Rather than leave the old one here, these are the surfaces that are current.";

const CURRENT_SURFACES = [
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
            {HEADLINE}
          </p>
          <p className="font-mono text-sm md:text-base leading-relaxed opacity-70">
            {STANDFIRST}
          </p>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          {CURRENT_SURFACES.map((surface) => (
            <li key={surface.label}>
              <LinkButton href={surface.href} size="md">
                {surface.label}
              </LinkButton>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
