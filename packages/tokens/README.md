# @itsmor/tokens

The design tokens of [itsmor.com](https://www.itsmor.com), published so other surfaces read the
same values instead of copying them.

```bash
pnpm add @itsmor/tokens
```

## Tailwind v4

```css
@import "tailwindcss";
@import "@itsmor/tokens/theme.css";
```

This gives `bg-background`, `text-text`, `text-lapis`, `border-rule` and the rest, plus
`--grid-cell` (4rem) and `--grid-line` on `:root`.

## TypeScript

```ts
import { PALETTE, GRID_CELL, withAlpha } from "@itsmor/tokens";

ctx.strokeStyle = withAlpha(PALETTE.lapis, 0.4);
```

For canvas, WebGL and anything else that cannot use a class. `withAlpha` takes a six-digit hex
and throws on anything else. `GRID_CELL` is the 4rem layout unit.

## Use rules

Contrast is measured against the cream ground, `background`.

- **Text is `text` or `lapis`.** `terracotta` is cleared for normal text only at full opacity.
- **`gold` and `amber` are never text, never state.** Both are under 1.5:1 on the ground.
- **Opacity is part of the colour.** `opacity-70` is the floor for text; measure the composite,
  never the token.
- **`rail`, `rule` and `rule-soft` are surfaces and hairlines.** They never carry type.

## Licence

MIT
