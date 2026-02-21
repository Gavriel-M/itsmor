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

interface NavigationContextValue {
  navigate: (href: string) => void;
  transitionStage: TransitionStage;
  onExitComplete: () => void;
  targetPath: string | null;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [transitionStage, setTransitionStage] =
    useState<TransitionStage>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const exitCompleteCalledRef = useRef(false);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;
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
      router.push(targetPath);
    }
    setTransitionStage("navigating");
  }, [targetPath, router]);

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
    if (transitionStage === "navigating" && pathname === targetPath) {
      setTransitionStage("entering");
    }
  }, [transitionStage, pathname, targetPath]);

  // Safety fallback: if pathname never updates during "navigating"
  useEffect(() => {
    if (transitionStage !== "navigating") return;

    const timeout = setTimeout(() => {
      setTransitionStage("entering");
    }, NAVIGATION_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [transitionStage]);

  // Timeout-driven entering → idle (core fix)
  useEffect(() => {
    if (transitionStage !== "entering") return;

    const timeout = setTimeout(() => {
      setTransitionStage("idle");
      setTargetPath(null);
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
