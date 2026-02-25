"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { easeOutExpo, easeOutQuad } from "@/lib/motion/easing";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { PlayButton, DemoLabel } from "./shared";

const DURATION_MS = 900;

export default function TimingScrubberDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(0);
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setRailWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const dotSize = 12;
  const travel = Math.max(0, railWidth - dotSize);

  const handlePlay = useCallback(() => {
    if (prefersReduced || isPlaying) return;
    setIsPlaying(true);
    setT(0);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const nextT = Math.min(1, elapsed / DURATION_MS);
      setT(nextT);
      if (nextT < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setIsPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [prefersReduced, isPlaying]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrubValue = Math.round(t * 100);

  const linearX = travel * t;
  const easeOutX = travel * easeOutQuad(t);
  const expoX = travel * easeOutExpo(t);

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div
        ref={containerRef}
        className="flex-1 flex flex-col justify-center gap-5"
      >
        <div className="space-y-1">
          <DemoLabel>Linear</DemoLabel>
          <div className="relative h-3">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10" />
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-black/40"
              style={{
                width: dotSize,
                height: dotSize,
                transform: `translateX(${linearX}px)`,
                willChange: "transform",
              }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <DemoLabel>Ease-out</DemoLabel>
          <div className="relative h-3">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10" />
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-lapis"
              style={{
                width: dotSize,
                height: dotSize,
                transform: `translateX(${easeOutX}px)`,
                willChange: "transform",
              }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <DemoLabel>Expo</DemoLabel>
          <div className="relative h-3">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10" />
            <div
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-terracotta"
              style={{
                width: dotSize,
                height: dotSize,
                transform: `translateX(${expoX}px)`,
                willChange: "transform",
              }}
            />
          </div>
        </div>
      </div>

      <div className="pt-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <DemoLabel>Scrub</DemoLabel>
          <input
            type="range"
            min={0}
            max={100}
            value={scrubValue}
            onChange={(e) => {
              setIsPlaying(false);
              setT(Number(e.target.value) / 100);
            }}
            className="w-full accent-terracotta"
            aria-label="Scrub animation progress"
          />
        </div>

        <div className="flex justify-center">
          <PlayButton
            onClick={handlePlay}
            disabled={isPlaying || prefersReduced}
            label="Play"
          />
        </div>
      </div>
    </div>
  );
}
