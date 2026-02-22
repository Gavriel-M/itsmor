"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type TransitionStage = "idle" | "exiting" | "navigating" | "entering";

const ANIMATION_DURATION_MS = 400;
const SAFETY_BUFFER_MS = 100;
const NAVIGATION_TIMEOUT_MS = 3000;
const TRANSITION_INTENT_KEY = "itsmor-transition";
const INTENT_TTL_MS = 5000;

interface TransitionIntent {
  targetPath: string;
  timestamp: number;
}

interface NavigationContextValue {
  navigate: (href: string) => void;
  transitionStage: TransitionStage;
  onExitComplete: () => void;
  targetPath: string | null;
  isRecovering: boolean;
}

/** Strip trailing slash, keeping "/" intact */
function normalizePath(path: string): string {
  return path === "/" ? path : path.replace(/\/+$/, "");
}

function writeTransitionIntent(targetPath: string): void {
  try {
    const intent: TransitionIntent = {
      targetPath,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(TRANSITION_INTENT_KEY, JSON.stringify(intent));
  } catch {
    // sessionStorage may be unavailable (private browsing, etc.)
  }
}

function readTransitionIntent(): TransitionIntent | null {
  try {
    const raw = sessionStorage.getItem(TRANSITION_INTENT_KEY);
    if (!raw) return null;
    const intent: TransitionIntent = JSON.parse(raw);
    if (Date.now() - intent.timestamp > INTENT_TTL_MS) {
      sessionStorage.removeItem(TRANSITION_INTENT_KEY);
      return null;
    }
    return intent;
  } catch {
    return null;
  }
}

function clearTransitionIntent(): void {
  try {
    sessionStorage.removeItem(TRANSITION_INTENT_KEY);
  } catch {
    // noop
  }
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Compute recovery state once on first render to avoid race conditions
  // from multiple readTransitionIntent() calls at TTL boundary
  const [recoveryIntent] = useState(() => {
    if (typeof window === "undefined") return null;
    const intent = readTransitionIntent();
    if (
      intent &&
      normalizePath(pathname) === normalizePath(intent.targetPath)
    ) {
      return intent;
    }
    return null;
  });

  const [transitionStage, setTransitionStage] = useState<TransitionStage>(
    recoveryIntent ? "navigating" : "idle"
  );
  const [targetPath, setTargetPath] = useState<string | null>(
    recoveryIntent ? recoveryIntent.targetPath : null
  );
  const [isRecovering, setIsRecovering] = useState(!!recoveryIntent);

  const exitCompleteCalledRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (normalizePath(href) === normalizePath(pathname)) return;
      if (transitionStage !== "idle") return;

      exitCompleteCalledRef.current = false;
      setTargetPath(href);
      setTransitionStage("exiting");
    },
    [pathname, transitionStage]
  );

  const onExitComplete = useCallback(() => {
    if (exitCompleteCalledRef.current) return;
    exitCompleteCalledRef.current = true;

    if (targetPath) {
      writeTransitionIntent(targetPath);
      router.push(targetPath);
    }
    setTransitionStage("navigating");
  }, [targetPath, router]);

  // Recovery effect: animate bars out after hard navigation
  useEffect(() => {
    if (!isRecovering) return;

    // Remove the hydration-gap CSS class
    document.documentElement.classList.remove("transition-recovery");

    // Clear sessionStorage now that React has taken over
    clearTransitionIntent();

    // Wait one frame for bars to render at 0%, then animate out
    const raf = requestAnimationFrame(() => {
      setTransitionStage("entering");
      setIsRecovering(false);
    });

    return () => cancelAnimationFrame(raf);
  }, [isRecovering]);

  // Safety fallback: if onAnimationComplete doesn't fire for "exiting"
  useEffect(() => {
    if (transitionStage !== "exiting") return;

    const timeout = setTimeout(() => {
      onExitComplete();
    }, ANIMATION_DURATION_MS + SAFETY_BUFFER_MS);

    return () => clearTimeout(timeout);
  }, [transitionStage, onExitComplete]);

  // Transition navigating → entering when pathname updates
  useEffect(() => {
    if (transitionStage !== "navigating") return;
    if (isRecovering) return; // Recovery handles this separately

    if (normalizePath(pathname) === normalizePath(targetPath ?? "")) {
      setTransitionStage("entering");
    }
  }, [transitionStage, pathname, targetPath, isRecovering]);

  // Safety fallback: if pathname never updates during "navigating"
  useEffect(() => {
    if (transitionStage !== "navigating") return;
    if (isRecovering) return;

    const timeout = setTimeout(() => {
      setTransitionStage("entering");
    }, NAVIGATION_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [transitionStage, isRecovering]);

  // Timeout-driven entering → idle (core fix)
  useEffect(() => {
    if (transitionStage !== "entering") return;

    const timeout = setTimeout(() => {
      setTransitionStage("idle");
      setTargetPath(null);
      clearTransitionIntent();
    }, ANIMATION_DURATION_MS + SAFETY_BUFFER_MS);

    return () => clearTimeout(timeout);
  }, [transitionStage]);

  return (
    <NavigationContext.Provider
      value={{
        navigate,
        transitionStage,
        onExitComplete,
        targetPath,
        isRecovering,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
};
