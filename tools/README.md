# tools/

Screenshot jigs. **Deliberately not part of the site.**

`output: "export"` in `next.config.ts` publishes every route under `src/app/`, and
`deploy.sh` syncs the whole of `out/` to S3 with `--delete`. So a render jig living at
`src/app/banner/` becomes a real public page at `itsmor.com/banner` the moment it is
committed and deployed — which is what these files exist to avoid. Same reasoning, and
the same pattern, as `~/logzio/career/assets/linkedin-banner.html`.

| File                 | Canvas     | Feeds                                                                            |
| -------------------- | ---------- | -------------------------------------------------------------------------------- |
| `og-card.html`       | 1200 × 630 | `src/app/opengraph-image.png` and `src/app/twitter-image.png` — the link preview |
| `github-banner.html` | 1536 × 384 | The GitHub profile README banner. `?variant=dark` for the dark capture           |

```bash
./tools/capture.sh       # renders everything into tools/out/, installs the OG card
```

`tools/out/` is gitignored: it is generated output, and the two files the site actually
needs are copied into `src/app/` by the script.

## Notes

- Both jigs carry the site's tokens as literals rather than importing `globals.css`, so a
  token change in the app does not silently reach them. If `--color-terracotta` or
  `--color-lapis` move, update both files. The comment blocks at the top of each say
  which part of `Hero.tsx` / `MagneticCircle.tsx` / `GridBackground.tsx` each shape came
  from.
- Fonts come from Google Fonts over the network, so `capture.sh` needs connectivity.
  `--virtual-time-budget` gives them time to land; if type ever renders as a fallback,
  raise it.
- Chrome writes the screenshot and then does not exit. `capture.sh` backgrounds it and
  reaps it once the PNG size holds steady, with a hard ceiling, rather than waiting on a
  process that never returns.
- The GitHub banner PNGs stay in `tools/out/`. Copy the one you want into
  `~/logzio/career/assets/` and record it there — that directory is the register for
  profile assets, and nothing in `03-github.md` mentions this banner yet.
