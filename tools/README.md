# tools/

Screenshot jigs and the token guard. **The jigs are deliberately not part of the site.**

`output: "export"` in `next.config.ts` publishes every route under `src/app/`, and
`deploy.sh` syncs the whole of `out/` to S3 with `--delete`. So a render jig living at
`src/app/banner/` becomes a real public page at `itsmor.com/banner` the moment it is
committed and deployed — which is what these files exist to avoid.

## The jigs

All three live here, and all three read one token module.

| File                   | Canvas     | Feeds                                                                        |
| ---------------------- | ---------- | ---------------------------------------------------------------------------- |
| `og-card.html`         | 1200 × 630 | `src/assets/og-card.png` — statically imported, so the URL is content-hashed |
| `github-banner.html`   | 1536 × 384 | The GitHub profile README banner. `?variant=dark` for the dark capture       |
| `linkedin-banner.html` | 1584 × 396 | The LinkedIn profile banner                                                  |

```bash
./tools/capture.sh    # regenerates tokens, renders everything, installs the OG card
pnpm tokens:check     # asserts nothing has drifted
```

Sources live with the code; exported PNGs live with the README or profile that
references them.

## Tokens

`src/lib/tokens.ts` is the single source. Nothing here hardcodes a palette hex, and
`pnpm tokens:check` fails if anything starts to.

- `gen-tokens.mjs` writes `tokens.generated.css` from the module. The jigs are
  standalone HTML opened over `file://`, so they cannot import TypeScript — they link
  the generated stylesheet instead. It is **committed**, not gitignored, so opening a
  jig directly in a browser still renders correctly; it is verified the way a lockfile
  is, and `capture.sh` regenerates it before every render.
- `check-tokens.mjs` asserts that `globals.css`'s `@theme` block agrees with the module, that no palette hex
  appears anywhere else in `src/` (including `.css` below the `@theme` block) or in a jig,
  and that the generated stylesheet is current. It covers every exported colour, not just
  `PALETTE` — `GRID_LINE` and `DARK_BANNER` were unguarded, and a jig had already
  hardcoded the grid line. Location-based, not count-based.
- `check-routes.mjs` asserts `out/` publishes only intended routes. See
  `CLAUDE.md > Metadata & SEO`.

Each jig's comment header says which part of `Hero.tsx` / `MagneticCircle.tsx` /
`GridBackground.tsx` its shapes came from. Nothing is approximated by eye.

## Notes

- **Fonts come from Google Fonts over the network**, so `capture.sh` needs
  connectivity. `--virtual-time-budget` gives them time to land; if type ever renders
  in a fallback face, raise it.
- **Chrome writes the screenshot and then does not exit.** `capture.sh` backgrounds it
  and reaps it once the PNG size holds steady, with a hard ceiling, rather than waiting
  on a process that never returns.
- **`tools/out/` is gitignored and disposable.** The canonical exports are the ones
  committed next to the README or profile that references them.
- **Re-rendering a banner changes its glyph rasterisation** even when no colour moved,
  by roughly 1.5% of pixels confined to the text block. That is not a reason to
  re-upload. Diff the colour tallies, not the byte count, before declaring an asset
  stale.
