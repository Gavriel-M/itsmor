# Maintaining this site

`CLAUDE.md` says how the code works. This file says what goes wrong, what is still open, and
why the remaining work is ordered the way it is. Read it before changing anything visual.

It exists because four feature passes shipped in three weeks and each one produced a defect
the previous one had already produced somewhere else. The patterns below are not
hypothetical; every one of them has been found in this repo, usually twice.

---

## The five defect classes

### 1. Content behind an `opacity: 0` initial

Framer Motion's `initial` is serialised into the prerendered HTML. An element that starts at
`opacity: 0` is invisible until React hydrates — and invisible **forever** if the bundle
fails, the CDN drops a chunk, or the visitor blocks scripts.

This has bitten three times: `/about`'s body copy, the homepage's positioning line, and the
whole of `/about` again when the timeline was fixed but its parent wrapper still had a gate.
Each time it also cost measurable LCP, because the largest text on the page could not paint
until hydration: `/about` ran a 4.7 s LCP with **90% of it render delay and nothing
downloading**.

**The rule: primary content animates transform only, with opacity left at 1.** Decoration may
fade — the hero wordmark and geometry still do, deliberately.

Two traps around it:

- **Fixing a component is not enough if its parent still gates.** Check the whole ancestor
  chain, not the element.
- **A paint check that reads an element's own computed style will pass while the page is
  blank.** The element can have a bounding box and `opacity: 1` of its own while an ancestor
  hides the subtree. Walk the ancestors. This exact mistake produced a false pass here.

To verify: disable JavaScript in devtools and confirm nothing vanishes. `/about` and `/cv`
both render completely without it.

### 2. Decorative marks sized against the viewport while content sits on the grid

`/about` and `/work` both position their 3D mark with `w-[60vw] max-w-[600px]` plus
`-right-1/6` / `-right-1/4` and `-translate-x-1/2` pulling against each other. The mark's
horizontal position swings about 485 px between a 1440 and a 1024 viewport, so **the point
where it collides with text moves as the window resizes** — there is no width at which it is
correct, only widths where it happens to miss.

Both also carry `pointer-events-auto`, so a decorative canvas intercepts the pointer over
live text. Measured: it captures every sampled point across itself at 1440, 1024 and 768.

**The rule: decoration on these pages is a grid citizen.** Size it in column units of the
same twelve columns the text uses, and make it `pointer-events-none` unless it is
interactive on purpose.

Two things to settle before implementing that, because they are in tension:

- "Grid citizen" and "bleeds off the right edge" conflict. The mark is currently `absolute`,
  outside grid flow. Making it a real grid item means it stops bleeding; you likely want a
  grid-positioned wrapper with an `overflow-visible` child rather than just swapping `vw`
  for column units.
- It changes the no-JS rendering. Absolutely positioned, its absence costs no layout. As a
  grid item reserving columns, its absence leaves a visible gap — and with JS off the WebGL
  probe never resolves, so it renders nothing. That interacts with class 1 above.

### 3. Colour set through opacity where the composite fails AA

Opacity is part of the colour. A token that passes at 100% can fail at 80%, and the check
has to be against the **composited** pixel, not the token.

Measured on the cream ground `#f2f0e6`:

|                      | ratio      | verdict                                 |
| -------------------- | ---------- | --------------------------------------- |
| `text` #1a1a1a       | 15.23:1    | passes everywhere                       |
| `lapis` #004e98      | 7.23:1     | passes everywhere — **the safe accent** |
| `ink-2` #575347      | 6.72:1     | passes                                  |
| `ink-3` #6e6a5c      | 4.74:1     | passes, thin margin                     |
| `terracotta` #a9543b | **4.57:1** | passes at 100% **only**                 |
| `gold` #ffd700       | 1.23:1     | never text                              |
| `amber` #ffbf00      | 1.45:1     | never text                              |

**No headroom at all on terracotta.** At 90% it composites to 3.85:1 and fails. There is no
opacity below 100% that clears 4.5:1 with it, so a hover-fade on terracotta text is not
available — remove the opacity rather than reducing it. `gold` and `amber` may never carry
text, a border that means something, or an icon carrying state; the cascade glow is the one
legitimate use.

Ink under opacity, for reference: **50% is 3.24:1 and 60% is 4.35:1, both failing.**
`opacity-70` is the floor for text, at 6.04:1.

