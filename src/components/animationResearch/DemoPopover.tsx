"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { EASE_OUT_EXPO } from "@/lib/motion/easing";
import { DEMO_MAP } from "./demos";
import type { DemoId, DemoLegendItem } from "./types";

type StoredPopoverState = {
  isOpen: boolean;
  x: number;
  y: number;
};

const STORAGE_KEY = "itsmor:animationResearchDemoPopover:v1";

const DEFAULT_MARGIN = 16;
const DEFAULT_COLLAPSED_HEIGHT = 44;

type SafeAreaInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readSafeAreaInsets(): SafeAreaInsets {
  if (typeof document === "undefined") {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const el = document.createElement("div");
  el.style.padding =
    "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)";
  document.body.appendChild(el);
  const cs = window.getComputedStyle(el);
  const top = Number.parseFloat(cs.paddingTop) || 0;
  const right = Number.parseFloat(cs.paddingRight) || 0;
  const bottom = Number.parseFloat(cs.paddingBottom) || 0;
  const left = Number.parseFloat(cs.paddingLeft) || 0;
  document.body.removeChild(el);
  return { top, right, bottom, left };
}

function readStoredState(): StoredPopoverState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredPopoverState>;
    if (
      typeof parsed.isOpen !== "boolean" ||
      typeof parsed.x !== "number" ||
      typeof parsed.y !== "number"
    ) {
      return null;
    }
    return { isOpen: parsed.isOpen, x: parsed.x, y: parsed.y };
  } catch {
    return null;
  }
}

function writeStoredState(state: StoredPopoverState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage may be unavailable
  }
}

