"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Link from "next/link";

const links = [
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/gavriel-mor/",
    x: -150,
    y: -50,
  },
  { label: "GITHUB", href: "https://github.com/Gavriel-M", x: 150, y: -50 },
  { label: "READ.CV", href: "https://read.cv/itsmor", x: 0, y: 120 },
];

export default function ContactNetwork() {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center my-12 md:my-0">
      {/* Desktop Network Graph (Hidden on Mobile) */}
      <div className="hidden md:block relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {links.map((link) => (
              <motion.line
                key={link.label}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${link.x}px)`}
                y2={`calc(50% + ${link.y}px)`}
                stroke="currentColor"
                strokeWidth="1"
                className="text-terracotta opacity-30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Center Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 bg-background p-4 rounded-full"
          >
            <Logo className="w-20 h-20 text-terracotta" />
          </motion.div>

          {/* Nodes */}
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              className="absolute left-1/2 top-1/2"
              style={{ marginLeft: link.x, marginTop: link.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            >
              <Link
                href={link.href}
                target="_blank"
                className="block -translate-x-1/2 -translate-y-1/2 bg-background px-4 py-2 border border-terracotta/20 hover:border-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 font-mono text-sm uppercase tracking-widest"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Stack (Visible on Mobile) */}
      <div className="md:hidden flex flex-col items-center gap-4 w-full">
        <Logo className="w-12 h-12 text-terracotta mb-4" />
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            className="w-full text-center py-3 border border-black/10 active:bg-terracotta active:text-white transition-colors font-mono text-sm uppercase tracking-widest"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
