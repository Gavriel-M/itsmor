"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigation } from "@/contexts/NavigationContext";

const PAGE_ORDER = ["/", "/work", "/about", "/contact", "/"];

// Configuration
const SCROLL_THRESHOLD = 10; // px from bottom to consider "at bottom"
const GRACE_PERIOD = 800; // ms grace period before accepting wheel events
const MIN_WHEEL_FOR_100VH = 150; // cumulative deltaY required for 100vh pages
const PROGRESS_SPEED = 5; // wheel deltaY pixels per 1% progress
const DECAY_DELAY = 300; // ms idle before decay starts
const LOADER_WIDTH = 250; // px

type LoaderState =
  | "idle" // Not at bottom
  | "appearing" // Just reached bottom, grace period active
  | "ready" // Grace period over, accepting wheel events
  | "loading" // Actively filling
  | "decaying" // No activity, slowly emptying
  | "triggering"; // Reached 100%, navigating

/**
 * Get the next page in the navigation order
 */
const getNextPage = (currentPath: string): string | null => {
  const currentIndex = PAGE_ORDER.indexOf(currentPath);
  if (currentIndex === -1 || currentIndex === PAGE_ORDER.length - 1) {
    return null; // No next page
  }
  return PAGE_ORDER[currentIndex + 1];
};

/**
 * Check if user is at the bottom of the page
 * Works for both scrollable pages and 100vh pages
 */
const isAtBottom = (threshold = SCROLL_THRESHOLD): boolean => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;

  // For pages with no scroll (100vh pages)
  if (scrollHeight <= clientHeight) {
    return true; // Always considered "at bottom"
  }

  // For scrollable pages
  const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
  return distanceFromBottom <= threshold;
};

/**
 * ScrollNavigationLoader Component
 *
 * Enhanced scroll-to-navigate with:
 * - Grace period to prevent accidental activation
 * - Progress decay when user stops scrolling
 * - Better 100vh page handling
 * - Visual hints and feedback
 */
