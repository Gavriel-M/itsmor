/**
 * The palette. Canonical for everything that is not a Tailwind class.
 * Contract and contrast measurements: `~/logzio/career/08-tokens.md`.
 * Enforced by `pnpm tokens:check`.
 */
export const PALETTE = {
  background: "#f2f0e6",
  text: "#1a1a1a",
  terracotta: "#a9543b",
  lapis: "#004e98",
  gold: "#ffd700",
  amber: "#ffbf00",
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
