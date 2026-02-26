"use client";

import { useCallback, useState } from "react";

export function PlayButton({
  onClick,
  disabled = false,
  label = "Play",
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 border border-black/10 hover:border-terracotta focus-visible:border-terracotta focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
    >
      {label}
    </button>
  );
}

export function DemoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
      {children}
    </span>
  );
}

export function ToggleButton({
  active,
  onClick,
  activeColor = "terracotta",
  children,
}: {
  active: boolean;
  onClick: () => void;
  activeColor?: "terracotta" | "lapis";
  children: React.ReactNode;
}) {
  const activeClass =
    activeColor === "lapis"
      ? "text-lapis border-b border-lapis"
      : "text-terracotta border-b border-terracotta";

  return (
    <button
      onClick={onClick}
      className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 transition-colors ${
        active ? activeClass : "opacity-50 hover:opacity-80"
      }`}
    >
      {children}
    </button>
  );
}

export function useResetKey(): [number, () => void] {
  const [key, setKey] = useState(0);
  const reset = useCallback(() => setKey((k) => k + 1), []);
  return [key, reset];
}