This class has produced: `opacity-80` on terracotta (2.94:1), `opacity-50` twice on
`/contact` (3.24:1), a `dark:border-white/10` on a site with no dark scheme that rendered
white-on-cream, and 57 sub-AA text nodes on the research page.

**Prefer lapis for small mono meta.** It has 58% more headroom than terracotta.

### 4. Measured constants that go silently wrong

Values derived from a font metric, a breakpoint, a file on disk or an external counter are
correct when written and rot without anything noticing. The failure mode is never an error —
it is a label crossing a rule, or a stale number on a public page.

Currently live, all correct today, none re-checked:

- `Timeline`'s `LABEL_CHAR_PX = 7.2` (a mono advance at 12px) and `CHART_MIN_PX = 620`
  (derived from the `lg` breakpoint and the column span). Change the font, the type scale or
  the span and labels start crossing the sidebar rule.
- `CvDownloads`' three file sizes and the page count.
- The CV stats strip.

**Where possible, prefer a form that cannot rot.** A floor (`790+`) cannot go stale in the
direction a PR count moves; an exact figure can, every day. And exactness that a reader
cannot verify buys nothing — nobody checks 793 against 795.

### 5. Guards that pass because they were only tested with inputs they could catch

`pnpm tokens:check` is the cautionary tale and it is worth reading the history.

It was written to assert that `src/lib/tokens.ts` is the only place a palette hex may appear.
It exempted the `@theme` declarations in `globals.css`, which it must, because Tailwind needs
literals in CSS. But the exemption compared the **bare hex** against the text of every
`@theme` line — so _any_ occurrence anywhere in `src/` of a value that also appeared in
`@theme` was excluded. The guard could only ever catch values **absent** from `@theme`,
which is the opposite of its purpose.

It reported "no palette hex outside `src/lib/tokens.ts`" while an entire stylesheet of
hardcoded tokens sat in `src/components/cv/`.

It was tested when written. The tests injected a retired colour and a grid line — both
absent from `@theme`, both inside the narrow band it could still catch.

> **A guard tested only with inputs it can catch is not tested.**

When you touch a check, inject the thing it is _supposed_ to catch and watch it fail, then
restore. The exemption is now by file and line, and the proof covers a live token in a
component, the CV scale, the retired value, and a hex below the `@theme` block.

The same reasoning applies to `pnpm routes:check`, which exists because a dev-only render jig
under `src/app/` nearly shipped as a public page. `output: "export"` publishes every route
and `deploy.sh` syncs all of `out/`, so a list nothing checks cannot stop anything.

**Two related traps:**

- **Substring matches.** Searching for `ATS` hits `stats`; searching for `AI product
engineer` hits `AI Product Engineering`, which is approved copy. Use word boundaries and
  verify what actually matched before acting on a count.
- **A green build is not evidence the site changed.** `deploy.sh` must run, and the live URL
  must be checked. Two rounds ended with correct work merged and the old copy still public.

---

## Contrast floors, in one place

- Normal text needs **4.5:1**. Large text (≥24 px, or ≥18.66 px bold) needs **3:1**.
- Composite every opacity before measuring, including ancestors' opacity.
- `terracotta` has **no** headroom. `ink-3` has little.
- Re-derive rather than trusting a number in a comment:

```python
def lin(c):
    c /= 255
    return c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4
def L(h):
    h = h.lstrip('#'); r, g, b = (int(h[i:i+2], 16) for i in (0, 2, 4))
    return .2126*lin(r) + .7152*lin(g) + .0722*lin(b)
def ratio(a, b):
    la, lb = L(a), L(b)
    return (max(la, lb) + .05) / (min(la, lb) + .05)
```

---

## Open findings

Ordered by what to do first. None is in progress.

1. **`/work/2d-web-animation` has 57 text nodes below AA.** Measured in-browser against
   composited pixels. Almost all are one pattern: `opacity-60` on section summaries, table-of
   contents entries and the twelve "Avoid When" labels, landing at **4.37:1** against a 4.5
   requirement — one step to `opacity-70` clears all of them together. Two outliers are much
   worse: "Demo Player" at **1.91:1** (`opacity-30`) and "No demo for this section" at
   **1.51:1** (`opacity-20`), which is placeholder text nobody can read. Treat this as the
   entry point to the research-page rework rather than a separate errand.
2. **`/work` project descriptions are `text-black/50` at 3.87:1.** Revealed on hover, still
   text.
3. **The decorative mark on `/about` and `/work`** — class 2 above. `/work` is the one people
   forget; fixing only `/about` leaves the pair inconsistent.
