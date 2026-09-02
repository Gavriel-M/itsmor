/**
 * The palette. Canonical for everything that is not a Tailwind class.
 *
 * The contract is `~/logzio/career/08-tokens.md`. Contrast is measured against
 * the cream ground; re-derive with the snippet in that document's Verification
 * section. `./check.sh --tokens` there, and `pnpm tokens:check` here, enforce
 * what can be enforced mechanically.
 *
 * ┌──────────────┬───────────┬───────────┬──────────────────────────────────┐
 * │ token        │ hex       │ on cream  │ use rule                         │
 * ├──────────────┼───────────┼───────────┼──────────────────────────────────┤
 * │ text         │ #1a1a1a   │ 15.23:1   │ body, headings, anything long    │
 * │ lapis        │ #004e98   │  7.23:1   │ the safe accent — default for    │
 * │              │           │           │ small text, links, mono labels   │
 * │ terracotta   │ #a9543b   │  4.57:1   │ accent text at normal size and   │
 * │              │           │           │ above                            │
 * │ gold         │ #ffd700   │  1.23:1   │ NEVER text. Decoration only      │
 * │ amber        │ #ffbf00   │  1.45:1   │ NEVER text. Decoration only      │
 * └──────────────┴───────────┴───────────┴──────────────────────────────────┘
 *
 * Retired: terracotta `#b85b40` at 3.99:1, which failed AA normal in nine
 * places and about fifty rendered instances. Do not reintroduce it.
 *
 * Three rules that are easy to get wrong:
 *
 * 1. **Opacity is part of the colour.** `#a9543b` under `opacity-80`
 *    composites to `#b8735d` = 3.25:1 and still fails AA normal. There is no
 *    opacity below 100% that clears 4.5:1 with this colour, so remove the
 *    opacity rather than reducing it. Measure the composite, never the token.
 * 2. **Gold and amber may never carry text, a border that means something, or
 *    an icon that carries state.** At 1.23:1 gold is barely distinguishable
 *    from the ground. `--cascade-glow-color` is legitimate: a momentary glow
 *    on a character mid-animation is decoration, not information.
 * 3. **No hex literals anywhere else in `src/`.** This file is the only place
 *    a palette hex may appear, and `pnpm tokens:check` asserts exactly that.
 *
 * `src/app/globals.css` has to repeat these values as literals, because
 * Tailwind v4's `@theme` block needs them in CSS to generate the utilities and
 * custom properties. That repetition is checked, not trusted — see
 * `tools/check-tokens.mjs`.
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
 * The banner jig's dark ground, for the GitHub profile README's dark theme.
 *
 * Derived for its own ground rather than inverted from the light set, which is
 * why it does not live in PALETTE: the cream's warmth is kept at very low
 * lightness (both sit near 45deg hue), and lapis is lifted along its own 209deg
 * hue until it clears 4.5:1 there — `#004e98` manages only 2.2:1 on this ground
 * and all but disappears. The grid line is tuned to the same 1.10:1 against its
 * ground that `#e5e5e5` has against the cream.
 *
 * Deliberately NOT re-derived when terracotta moved from `#b85b40` to
 * `#a9543b`. This set never referenced the light value — it was measured
 * against `#161410` independently, and `#c2634a` still clears AA there. Re-
 * deriving it would restyle a live asset to fix nothing.
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

/**
 * Appends an 8-bit hex alpha suffix, for the few places that need a translucent
 * token in a raw CSS string rather than a Tailwind `/nn` opacity modifier.
 *
 * @example withAlpha(PALETTE.background, 0.75) // "#f2f0e6bf"
 */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  return (
    hex +
    Math.round(clamped * 255)
      .toString(16)
      .padStart(2, "0")
  );
}
