import { useRef, useEffect } from "react";

const COLOR_TERRACOTTA = "#b85b40";
const COLOR_LAPIS = "#004e98";
const COLOR_BACKGROUND = "#f2f0e6";

const POINTS_PER_SIDE = 14;
const FLICKER_INTERVAL = 60; // ms between displacement regeneration
const STROKE_WIDTH = 1.5;
const DISPLACEMENT_MIN = -4;
const DISPLACEMENT_MAX = 4;

interface UseLightningEffectProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredNodeRef: React.RefObject<HTMLElement | null>;
  isActive: boolean;
}

interface Point {
  x: number;
  y: number;
}

function generateDisplacements(count: number): number[] {
  const displacements: number[] = [];
  for (let i = 0; i < count; i++) {
    displacements.push(
      DISPLACEMENT_MIN + Math.random() * (DISPLACEMENT_MAX - DISPLACEMENT_MIN)
    );
  }
  return displacements;
}

function sampleBorderPoints(
  rect: DOMRect,
  containerRect: DOMRect,
  displacements: number[]
): Point[] {
  const points: Point[] = [];
  const left = rect.left - containerRect.left;
  const top = rect.top - containerRect.top;
  const w = rect.width;
  const h = rect.height;
  let di = 0;

  // Top edge (left to right)
  for (let i = 0; i < POINTS_PER_SIDE; i++) {
    const t = i / POINTS_PER_SIDE;
    points.push({
      x: left + t * w,
      y: top + displacements[di++],
    });
  }

  // Right edge (top to bottom)
  for (let i = 0; i < POINTS_PER_SIDE; i++) {
    const t = i / POINTS_PER_SIDE;
    points.push({
      x: left + w + displacements[di++],
      y: top + t * h,
    });
  }

  // Bottom edge (right to left)
  for (let i = 0; i < POINTS_PER_SIDE; i++) {
    const t = 1 - i / POINTS_PER_SIDE;
    points.push({
      x: left + t * w,
      y: top + h + displacements[di++],
    });
  }

  // Left edge (bottom to top)
  for (let i = 0; i < POINTS_PER_SIDE; i++) {
    const t = 1 - i / POINTS_PER_SIDE;
    points.push({
      x: left + displacements[di++],
      y: top + t * h,
    });
  }

  return points;
}

function drawLightningPath(ctx: CanvasRenderingContext2D, points: Point[]) {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
}

export const useLightningEffect = ({
  canvasRef,
  containerRef,
  hoveredNodeRef,
  isActive,
}: UseLightningEffectProps) => {
  const rafIdRef = useRef<number | null>(null);
  const displacementsRef = useRef<number[]>(
    generateDisplacements(POINTS_PER_SIDE * 4)
  );
  const lastFlickerRef = useRef<number>(0);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [canvasRef, containerRef]);

  // Animation loop
  useEffect(() => {
    if (!isActive) {
      // Clear canvas when not active
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const hoveredNode = hoveredNodeRef.current;

      if (!canvas || !container || !hoveredNode) {
        rafIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Regenerate displacements for flicker
      if (timestamp - lastFlickerRef.current > FLICKER_INTERVAL) {
        displacementsRef.current = generateDisplacements(POINTS_PER_SIDE * 4);
        lastFlickerRef.current = timestamp;
      }

      const containerRect = container.getBoundingClientRect();
      const nodeRect = hoveredNode.getBoundingClientRect();

      const points = sampleBorderPoints(
        nodeRect,
        containerRect,
        displacementsRef.current
      );

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineJoin = "bevel";
      ctx.lineCap = "butt";
      ctx.lineWidth = STROKE_WIDTH;

      // Pass 1: Lapis stroke (visible outside button)
      ctx.strokeStyle = COLOR_LAPIS;
      drawLightningPath(ctx, points);
      ctx.stroke();

      // Pass 2: Clip to button rect, overdraw in background color
      ctx.save();
      const left = nodeRect.left - containerRect.left;
      const top = nodeRect.top - containerRect.top;
      ctx.beginPath();
      ctx.rect(left, top, nodeRect.width, nodeRect.height);
      ctx.clip();

      ctx.strokeStyle = COLOR_BACKGROUND;
      ctx.lineWidth = STROKE_WIDTH;
      ctx.lineJoin = "bevel";
      ctx.lineCap = "butt";
      drawLightningPath(ctx, points);
      ctx.stroke();
      ctx.restore();

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isActive, canvasRef, containerRef, hoveredNodeRef]);
};
