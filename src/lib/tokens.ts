/**
 * The palette. Canonical for everything that is not a Tailwind class.
 * Contrast is measured against the cream ground; every value here clears
 * WCAG AA for its documented use. Enforced by `pnpm tokens:check`.
 */
export const PALETTE = {
  background: "#f2f0e6",
  text: "#1a1a1a",
  terracotta: "#a9543b",
  lapis: "#004e98",
  gold: "#ffd700",
  amber: "#ffbf00",

  /*
   * The CV document's own scale. Here rather than in the component so one
   * declaration serves both the stylesheet and the Tailwind utilities, and so
   * `pnpm tokens:check` covers it — it was unguarded by construction while it
   * lived in the component.
   *
   * `ink-2` is 6.72:1 and `ink-3` is 4.74:1, both cleared for body text.
   * `rail`, `rule` and `rule-soft` are surfaces and hairlines. They are far
   * below any text threshold and must never carry type.
   */
  "ink-2": "#575347",
  "ink-3": "#6e6a5c",
  rail: "#eceadc",
  rule: "#d9d4c4",
  "rule-soft": "#e4e0d2",
} as const;

export type PaletteToken = keyof typeof PALETTE;

/**
 * The GitHub banner's dark ground, derived for that ground rather than inverted
 * from the light set — `lapis` manages only 2.2:1 there. Independent of
 * PALETTE, so a light-token change does not restyle the dark banner.
 */
export const DARK_BANNER = {
  background: "#161410",
  text: "#e8e4d6",
  terracotta: "#c2634a",
  lapis: "#4d9be8",
  grid: "#211e17",
} as const;

/** The hairline grid on the cream ground, in `GridBackground` and every jig. */
export const GRID_LINE = "#e5e5e5";

/** For a translucent token inside a raw CSS string, where `/nn` is unavailable. */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  return (
    hex +
    Math.round(clamped * 255)
      .toString(16)
      .padStart(2, "0")
  );
}
