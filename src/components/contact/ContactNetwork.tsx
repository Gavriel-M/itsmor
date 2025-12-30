"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LINKS, TERRACOTTA } from "./particleSystem";
import { useParticleSystem } from "./useParticleSystem";
import { SeparatedLogo } from "./SeparatedLogo";

/**
 * ContactNetwork component displays an interactive network visualization
 * with a separating logo and particle effects on hover
 */
const ContactNetwork = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize particle system
  useParticleSystem(canvasRef, containerRef, hoveredNode);

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredNode(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] flex items-start md:items-center justify-center">
      {/* Desktop Network Graph (Hidden on Mobile) */}
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
                stroke={TERRACOTTA}
                strokeWidth={"1"}
                className="transition-all duration-300"
                style={{ opacity: hoveredNode === link.id ? 0.6 : 0.3 }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              />
            ))}
          </svg>

          {/* Particle Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5 }}
          />

          {/* Center Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 bg-transparent p-4 rounded-full"
          >
            <SeparatedLogo
              className="w-24 h-24 text-terracotta"
              isOpen={hoveredNode !== null}
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
              <Link
                href={link.href}
                target="_blank"
                className="block -translate-x-1/2 -translate-y-1/2 bg-background px-4 py-2 border border-terracotta/20 hover:border-terracotta hover:bg-terracotta hover:text-white transition-all duration-300 font-mono text-sm uppercase tracking-widest"
                onMouseEnter={() => handleMouseEnter(link.id)}
                onMouseLeave={handleMouseLeave}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Stack (Visible on Mobile) */}
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
