"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Geometric Elements */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Red Circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute w-[40vh] h-[40vh] md:w-[60vh] md:h-[60vh] rounded-full border-[20px] md:border-[40px] border-terracotta -translate-x-[20%] -translate-y-[10%]"
          />

          {/* Blue Rectangle Vertical */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "80vh", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.6 }}
            className="absolute w-[10vw] bg-lapis translate-x-[10vw] top-[10vh]"
          />
          {/* Blue Rectangle Horizontal */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "40vw", opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.8 }}
            className="absolute h-[10vw] bg-lapis translate-x-[10vw] translate-y-[20vh] right-0"
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
