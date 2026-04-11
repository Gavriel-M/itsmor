"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/work/ProjectCard";
import AnimatedLogoFrame from "@/components/ui/AnimatedLogoFrame";

const projects = [
  {
    title: "2D Animation on the Web",
    category: "Research",
    year: "2026",
    href: "/work/2d-web-animation",
    description:
      "A 14-section deep dive translating Disney's animation principles into web UI constraints, with interactive demos.",
  },
  {
    title: "Eli Mor — Chinese Medicine",
    category: "Client Work",
    year: "2025",
    href: "https://d2yp9197xa6wil.cloudfront.net/",
    description:
      "Bilingual RTL Hebrew website for a Chinese medicine practitioner. Video hero, treatment pages, blog, and testimonials — designed and built end-to-end.",
  },
];

export default function WorkPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 overflow-hidden">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 items-end relative">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="cursor-default font-sans font-bold text-6xl md:text-8xl mb-6 tracking-tighter text-text"
            >
              SELECTED <br className="hidden md:block" />
              <span className="text-terracotta">WORK</span>
            </motion.h1>
          </div>

          {/* 
            Logo Container 
            - Positioned absolute relative to the header grid
            - z-0 to sit behind text (z-10) but be interactive
            - opacity-5 for subtle look
          */}
          <div className="absolute top-1/2 -right-1/4 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] aspect-square z-0 opacity-20 pointer-events-auto">
            <AnimatedLogoFrame className="w-full h-full" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="pb-4 relative z-10"
          >
            <p className="cursor-default font-mono text-sm md:text-base max-w-md leading-relaxed opacity-80">
              A curated selection of projects, research, and client work.
            </p>
          </motion.div>
        </header>

        <div className="flex flex-col relative z-10">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
