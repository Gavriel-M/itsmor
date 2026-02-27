import { useState, useRef, useEffect, useCallback } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";
import { DEFAULT_TIMING } from "./constants";
import type {
  CascadePhase,
  CascadeGlowFrame,
  UseTextCascadeOptions,
  TextCascadeState,
} from "./types";

export function useTextCascade(
  options: UseTextCascadeOptions
): TextCascadeState {
  const { text, glowTransition } = options;
  const charStepMs = options.timing?.charStepMs ?? DEFAULT_TIMING.charStepMs;
  const charTransitionMs =
    options.timing?.charTransitionMs ?? DEFAULT_TIMING.charTransitionMs;
  const confirmHoldMs =
    options.timing?.confirmHoldMs ?? DEFAULT_TIMING.confirmHoldMs;

  const [phase, setPhase] = useState<CascadePhase>("idle");
  const [glowFrame, setGlowFrame] = useState(0);
  const [revealCount, setRevealCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTextRef = useRef(text);
  const enterStartRef = useRef(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startExiting = useCallback(
    (exitText: string, fromCount: number) => {
      clearTimers();
      exitTextRef.current = exitText;

      if (fromCount <= 0) {
        setPhase("idle");
        setRevealCount(0);
        return;
      }

      if (prefersReduced) {
        setRevealCount(0);
        setPhase("idle");
        return;
      }

      setRevealCount(fromCount);
      setPhase("exiting");

      // Single timeout: wait for all exit animations to complete
      const exitDuration = (fromCount - 1) * charStepMs + charTransitionMs;
      timeoutRef.current = setTimeout(() => {
        setPhase("idle");
        setRevealCount(0);
      }, exitDuration);
    },
    [clearTimers, prefersReduced, charStepMs, charTransitionMs]
  );

  const enter = useCallback(() => {
    if (phase !== "idle") return;

    if (prefersReduced) {
      setRevealCount(text.length);
      setPhase("visible");
      return;
    }

    enterStartRef.current = Date.now();
    setPhase("entering");

    // Single timeout: wait for all enter animations to complete
    const enterDuration = (text.length - 1) * charStepMs + charTransitionMs;
    timeoutRef.current = setTimeout(() => {
      setRevealCount(text.length);
      setPhase("visible");
    }, enterDuration);
  }, [phase, prefersReduced, text.length, charStepMs, charTransitionMs]);

  const exit = useCallback(() => {
    if (phase === "entering") {
      if (prefersReduced) {
        clearTimers();
        setRevealCount(0);
        setPhase("idle");
        return;
      }
      // Compute how many chars were revealed from elapsed time
      const elapsed = Date.now() - enterStartRef.current;
      const interruptedCount = Math.min(
        Math.floor(elapsed / charStepMs) + 1,
        text.length
      );
      startExiting(text, interruptedCount);
    } else if (phase === "visible") {
      if (prefersReduced) {
        clearTimers();
        setRevealCount(0);
        setPhase("idle");
        return;
      }
      startExiting(text, text.length);
    }
  }, [phase, prefersReduced, clearTimers, startExiting, text, charStepMs]);

  const confirm = useCallback(() => {
    if (!glowTransition) return;
    if (phase === "glowing" || phase === "confirmed") return;

    clearTimers();

    if (prefersReduced) {
      setPhase("confirmed");
      setRevealCount(glowTransition.confirmedText.length);
      exitTextRef.current = glowTransition.confirmedText;
      timeoutRef.current = setTimeout(() => {
        setPhase("idle");
        setRevealCount(0);
      }, confirmHoldMs);
      return;
    }

    setPhase("glowing");
    setGlowFrame(0);
    let frame = 0;
    intervalRef.current = setInterval(() => {
      frame++;
      if (frame >= glowTransition.frames.length) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setPhase("confirmed");
        timeoutRef.current = setTimeout(() => {
          startExiting(
            glowTransition.confirmedText,
            glowTransition.confirmedText.length
          );
        }, confirmHoldMs);
      } else {
        setGlowFrame(frame);
      }
    }, charStepMs);
  }, [
    glowTransition,
    phase,
    prefersReduced,
    clearTimers,
    startExiting,
    charStepMs,
    confirmHoldMs,
  ]);

  const glowFrameData: CascadeGlowFrame | null =
    phase === "glowing" && glowTransition
      ? glowTransition.frames[glowFrame]
      : null;

  const displayText =
    glowFrameData?.text ??
    (phase === "confirmed" && glowTransition
      ? glowTransition.confirmedText
      : phase === "exiting"
        ? exitTextRef.current
        : text);

  // Glow is only JS-driven during glow-morph; enter/exit glow is CSS-driven
  const glowCharIndex =
    phase === "glowing" && glowFrameData ? glowFrameData.glowIndex : -1;

  const isExpanded = phase !== "idle";

  const isConfirmed =
    phase === "glowing" ||
    phase === "confirmed" ||
    (phase === "exiting" &&
      glowTransition != null &&
      exitTextRef.current === glowTransition.confirmedText);

  return {
    phase,
    displayText,
    revealCount,
    glowCharIndex,
    charStepMs,
    isExpanded,
    isConfirmed,
    enter,
    exit,
    confirm,
  };
}
