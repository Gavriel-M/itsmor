"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Geometric Elements - Aligned to Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Red Circle */}
          {/* Centered visually but offset to align with grid lines if needed. 
              Here we center it relative to the viewport center. */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute rounded-full border-[20px] md:border-[40px] border-terracotta"
            style={{
              width: "calc(var(--grid-cell) * 8)",
              height: "calc(var(--grid-cell) * 8)",
              left: "50%",
              top: "50%",
              x: "-50%", // Center the element itself
              y: "-50%",
              // Additional offset to shift it relative to the 'center' grid line
              marginLeft: "calc(var(--grid-cell) * -2)",
              marginTop: "calc(var(--grid-cell) * -1)",
            }}
          />

          {/* Blue Rectangle Vertical */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(var(--grid-cell) * 10)", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
            className="absolute bg-lapis"
            style={{
              width: "var(--grid-cell)", // 1 cell width
              left: "50%",
              top: "50%",
              y: "-50%", // Center vertically
              // Offset: Center line + 2 cells right
              marginLeft: "calc(var(--grid-cell) * 2)",
            }}
          />

          {/* Blue Rectangle Horizontal */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "calc(var(--grid-cell) * 6)", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
            className="absolute bg-lapis"
            style={{
              height: "var(--grid-cell)", // 1 cell height
              left: "50%",
              top: "50%",
              // Offset: Center line + 1 cell right (start point)
              marginLeft: "calc(var(--grid-cell) * 1)",
              // Offset: Center line + 2 cells down
              marginTop: "calc(var(--grid-cell) * 2)",
            }}
          />
        </div>

        {/* Typography */}
        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 font-sans font-bold text-[15vw] leading-none tracking-tighter text-text mix-blend-hard-light"
        >
          itsmor
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative z-20 mt-4 font-mono text-sm md:text-base tracking-widest uppercase"
        >
          Portfolio 2025
        </motion.p>
      </div>
    </section>
  );
}
