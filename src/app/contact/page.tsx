"use client";

import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 flex flex-col justify-between">
      <div className="max-w-screen-xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text mb-12"
        >
          CONTACT
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-mono text-sm md:text-base mb-8 opacity-70 uppercase tracking-widest">
              Let&apos;s build something together.
            </p>
            <a
              href="mailto:hello@itsmor.com"
              className="block font-sans text-4xl md:text-6xl font-bold hover:text-terracotta transition-colors underline decoration-2 underline-offset-8 decoration-terracotta/30 hover:decoration-terracotta"
            >
              gavriel.mor@itsmor.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col justify-end items-start md:items-end space-y-4"
          >
            <a
              href="https://www.linkedin.com/in/gavriel-mor/"
              target="_blank"
              className="font-mono text-sm hover:text-lapis transition-colors uppercase"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/Gavriel-M"
              target="_blank"
              className="font-mono text-sm hover:text-lapis transition-colors uppercase"
            >
              GitHub ↗
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full border-t border-black/10 mt-20 pt-8 flex justify-between font-mono text-xs uppercase opacity-50"
      >
        <span>© 2025 itsmor</span>
        <span>All Rights Reserved</span>
      </motion.div>
    </section>
  );
}
