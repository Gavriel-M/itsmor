/** Contrast is measured against `background`; every value clears WCAG AA for its documented use. */
export const PALETTE = {
  background: "#f2f0e6",
  text: "#1a1a1a",
  terracotta: "#a9543b",
  lapis: "#004e98",
  gold: "#ffd700",
  amber: "#ffbf00",

  /** `rail`, `rule` and `rule-soft` are surfaces and hairlines and must never carry type. */
  "ink-2": "#575347",
  "ink-3": "#6e6a5c",
  rail: "#eceadc",
  rule: "#d9d4c4",
  "rule-soft": "#e4e0d2",
} as const;

export type PaletteToken = keyof typeof PALETTE;

/** Derived for its own ground, not inverted from `PALETTE`: lapis manages only 2.2:1 there. */
export const DARK_BANNER = {
  background: "#161410",
  text: "#e8e4d6",
  terracotta: "#c2634a",
  lapis: "#4d9be8",
  grid: "#211e17",
} as const;

export const GRID_LINE = "#e5e5e5";

export const GRID_CELL = "4rem";

type HexColour = `#${string}`;

const SIX_DIGIT_HEX = /^#[0-9a-f]{6}$/i;

export function withAlpha(hex: HexColour, alpha: number): string {
  if (!SIX_DIGIT_HEX.test(hex)) {
    throw new Error(`withAlpha expects a six-digit hex, got ${hex}`);
  }
  const clamped = Math.max(0, Math.min(1, alpha));
  return (
    hex +
    Math.round(clamped * 255)
      .toString(16)
      .padStart(2, "0")
  );
}