4. **The `/cv` page and the PDFs are two copies, not one source.** The page markup was ported
   from the same source the PDFs export from, which keeps them consistent at a point in time,
   but nothing keeps them so. Any upstream content edit updates the PDFs on the next export
   and leaves the page behind, silently. They agree today. The stats decision below removes
   the most drift-prone part of the problem; the rest is periodic re-porting.
5. **`CvDownloads`' hardcoded file sizes and page count** — class 4 above. Correct today.
   They go wrong on the next export, while the version segment in the path does change.
6. **`Timeline`'s two magic numbers** — class 4 above.
7. **`Timeline` renders nothing for a crawler if it ever regains a measurement gate.** It was
   fixed to position from percentages precisely so it appears in the static HTML. The
   `--x`/`--y` custom properties and the `0 0 100 100` viewBox with
   `preserveAspectRatio="none"` are load-bearing, not stylistic. Do not reintroduce a
   `ResizeObserver` here.

---

## Decisions recorded, not implemented

Both need a second party, so neither is a code change to make alone.

**The CV stats become floors.** `790+ PRs merged`, `700+ tickets shipped`, beside the `30+
design docs` that already is one. The exact figures were already two behind within a day of
shipping and drift upward continuously, and a reader cannot verify the digit anyway, so the
precision is false. **This has to land on the page and in the PDFs in the same pass** — the
page is a copy of the PDFs' source, and changing one alone is the drift in finding 4.

**The CV photo's date-stamp gets cleaned at source.** The asset carries a camera date-stamp
in the bottom-left and a small glyph bottom-right. It is illegible at the 104 px display size
and it is already in the photographed PDF. **Clean it in the source the PDFs export from and
re-export, not on the page** — fixing one side creates exactly the drift the port exists to
prevent.

---

## The remaining roadmap, and why it is ordered this way

The order is deliberate: each step removes a reason the next one would be wasted work.

1. **~~Align the copy~~** — done. Copy came first because a page whose words contradict the
   CV cannot be improved by layout work; you would be polishing a contradiction.
2. **~~Put the real CV on `/cv`~~** — done. Before the layout pass, because `/cv` was the
   last route with placeholder content and a layout pass over a placeholder is thrown away.
3. **Polish the About page layout.** Now unblocked. The three items are class 2 (the mark),
   the timeline's reveal, and a callout treatment for the body copy. **The timeline's reveal
   has never been seen by anyone**: `.timeline-line` runs a 1.5 s wipe on a 0.4 s delay, so
   it completes 1.9 s after page load, unconditionally, and the timeline sits far below the
   fold. `animation-timeline: view()` is the right instrument and degrades safely — where
   unsupported it falls back to the current time-based behaviour, not to broken. Two things
   to test first: with a view timeline the animation is _positioned_ rather than delayed, so
   `backwards` fill behaves differently and the line may re-clip when the element leaves the
   view range going up; and the reduced-motion guard uses the `animation` shorthand, which
   also clears `animation-timeline`, so ordering matters.
4. **Case studies on `/work`.** After the layout pass, because the page's two existing items
   are well made but are not evidence for what the CV claims, and the shape of a case study
   depends on the layout language step 3 settles.
5. **Rework the 2D animation demos.** Last, and the largest. The demos are rudimentary and
   the text came from a weaker model. Finding 1 above — the 57 sub-AA nodes — is on this page
   and should be the entry point rather than a separate errand: you will be in these files
   anyway.

---

## Working notes

- **Branch, always.** The default branch is protected by convention, not by config; a commit
  landed directly on it once because a merge had moved the checkout underneath.
- **Branch names are `ITSMOR-NNNN-slug`** and PR titles must start with `ITSMOR-` plus four
  digits, or `pr-title-check` fails.
- **Rebase before merging a branch cut earlier in a session.** A location-string branch cut
  before a sibling merged would have silently reverted that sibling's whole change.
- **`pnpm verify` is what CI runs.** Run it before pushing; it is cheaper than a CI round
  trip.
- **Measure, do not reason, about layout.** Read positions out of a real browser and compare
  against another page. A screenshot showed a "discontinuous" line that turned out to be a
  dash-array bug; computed style found it in one query. Heading alignment, label overflow and
  pointer interception have all been settled this way.
- **Rendering is not the same as painting.** An element can be in the DOM, have a bounding
  box, and still be invisible. See class 1.
