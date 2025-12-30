import { useRef, useEffect } from "react";
import {
  LINKS,
  PARTICLES_PER_FRAME,
  LOGO_OPEN_DURATION_MS,
  createParticlePool,
  initializeParticle,
  calculateBezierPoint,
  calculateSpiralOffset,
} from "./particleSystem";

export const useParticleSystem = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  hoveredNode: string | null
) => {
  const stateRef = useRef({
    particles: createParticlePool(),
    animationFrameId: null as number | null,
    isHovering: false,
    hoverStartTime: null as number | null,
    targetPosition: null as { x: number; y: number } | null,
  });

  const animateRef = useRef<(() => void) | null>(null);

  const clearParticles = () => {
    const particles = stateRef.current.particles;
    for (let i = 0; i < particles.length; i++) {
      particles[i].active = false;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(container);

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    return () => resizeObserver.disconnect();
  }, [canvasRef, containerRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const timeSinceHoverStart = state.hoverStartTime
        ? Date.now() - state.hoverStartTime
        : 0;
      const logoHasOpened = timeSinceHoverStart >= LOGO_OPEN_DURATION_MS;

      if (state.isHovering && state.targetPosition && logoHasOpened) {
        for (let i = 0; i < PARTICLES_PER_FRAME; i++) {
          initializeParticle(
            state.particles,
            centerX,
            centerY,
            centerX + state.targetPosition.x,
            centerY + state.targetPosition.y
          );
        }
      }

      let hasActiveParticles = false;

      for (const particle of state.particles) {
        if (!particle.active) continue;
        hasActiveParticles = true;

        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          particle.active = false;
          continue;
        }

        const bezierControlX =
          (centerX + particle.targetX) / 2 + particle.bezierControlOffsetX;
        const bezierControlY =
          (centerY + particle.targetY) / 2 + particle.bezierControlOffsetY;

        const baseX = calculateBezierPoint(
          particle.progress,
          centerX,
          bezierControlX,
          particle.targetX
        );
        const baseY = calculateBezierPoint(
          particle.progress,
          centerY,
          bezierControlY,
          particle.targetY
        );

        const spiralOffset = calculateSpiralOffset(
          particle.progress,
          particle.spiralPhase
        );

        const deltaX = particle.targetX - centerX;
        const deltaY = particle.targetY - centerY;
        const pathLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const perpendicularX = -deltaY / pathLength;
        const perpendicularY = deltaX / pathLength;

        particle.currentX = baseX + perpendicularX * spiralOffset;
        particle.currentY = baseY + perpendicularY * spiralOffset;

        let opacity = 1;
        if (particle.progress < 0.15) {
          opacity = particle.progress / 0.15;
        } else if (particle.progress > 0.75) {
          opacity = (1 - particle.progress) / 0.25;
        }

        ctx.beginPath();
        ctx.arc(
          particle.currentX,
          particle.currentY,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(184, 91, 64, ${opacity * 0.8})`;
        ctx.fill();
      }

      if (state.isHovering || hasActiveParticles) {
        state.animationFrameId = requestAnimationFrame(animateRef.current!);
      } else {
        state.animationFrameId = null;
      }
    };

    animateRef.current = animate;

    return () => {
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
        state.animationFrameId = null;
      }
    };
  }, [canvasRef, containerRef]);

  useEffect(() => {
    const state = stateRef.current;

    if (hoveredNode) {
      const link = LINKS.find((linkItem) => linkItem.id === hoveredNode);
      if (link) {
        if (!state.isHovering) {
          state.hoverStartTime = Date.now();
          clearParticles();
        }
        state.isHovering = true;
        state.targetPosition = { x: link.x, y: link.y };

        if (!state.animationFrameId && animateRef.current) {
          state.animationFrameId = requestAnimationFrame(animateRef.current);
        }
      }
    } else {
      state.isHovering = false;
      state.hoverStartTime = null;
      state.targetPosition = null;
    }
  }, [hoveredNode]);
};
