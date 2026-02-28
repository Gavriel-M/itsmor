import type { CascadeGlowTransition, CascadeGlowFrame } from "./types";

/**
 * Auto-generate a glow-morph transition that sweeps left-to-right,
 * morphing characters from `hoverText` → `clickText`.
 */
export function generateGlowTransition(
  hoverText: string,
  clickText: string
): CascadeGlowTransition {
  const maxLen = Math.max(hoverText.length, clickText.length);
  const frames: CascadeGlowFrame[] = [];

  for (let i = 0; i < maxLen; i++) {
    const morphed = clickText.slice(0, i + 1);
    const remaining = hoverText.slice(i + 1);
    const text = morphed + remaining;
    frames.push({ text, glowIndex: Math.min(i, text.length - 1) });
  }

  return { frames, confirmedText: clickText };
}
