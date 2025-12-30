"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/work/ProjectCard";
import AnimatedLogoFrame from "@/components/ui/AnimatedLogoFrame";

const projects = [
  {
    title: "FinTech Dashboard",
    category: "Web Development",
    year: "2024",
    href: "/work/fintech-dashboard",
    description: "Real-time financial data visualization.",
  },
  {
    title: "E-Commerce Design System",
    category: "Design System",
    year: "2023",
    href: "/work/ecommerce-ds",
    description: "Composable UI library for retail.",
  },
  {
    title: "Generative Art Collection",
    category: "Creative Coding",
    year: "2023",
    href: "/work/generative-art",
    description: "Interactive 3D experiments.",
  },
  {
    title: "Neon Genesis",
    category: "Web Development",
    year: "2025",
    href: "/work/neon-genesis",
    description: "Next-gen web framework prototype.",
  },
  {
    title: "Type Foundry",
    category: "Brand Identity",
    year: "2023",
    href: "/work/type-foundry",
    description: "Typography showcase and sales platform.",
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
              A collection of digital artifacts, web experiences, and brand
              systems designed with precision and purpose.
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
