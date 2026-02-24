"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { easeOutExpo, easeInQuad, easeOutQuad } from "@/lib/motion/easing";
import { PlayButton, DemoLabel } from "./shared";

const DOT_RADIUS = 6;
const DURATION_MS = 1000;
const PADDING = 20;

export default function ArcVsLineDemo() {
  const prefersReduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const [playing, setPlaying] = useState(false);

  const straightTrail = useRef<{ x: number; y: number }[]>([]);
  const arcTrail = useRef<{ x: number; y: number }[]>([]);

  const draw = useCallback((t: number, width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const startX = PADDING;
    const startY = PADDING;
    const endX = width - PADDING;
    const endY = height - PADDING;
    const rangeX = endX - startX;
    const rangeY = endY - startY;

    // Straight path: easeOutExpo for both axes
    const st = easeOutExpo(t);
    const sx = startX + rangeX * st;
    const sy = startY + rangeY * st;
    straightTrail.current.push({ x: sx, y: sy });

    // Arc path: easeIn for x, easeOut for y
    const ax = startX + rangeX * easeInQuad(t);
    const ay = startY + rangeY * easeOutQuad(t);
    arcTrail.current.push({ x: ax, y: ay });

    // Draw trails
    const drawTrail = (trail: { x: number; y: number }[], color: string) => {
      if (trail.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    drawTrail(straightTrail.current, "rgba(0,0,0,0.4)");
    drawTrail(arcTrail.current, "#b85b40");

    // Draw dots
    ctx.beginPath();
    ctx.arc(sx, sy, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ax, ay, DOT_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#b85b40";
    ctx.fill();
  }, []);

  const handlePlay = useCallback(() => {
    if (prefersReduced) return;
    setPlaying(true);
    straightTrail.current = [];
    arcTrail.current = [];

    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION_MS, 1);
      draw(t, width, height);
      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setPlaying(false);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [draw, prefersReduced]);

  // Draw static final state for reduced motion
  useEffect(() => {
    if (prefersReduced) {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      straightTrail.current = [];
      arcTrail.current = [];
      draw(1, width, height);
    }
  }, [prefersReduced, draw]);

  // Draw initial state
  useEffect(() => {
    if (prefersReduced) return;
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    straightTrail.current = [];
    arcTrail.current = [];
    draw(0, width, height);
  }, [draw, prefersReduced]);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div ref={containerRef} className="flex-1 relative">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
      <div className="pt-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-black/40" />
            <DemoLabel>Straight</DemoLabel>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-terracotta" />
            <DemoLabel>Arc</DemoLabel>
          </div>
        </div>
        <PlayButton onClick={handlePlay} disabled={playing || prefersReduced} />
      </div>
    </div>
  );
}