export default function DemoPopover({
  className = "",
  demoId,
  title,
  hint,
  legend,
}: {
  className?: string;
  demoId: DemoId | undefined;
  title?: string;
  hint?: string;
  legend?: DemoLegendItem[];
}) {
  const prefersReduced = usePrefersReducedMotion();
  const dragControls = useDragControls();

  const DemoComponent = demoId ? DEMO_MAP[demoId] : undefined;

  const panelRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const didInitRef = useRef(false);
  const [panelSize, setPanelSize] = useState({ width: 360, height: 300 });
  const [isOpen, setIsOpen] = useState(true);
  const [safeArea, setSafeArea] = useState<SafeAreaInsets>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const constraints = useMemo(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 0;
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;

    const width = panelSize.width;
    const height = isOpen ? panelSize.height : DEFAULT_COLLAPSED_HEIGHT;

    const insetLeft = DEFAULT_MARGIN + safeArea.left;
    const insetTop = DEFAULT_MARGIN + safeArea.top;
    const insetRight = DEFAULT_MARGIN + safeArea.right;
    const insetBottom = DEFAULT_MARGIN + safeArea.bottom;

    return {
      minX: insetLeft,
      maxX: Math.max(insetLeft, vw - width - DEFAULT_MARGIN - safeArea.right),
      minY: insetTop,
      maxY: Math.max(insetTop, vh - height - DEFAULT_MARGIN - safeArea.bottom),
      inset: {
        left: insetLeft,
        top: insetTop,
        right: insetRight,
        bottom: insetBottom,
      },
    };
  }, [panelSize.width, panelSize.height, isOpen, safeArea]);

  // Hydrate from sessionStorage once.
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const stored = readStoredState();
    if (!stored) {
      const isMobile = window.innerWidth < 768;
      const initialOpen = !isMobile;
      setIsOpen(initialOpen);
      // Default: bottom-right
      requestAnimationFrame(() => {
        x.set(constraints.maxX);
        y.set(constraints.maxY);
        writeStoredState({
          isOpen: initialOpen,
          x: constraints.maxX,
          y: constraints.maxY,
        });
      });
      return;
    }

    setIsOpen(stored.isOpen);
    x.set(stored.x);
    y.set(stored.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [constraints.maxX, constraints.maxY]);

  // Track panel size for clamping/constraints.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        setPanelSize({ width, height });
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track safe-area insets (notably important on iOS).
  useEffect(() => {
    const update = () => setSafeArea(readSafeAreaInsets());
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  // Clamp position on resize/open changes.
  useEffect(() => {
    const handleResize = () => {
      x.set(clamp(x.get(), constraints.minX, constraints.maxX));
      y.set(clamp(y.get(), constraints.minY, constraints.maxY));
    };

    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [constraints, x, y]);

  const persist = () => {
    writeStoredState({
      isOpen,
      x: clamp(x.get(), constraints.minX, constraints.maxX),
      y: clamp(y.get(), constraints.minY, constraints.maxY),
    });
  };

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      // persist in the next tick so state is updated
      requestAnimationFrame(() => {
        writeStoredState({
          isOpen: next,
          x: clamp(x.get(), constraints.minX, constraints.maxX),
          y: clamp(y.get(), constraints.minY, constraints.maxY),
        });
      });
      return next;
    });
  };

  const resetHandleCursor = () => {
    if (handleRef.current) {
      handleRef.current.style.cursor = "grab";
    }
  };

  const handleDragEnd = () => {
    resetHandleCursor();
    // Light snap-to-nearest corner if near.
    const cx = clamp(x.get(), constraints.minX, constraints.maxX);
    const cy = clamp(y.get(), constraints.minY, constraints.maxY);

    const corners = [
      { x: constraints.minX, y: constraints.minY },
      { x: constraints.maxX, y: constraints.minY },
      { x: constraints.minX, y: constraints.maxY },
      { x: constraints.maxX, y: constraints.maxY },
    ];
    const nearest = corners
      .map((c) => ({ c, d: Math.hypot(c.x - cx, c.y - cy) }))
      .sort((a, b) => a.d - b.d)[0];

    const SNAP_DISTANCE = 72;
    if (nearest && nearest.d < SNAP_DISTANCE) {
      x.set(nearest.c.x);
      y.set(nearest.c.y);
    } else {
      x.set(cx);
      y.set(cy);
    }

    persist();
  };

  const panelTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.25, ease: EASE_OUT_EXPO };

  const subtitle =
    DemoComponent && title ? title : DemoComponent ? "Demo" : "Unavailable";

  return (
    <div className={`fixed inset-0 z-60 pointer-events-none ${className}`}>
      {/* Constraint surface (viewport minus margins + safe-areas) */}
      <div
        ref={constraintsRef}
        className="absolute"
        style={{
          left: constraints.inset.left,
          top: constraints.inset.top,
          right: constraints.inset.right,
          bottom: constraints.inset.bottom,
        }}
      />

      <motion.div
        ref={panelRef}
        className="pointer-events-auto"
        style={{ x, y }}
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={!prefersReduced}
        dragTransition={{ power: 0.2, timeConstant: 200 }}
        dragConstraints={constraintsRef}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={{ width: "min(420px, calc(100vw - 2rem))" }}
      >
        <div className="border border-black/10 bg-background shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
          {/* Handle */}
          <div
            ref={handleRef}
            className="flex items-center justify-between gap-4 pr-3 pl-1 h-12 select-none"
            style={{ cursor: "grab", touchAction: "none" }}
            onPointerDown={(e) => {
              const target = e.target as Element | null;
              if (target?.closest("[data-collapse-button]")) return;
              e.preventDefault();
              dragControls.start(e);
              if (handleRef.current) {
                handleRef.current.style.cursor = "grabbing";
              }
              document.addEventListener("pointerup", resetHandleCursor, {
                once: true,
              });
            }}
          >
            <button
              type="button"
              data-collapse-button
              onPointerDown={(e) => {
                // Ensure tapping the toggle doesn't initiate a drag.
                e.stopPropagation();
              }}
              onClick={handleToggleOpen}
              className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-widest text-text/80 hover:text-text focus-visible:text-text py-2 px-2"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse demo panel" : "Expand demo panel"}
              style={{ cursor: "pointer", touchAction: "manipulation" }}
            >
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 0 : -90 }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { duration: 0.2, ease: EASE_OUT_EXPO }
                }
                className="inline-flex"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
              Demo
            </button>
            <p
              className="min-w-0 font-mono text-[11px] uppercase tracking-widest opacity-50 truncate"
              title={subtitle}
            >
              {subtitle}
            </p>
            <div className="min-w-0 flex items-center justify-end gap-3">
              <div className="flex items-center gap-1.5 opacity-50">
                <span className="w-1 h-1 rounded-full bg-terracotta" />
                <span className="w-1 h-1 rounded-full bg-terracotta" />
                <span className="w-1 h-1 rounded-full bg-terracotta" />
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={panelTransition}
                className="border-t border-black/10"
              >
                {hint && (
                  <div className="px-3 py-2 border-b border-black/10">
                    {hint && (
                      <p className="font-mono text-[10px] uppercase tracking-widest opacity-75 mt-1">
                        {hint}
                      </p>
                    )}
                    {legend && legend.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {legend.map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center gap-2"
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="aspect-4/3 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    {DemoComponent ? (
                      <motion.div
                        key={demoId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                        className="w-full h-full"
                      >
                        <Suspense
                          fallback={
                            <div className="w-full h-full flex items-center justify-center">
                              <p className="font-mono text-xs uppercase tracking-widest opacity-30">
                                Loading…
                              </p>
                            </div>
                          }
                        >
                          <DemoComponent />
                        </Suspense>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={demoId || "empty"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                        className="text-center px-4"
                      >
                        <p className="font-mono text-xs uppercase tracking-widest opacity-40">
                          {demoId ? `Demo: ${demoId}` : "Demo"}
                        </p>
                        <p className="font-mono text-xs opacity-30 mt-1">
                          This section has no demo yet.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
