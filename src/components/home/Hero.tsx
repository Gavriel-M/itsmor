"use client";

import { motion } from "framer-motion";
import { MagneticCircle } from "./MagneticCircle";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          {/* Red Circle */}

          <MagneticCircle />

          {/* Blue Rectangle Vertical */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "calc(var(--grid-cell) * 10)", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
            className="absolute bg-lapis"
            style={{
              width: "var(--grid-cell)",
              left: "50%",
              top: "50%",
              y: "-50%",
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
              height: "var(--grid-cell)",
              left: "50%",
              top: "50%",
              marginLeft: "calc(var(--grid-cell) * 1)",
              marginTop: "calc(var(--grid-cell) * 2)",
            }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              marginLeft: "calc(var(--grid-cell) * 1 + 10px)",
              marginTop: "calc(var(--grid-cell) * 2 + 10px)",
            }}
            className="relative z-20 mt-4 font-mono text-sm text-background tracking-widest uppercase"
          >
            Portfolio 2025
          </motion.p>
        </div>

        <motion.h1
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 font-sans font-bold text-[15vw] leading-none tracking-tighter text-text mix-blend-hard-light"
        >
          itsmor
        </motion.h1>
      </div>
    </section>
  );
}
