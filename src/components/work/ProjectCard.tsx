"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectProps {
  title: string;
  category: string;
  year: string;
  description?: string;
  href?: string;
  index: number;
}

export default function ProjectCard({
  title,
  category,
  year,
  description,
  href = "#",
  index,
}: ProjectProps) {
  const paddedIndex = String(index + 1).padStart(2, "0");
  const isExternal = href.startsWith("http");
  const Wrapper = isExternal ? "a" : Link;
  const externalProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative border-t border-black/10"
    >
      <Wrapper
        href={href}
        className="block py-7 md:py-10 border-l-2 border-transparent group-hover:border-terracotta focus-visible:border-terracotta pl-0 group-hover:pl-4 focus-visible:pl-4 transition-all duration-300"
        {...externalProps}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
          {/* Index + Year */}
          <div className="md:col-span-2 flex items-baseline gap-3">
            <span className="font-mono text-xs text-lapis">{paddedIndex}</span>
            <span className="font-mono text-xs md:text-sm text-terracotta">
              {year}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-6">
            {/*
              h2, not h3. /work opens with an h1 ("Selected Work") and these
              titles are its direct children, so an h3 skips a level and fails
              Lighthouse's heading-order audit — /work scored 98 on it.
            */}
            <h2 className="font-sans text-2xl md:text-4xl font-bold group-hover:text-lapis transition-colors duration-300">
              {title}
            </h2>
          </div>

          {/* Category + Arrow */}
          <div className="md:col-span-4 md:text-right flex items-baseline justify-start md:justify-end gap-4">
            <span className="font-mono text-xs md:text-sm uppercase tracking-wider border border-black/10 px-2 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
              {category}
            </span>
            {/*
              This arrow measures 2.09:1 on cream and is deliberately left
              there. WCAG 1.4.11 governs "visual information required to
              identify user interface components", and this is not it: the whole
              row is a single link, the h2 carries its accessible name, keyboard
              focus is shown by the focus-visible outline and the left border,
              and four other things change on hover. Remove any of those and
              this becomes a UI component that owes 3:1.

              aria-hidden so the determination lives in the markup rather than
              only in a report — it is decoration, and a screen reader reading
              "right arrow" after the title adds nothing.

              Note it is text-black/30, not a palette token, so it sits outside
              the tokens contract in 08-tokens.md.
            */}
            <span
              aria-hidden="true"
              className="text-black/30 group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-300"
            >
              &rarr;
            </span>
          </div>
        </div>

        {/* Description — revealed on hover */}
        {description && (
          <div className="max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-300 ease-out">
            <p className="font-mono text-xs md:text-sm text-black/50 mt-3 md:ml-[calc(2/12*100%)] md:max-w-[50%]">
              {description}
            </p>
          </div>
        )}
      </Wrapper>
    </motion.div>
  );
}
