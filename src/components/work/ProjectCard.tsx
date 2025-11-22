"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface ProjectProps {
  title: string;
  category: string;
  year: string;
  href?: string;
  index: number;
}

export default function ProjectCard({
  title,
  category,
  year,
  href = "#",
  index,
}: ProjectProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative border-t border-black/10 dark:border-white/10 py-7 md:py-10"
    >
      <Link href={href} className="block">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
          {/* Year */}
          <div className="md:col-span-2">
            <span className="font-mono text-xs md:text-sm text-terracotta opacity-80">
              {year}
            </span>
          </div>

          {/* Title */}
          <div className="md:col-span-6">
            <h3 className="font-sans text-2xl md:text-4xl font-bold group-hover:text-lapis transition-colors duration-300">
              {title}
            </h3>
          </div>

          {/* Category */}
          <div className="md:col-span-4 md:text-right">
            <span className="font-mono text-xs md:text-sm uppercase tracking-wider border border-black/10 px-2 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
              {category}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
