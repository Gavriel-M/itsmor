"use client";

import { motion } from "framer-motion";
import ContactNetwork from "@/components/contact/ContactNetwork";

export default function ContactPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full flex-grow flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-12">
        <div className="flex flex-col justify-between">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text mb-12"
          >
            CONTACT
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <p className="font-mono text-sm md:text-base mb-4 opacity-70 uppercase tracking-widest">
              Let&apos;s build something together.
            </p>
            <a
              href="mailto:gavriel.mor@itsmor.com"
              className="block font-sans text-3xl md:text-5xl lg:text-6xl font-bold hover:text-terracotta transition-colors break-all md:break-normal underline decoration-2 underline-offset-8 decoration-terracotta/30 hover:decoration-terracotta"
              style={{ fontSize: "clamp(1.5rem, 4vw, 3.75rem)" }}
            >
              gavriel.mor@itsmor.com
            </a>
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <ContactNetwork />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full border-t border-black/10 mt-auto pt-8 flex justify-between font-mono text-xs uppercase opacity-50"
      >
        <span>© 2025 itsmor</span>
        <span>All Rights Reserved</span>
      </motion.div>
    </section>
  );
}
