"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface RotatingTextProps {
  prefix: string;
  words: string[];
  interval?: number;
  className?: string;
}

const transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function RotatingText({
  prefix,
  words,
  interval = 5000,
  className,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShouldAnimate(false);
      return;
    }
    const onChange = (e: MediaQueryListEvent) => setShouldAnimate(!e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [shouldAnimate, interval, words.length]);

  return (
    <h2 aria-label={`${prefix} ${words.join(", ")}`} className={className}>
      {prefix}{" "}
      <span
        className="relative inline-flex overflow-hidden align-bottom"
        style={{ height: "1.2em" }}
      >
        {/* Render all words invisibly — browser picks the widest */}
        {words.map((w) => (
          <span key={w} className="invisible whitespace-nowrap block h-0">
            {w}
          </span>
        ))}

        <AnimatePresence initial={false}>
          <motion.span
            key={words[index]}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={transition}
            className="absolute left-0 top-0 whitespace-nowrap text-terracotta"
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h2>
  );
}
