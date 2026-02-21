"use client";

import { motion } from "framer-motion";
import RotatingText from "@/components/about/RotatingText";
import Timeline from "@/components/about/Timeline";
import WireframeLogo3D from "@/components/work/WireframeLogo3D";

export default function AboutPage() {
  return (
    <section className="cursor-default min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        {/* Header */}
        <div className="absolute top-1/4 -right-1/6 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[600px] aspect-square z-0 opacity-50 pointer-events-auto">
          <div className="w-full h-120">
            <WireframeLogo3D zoom={40} />
          </div>
        </div>
        <div className="md:col-span-12 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text"
          >
            ABOUT
          </motion.h1>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-2xl md:text-5xl leading-tight font-bold tracking-tight space-y-8"
          >
            <RotatingText
              prefix="I am a"
              words={[
                "creative developer",
                "design engineer",
                "detail devotee",
                "pixel perfectionist",
                "craft-driven builder",
              ]}
              className="font-sans text-2xl md:text-5xl leading-tight font-bold tracking-tight"
            />
            <RotatingText
              prefix="My philosophy is"
              words={[
                "precision and purpose",
                "less but better",
                "motion with meaning",
                "craft over convention",
                "constraint as catalyst",
              ]}
              className="font-sans text-2xl md:text-5xl leading-tight font-bold tracking-tight"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Timeline />
          </motion.div>
        </div>

        {/* Sidebar / Details */}
        <div className="md:col-span-4 md:pl-8 border-l border-black/10 dark:border-white/10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-12"
          >
            {/* Stack */}
            <div>
              <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-4">
                Tech Stack
              </h3>
              <ul className="font-sans text-sm md:text-base space-y-2">
                <li>TypeScript / React / Next.js</li>
                <li>Tailwind CSS / Framer Motion</li>
                <li>Node.js / PostgreSQL</li>
                <li>WebGL / Three.js</li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-4">
                Services
              </h3>
              <ul className="font-sans text-sm md:text-base space-y-2">
                <li>Frontend Architecture</li>
                <li>Creative Development</li>
                <li>UI/UX Design</li>
                <li>Performance Optimization</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
