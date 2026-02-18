"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SeparatedLogo } from "./SeparatedLogo";
import { useCursorTracking } from "./useCursorTracking";
import { useLightningEffect } from "./useLightningEffect";
import type { NetworkLink } from "./types";

// Network links configuration
export const LINKS: NetworkLink[] = [
  {
    id: "linkedin",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/gavriel-mor/",
    x: -150,
    y: -50,
  },
  {
    id: "github",
    label: "GITHUB",
    href: "https://github.com/Gavriel-M",
    x: 150,
    y: -50,
  },
  {
    id: "readcv",
    label: "READ.CV",
    href: "https://read.cv/itsmor",
    x: 0,
    y: 120,
  },
];

const ROTATION_OFFSET = 0;

const nodeBasedRotation = {
  default: 0 + ROTATION_OFFSET,
  github: 72 + ROTATION_OFFSET,
  linkedin: -72 + ROTATION_OFFSET,
  readcv: 180 + ROTATION_OFFSET,
};

const ContactNetwork = () => {
  const [hoveredNode, setHoveredNode] = useState<string>("default");

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const hoveredNodeElRef = useRef<HTMLElement | null>(null);

  const isCursorTracking = hoveredNode === "default";

  // Cursor tracking (disabled when hovering nodes)
  const { rotation: cursorRotation, setRotation } = useCursorTracking({
    containerRef,
    logoRef,
    enabled: isCursorTracking,
    smoothingFactor: 0.15,
  });

  // Lightning effect on hovered node
  useLightningEffect({
    canvasRef,
    containerRef,
    hoveredNodeRef: hoveredNodeElRef,
    isActive: hoveredNode !== "default",
  });

  // Always use cursorRotation — setRotationSmooth already computes the
  // nearest equivalent angle when snapping to a node, so we avoid 360° flips.
  const finalRotation = cursorRotation;

  const handleMouseEnter = useCallback(
    (id: string, el: HTMLElement) => {
      setHoveredNode(id);
      hoveredNodeElRef.current = el;
      const targetNodeRotation =
        nodeBasedRotation[id as keyof typeof nodeBasedRotation];
      setRotation(targetNodeRotation);
    },
    [setRotation]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredNode("default");
    hoveredNodeElRef.current = null;
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] flex items-start md:items-center justify-center">
      {/* Desktop Network Graph */}
      <div
        ref={containerRef}
        className="hidden md:block relative w-full h-full"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {LINKS.map((link) => (
              <motion.line
                key={link.id}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${link.x}px)`}
                y2={`calc(50% + ${link.y}px)`}
                stroke="#b85b40"
                strokeWidth="1"
                className="transition-all duration-300"
                style={{ opacity: hoveredNode === link.id ? 0.6 : 0.3 }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Canvas for Lightning Effect */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5 }}
          />

          {/* Center Logo */}
          <motion.div
            ref={logoRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 bg-transparent p-4 rounded-full"
            style={{
              willChange: isCursorTracking ? "transform" : "auto",
            }}
          >
            <SeparatedLogo
              className="w-24 h-24 text-terracotta"
              isOpen={hoveredNode !== "default"}
              rotation={finalRotation}
              smoothTransition={!isCursorTracking}
            />
          </motion.div>

          {/* Nodes */}
          {LINKS.map((link, i) => (
            <motion.div
              key={link.id}
              className="absolute left-1/2 top-1/2"
              style={{
                marginLeft: link.x,
                marginTop: link.y,
                zIndex: 20,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block -translate-x-1/2 -translate-y-1/2 bg-background px-4 py-2 border border-terracotta/20 hover:border-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 font-mono text-sm uppercase tracking-widest"
                onMouseEnter={(e) => handleMouseEnter(link.id, e.currentTarget)}
                onMouseLeave={handleMouseLeave}
              >
                {link.label}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Stack */}
      <div className="md:hidden flex flex-col items-center gap-4 w-full">
        <SeparatedLogo className="w-24 h-24 text-terracotta" isOpen={false} />
        {LINKS.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            target="_blank"
            className="w-32 text-center py-3 border border-black/10 active:bg-terracotta active:text-white transition-colors font-mono text-sm uppercase tracking-widest"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContactNetwork;
