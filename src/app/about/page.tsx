"use client";

import { motion } from "framer-motion";
import RotatingText from "@/components/about/RotatingText";
import Timeline from "@/components/about/Timeline";
import WireframeLogo3D from "@/components/work/WireframeLogo3D";

export default function AboutPage() {
  return (
    <section className="cursor-default min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 overflow-x-hidden">
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
                "full-stack engineer",
                "AI product engineer",
                "design engineer",
              ]}
              className="font-sans text-2xl md:text-5xl leading-tight font-bold tracking-tight"
            />
            <RotatingText
              prefix="My philosophy is"
              words={[
                "less but better",
                "constraint as catalyst",
                "motion with meaning",
              ]}
              className="font-sans text-2xl md:text-5xl leading-tight font-bold tracking-tight"
            />
          </motion.div>

          {/*
            This paragraph is the LCP element on mobile. It used to animate
            opacity 0 -> 1 behind a 0.3s delay, which meant it did not paint
            until React had hydrated — 4.7 s, of which 4.26 s (90%) was render
            delay with nothing downloading. Animating transform only, with
            opacity left at 1, lets it paint with the server-rendered HTML and
            still arrive with a reveal.

            The 0.3s delay is gone rather than shortened: any opacity gate on
            this element ties the largest paint on the page to hydration on a
            throttled CPU, which is the whole problem.
          */}
          <motion.p
            initial={{ y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-base md:text-lg leading-relaxed opacity-80 mt-12 max-w-2xl"
          >
            Full-stack engineer at Logz.io since 2023. I am the second engineer
            on OrionIQ, an agent that takes an alert and works out what broke,
            and I own its interface end to end. Before that I built the
            company&apos;s design system, and moved the entire SIEM product onto
            a new platform single-handed. Based in Israel, moving to Munich.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Timeline />
          </motion.div>
        </div>

        {/* Sidebar / Details */}
        <div className="md:col-span-4 md:pl-8 border-l border-black/10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-12"
          >
            {/* Stack */}
            <div>
              <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-4">
                Professional Stack
              </h3>
              <ul className="font-sans text-sm md:text-base space-y-2">
                <li>TypeScript / React / Node.js</li>
                <li>TanStack Query and Router</li>
                <li>Emotion / @xstyled</li>
                <li>AWS Bedrock / Prisma / SQL</li>
                <li>Nx / Storybook / Playwright</li>
                <li>Web Workers / OPFS / SSE</li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-4">
                Areas of Expertise
              </h3>
              <ul className="font-sans text-sm md:text-base space-y-2">
                <li>AI Product Engineering</li>
                <li>Data Visualization</li>
                <li>Design Systems</li>
                <li>Performance Engineering</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
