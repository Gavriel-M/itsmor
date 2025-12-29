"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GLITCH_FRAMES = [
  "/itsmor-logo.svg",
  "/itsmor-logo-hardboiled.svg",
  "/itsmor-logo-epic.svg",
  "/itsmor-logo-new-wave.svg",
  "/itsmor-logo-noir.svg",
  "/itsmor-logo-verite.svg",
  "/itsmor-logo-vaporwave.svg",
];

interface AnimatedLogoFrameProps {
  className?: string;
}

export default function AnimatedLogoFrame({
  className = "",
}: AnimatedLogoFrameProps) {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const startTime = Date.now();

    const tick = () => {
      let delay = 2500; // Default slow static cycle

      if (isHovering) {
        // Calculate phase in a 2.5s cycle
        const elapsed = Date.now() - startTime;
        const cycleDuration = 2500;
        const phase = elapsed % cycleDuration;

        if (phase < 1000) {
          // Burst phase (1s): Fast, erratic
          // Vary between 40ms and 100ms for extra "glitch" feel
          delay = 40 + Math.random() * 60;
        } else {
          // Cooldown phase (1.5s): Slower
          delay = 300 + Math.random() * 200;
        }
      } else delay = 2500;

      timeoutId = setTimeout(() => {
        setCurrentFrameIndex((prev) => {
          if (isHovering) {
            // Random glitchy jump
            let next = Math.floor(Math.random() * GLITCH_FRAMES.length);
            // Ensure visual change
            while (next === prev && GLITCH_FRAMES.length > 1) {
              next = Math.floor(Math.random() * GLITCH_FRAMES.length);
            }
            return next;
          } else {
            // Sequential slow cycle
            return (prev + 1) % GLITCH_FRAMES.length;
          }
        });

        // After first transition, no longer initial mount
        if (isInitialMount) {
          setIsInitialMount(false);
        }

        tick(); // Recurse
      }, delay);
    };

    tick();

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering]);

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isInitialMount ? (
        // Animated initial mount
        <motion.img
          src={GLITCH_FRAMES[currentFrameIndex]}
          alt="itsmor Logo"
          className="w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        />
      ) : (
        // Instant glitchy swaps after initial mount
        // Using regular img for instant rendering without Next.js Image optimization delays
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={GLITCH_FRAMES[currentFrameIndex]}
          alt="itsmor Logo"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
}
