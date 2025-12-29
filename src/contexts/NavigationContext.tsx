"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type TransitionStage = "idle" | "exiting" | "navigating" | "entering";

interface NavigationContextValue {
  navigate: (href: string) => void;
  transitionStage: TransitionStage;
  onExitComplete: () => void;
  onEnterComplete: () => void;
  targetPath: string | null;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [transitionStage, setTransitionStage] =
    useState<TransitionStage>("idle");
  const [targetPath, setTargetPath] = useState<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      if (transitionStage !== "idle") return;

      setTargetPath(href);
      setTransitionStage("exiting");
    },
    [pathname, transitionStage]
  );

  const onExitComplete = useCallback(() => {
    if (targetPath) {
      router.push(targetPath);
    }
    setTransitionStage("navigating");
  }, [targetPath, router]);

  const onEnterComplete = useCallback(() => {
    setTransitionStage("idle");
    setTargetPath(null);
  }, []);

  useEffect(() => {
    if (transitionStage === "navigating" && pathname === targetPath) {
      setTransitionStage("entering");
    }
  }, [transitionStage, pathname, targetPath]);

  return (
    <NavigationContext.Provider
      value={{
        navigate,
        transitionStage,
        onExitComplete,
        onEnterComplete,
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
