import { useState, useEffect, useRef, useCallback } from "react";
import type { LogoRotationState } from "./types";

interface UseCursorTrackingProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLDivElement | null>;
  enabled: boolean;
  smoothingFactor?: number; // 0-1, higher = faster response
}

// SVG logo points up by default, but Math.atan2(0, 1) = 0° points right
const ROTATION_OFFSET = 90;

/**
 * Normalize an angular delta to the shortest path in [-180, 180).
 * Works regardless of how far the source angle has drifted from 0.
 */
const normalizeAngleDelta = (delta: number): number => {
  return ((((delta + 180) % 360) + 360) % 360) - 180;
};

export const useCursorTracking = ({
  containerRef,
  logoRef,
  enabled,
  smoothingFactor = 0.15,
}: UseCursorTrackingProps) => {
  const [rotation, setRotation] = useState(0);
  const rotationStateRef = useRef<LogoRotationState>({ current: 0, target: 0 });
  const rafIdRef = useRef<number | null>(null);
  const isFirstMouseMoveRef = useRef(true);
  const isMouseInViewportRef = useRef(true);

  // Mouse move handler — updates target angle via ref (no React state)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled || !containerRef.current || !logoRef.current) return;

      const logoRect = logoRef.current.getBoundingClientRect();
      const logoCenterX = logoRect.left + logoRect.width / 2;
      const logoCenterY = logoRect.top + logoRect.height / 2;

      const deltaX = e.clientX - logoCenterX;
      const deltaY = e.clientY - logoCenterY;

      const angleRad = Math.atan2(deltaY, deltaX);
      const angleDeg = angleRad * (180 / Math.PI) + ROTATION_OFFSET;

      // Resolve to nearest equivalent of angleDeg from current position
      const current = rotationStateRef.current.current;
      const nearest = current + normalizeAngleDelta(angleDeg - current);

      if (isFirstMouseMoveRef.current) {
        rotationStateRef.current.current = nearest;
        rotationStateRef.current.target = nearest;
        setRotation(nearest);
        isFirstMouseMoveRef.current = false;
        return;
      }

      rotationStateRef.current.target = nearest;
    },
    [enabled, containerRef, logoRef]
  );

  const handleMouseEnter = useCallback(() => {
    isMouseInViewportRef.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isMouseInViewportRef.current = false;
  }, []);

  // Smooth animation loop — lerp toward target every frame, push to React state
  useEffect(() => {
    if (!enabled) return;

    const animate = () => {
      const state = rotationStateRef.current;
      const delta = state.target - state.current;
      state.current += delta * smoothingFactor;

      // Always push to React state — the SVG has no CSS transition during
      // cursor tracking, so every frame matters for smoothness
      setRotation(state.current);

      if (isMouseInViewportRef.current || Math.abs(delta) > 0.01) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, smoothingFactor]);

  // Attach/detach mouse listener
  useEffect(() => {
    if (!enabled) return;

    isFirstMouseMoveRef.current = true;

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enabled, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  /**
   * Set rotation with shortest path from current position.
   * Used when overriding for node-based rotation.
   */
  const setRotationSmooth = useCallback((targetAngle: number) => {
    const current = rotationStateRef.current.current;
    const nearest = current + normalizeAngleDelta(targetAngle - current);

    rotationStateRef.current.target = nearest;
    rotationStateRef.current.current = nearest;

    setRotation(nearest);
  }, []);

  return {
    rotation,
    setRotation: setRotationSmooth,
  };
};