export const ScrollNavigationLoader = () => {
  const pathname = usePathname();
  const { navigate, transitionStage } = useNavigation();
  const [loaderState, setLoaderState] = useState<LoaderState>("idle");
  const [progress, setProgress] = useState(0);
  const lastWheelTimeRef = useRef<number>(0);
  const cumulativeDeltaRef = useRef<number>(0);
  const decayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize lastWheelTimeRef after mount
  useEffect(() => {
    lastWheelTimeRef.current = Date.now();
  }, []);

  const nextPage = getNextPage(pathname);
  const isEnabled = nextPage !== null && transitionStage === "idle";

  /**
   * Check scroll position and update loader state
   */
  const checkScrollPosition = useCallback(() => {
    if (!isEnabled) return;

    const atBottom = isAtBottom();

    if (atBottom && loaderState === "idle") {
      // User reached bottom, start grace period
      setLoaderState("appearing");
      setProgress(0);
      cumulativeDeltaRef.current = 0;
    } else if (
      !atBottom &&
      (loaderState === "appearing" ||
        loaderState === "ready" ||
        loaderState === "loading" ||
        loaderState === "decaying")
    ) {
      // User scrolled away from bottom, reset everything
      setLoaderState("idle");
      setProgress(0);
      cumulativeDeltaRef.current = 0;
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
        decayTimeoutRef.current = null;
      }
    }
  }, [isEnabled, loaderState]);

  /**
   * Handle wheel events for progress tracking
   * Now also handles loader activation on first scroll
   */
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isEnabled || loaderState === "triggering") return;

      // Only track downward scrolls
      if (e.deltaY <= 0) return;

      const atBottom = isAtBottom();

      // Check if page has scroll
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const hasScroll = scrollHeight > clientHeight + 50;

      // For 100vh pages: activate loader on first downward scroll
      if (!hasScroll && loaderState === "idle") {
        setLoaderState("appearing");
        setProgress(0);
        cumulativeDeltaRef.current = 0;
        return; // Wait for grace period to complete
      }

      // For scrollable pages: activate loader when user scrolls to bottom
      if (hasScroll && loaderState === "idle" && atBottom) {
        setLoaderState("appearing");
        setProgress(0);
        cumulativeDeltaRef.current = 0;
        return; // Wait for grace period to complete
      }

      // If not at bottom on scrollable page, don't proceed
      if (hasScroll && !atBottom) return;

      // Ignore wheel events during grace period
      if (loaderState === "appearing") return;

      // Update last wheel time and reset decay timeout
      lastWheelTimeRef.current = Date.now();

      // Clear decay timeout since user is actively scrolling
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
        decayTimeoutRef.current = null;
      }

      // For 100vh pages, require minimum cumulative delta before filling
      if (!hasScroll) {
        cumulativeDeltaRef.current += e.deltaY;
        if (cumulativeDeltaRef.current < MIN_WHEEL_FOR_100VH) {
          return; // Not enough deliberate scrolling yet
        }
      }

      // Calculate progress change
      const deltaProgress = e.deltaY / PROGRESS_SPEED;

      setProgress((prev) => {
        const newProgress = Math.max(0, Math.min(100, prev + deltaProgress));

        // Transition from ready to loading
        if (
          newProgress > 0 &&
          (loaderState === "ready" || loaderState === "decaying")
        ) {
          setLoaderState("loading");
        }

        return newProgress;
      });
    },
    [isEnabled, loaderState]
  );

  /**
   * Grace period: Transition from "appearing" to "ready" after delay
   */
  useEffect(() => {
    if (loaderState === "appearing") {
      const timer = setTimeout(() => {
        setLoaderState("ready");
      }, GRACE_PERIOD);

      return () => clearTimeout(timer);
    }
  }, [loaderState]);

  /**
   * Progress decay: Trigger decay state after idle period
   * Uses single timeout instead of interval for better performance
   */
  useEffect(() => {
    if (loaderState !== "loading" || progress === 0) return;

    // Clear any existing timeout
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current);
    }

    // Set new timeout to start decay after DECAY_DELAY
    decayTimeoutRef.current = setTimeout(() => {
      const timeSinceLastWheel = Date.now() - lastWheelTimeRef.current;
      if (timeSinceLastWheel >= DECAY_DELAY) {
        setLoaderState("decaying");
      }
    }, DECAY_DELAY);

    return () => {
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
        decayTimeoutRef.current = null;
      }
    };
  }, [loaderState, progress]);

  /**
   * Trigger navigation when progress reaches 100%
   */
  useEffect(() => {
    if (progress >= 100 && loaderState === "loading" && nextPage) {
      const timer = setTimeout(() => {
        setLoaderState("triggering");
        navigate(nextPage);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [progress, loaderState, nextPage, navigate]);

  /**
   * Set up scroll listener
   * Only responds to actual scroll events, no eager initialization
   */
  useEffect(() => {
    if (!isEnabled) return;

    window.addEventListener("scroll", checkScrollPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, [isEnabled, checkScrollPosition]);

  /**
   * Set up wheel listener
   */
  useEffect(() => {
    if (!isEnabled) return;

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isEnabled, handleWheel]);

  /**
   * Reset state when pathname changes (after navigation)
   * Clean slate for new page - loader will only appear when user scrolls
   */
  useEffect(() => {
    setLoaderState("idle");
    setProgress(0);
    cumulativeDeltaRef.current = 0;
    if (decayTimeoutRef.current) {
      clearTimeout(decayTimeoutRef.current);
      decayTimeoutRef.current = null;
    }
  }, [pathname]);

  // Don't render if feature is disabled
  if (!isEnabled) {
    return null;
  }

  const showLoader = loaderState !== "idle";
  const showHint =
    loaderState === "appearing" ||
    loaderState === "ready" ||
    loaderState === "decaying";
  const showPercentage = loaderState === "loading" && progress > 10;

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3"
        >
          {/* Hint text with animated arrow */}
          <AnimatePresence mode="wait">
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-1"
              >
                {/* Bouncing arrow - uses CSS animation for performance */}
                <div
                  className="text-terracotta text-xl"
                  style={{
                    animation:
                      loaderState === "ready" || loaderState === "decaying"
                        ? "bounce-gentle 1s ease-in-out infinite"
                        : "none",
                  }}
                >
                  ↓
                </div>

                {/* Hint text - uses CSS animation for performance */}
                <p
                  className="text-xs font-mono text-text"
                  style={{
                    animation: "pulse-slow 2s ease-in-out infinite",
                    opacity: loaderState === "decaying" ? 0.5 : 0.6,
                  }}
                >
                  {loaderState === "appearing"
                    ? "Get ready..."
                    : loaderState === "decaying"
                      ? "Keep going..."
                      : "Keep scrolling"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar container */}
          <div className="relative" style={{ width: LOADER_WIDTH }}>
            {/* Background track */}
            <div className="h-1 bg-text/20 rounded-full overflow-hidden relative">
              {/* Progress fill with glow */}
              <motion.div
                className="h-full bg-terracotta rounded-full relative"
                animate={{
                  width: loaderState === "decaying" ? "0%" : `${progress}%`,
                }}
                transition={{
                  duration: loaderState === "decaying" ? progress / 18 : 0.1,
                  ease: loaderState === "decaying" ? "linear" : "easeOut",
                }}
                onAnimationComplete={() => {
                  // Only update React state when decay animation completes
                  if (loaderState === "decaying") {
                    setProgress(0);
                    setLoaderState("ready");
                  }
                }}
              >
                {/* Glow effect */}
                {progress > 0 && (
                  <motion.div
                    className="absolute inset-0 bg-terracotta blur-sm opacity-60"
                    style={{
                      filter: `blur(${Math.min(progress * 0.05, 4)}px)`,
                    }}
                  />
                )}
              </motion.div>
            </div>

            {/* Progress percentage */}
            <AnimatePresence>
              {showPercentage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-terracotta"
                >
                  {Math.round(progress)}%
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
