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

To verify: disable JavaScript in devtools and confirm nothing vanishes. **Only `/about` and
`/cv` render completely without it** — measured, walking the ancestor chain, at 1440x900:

| route                    | text nodes painting |
| ------------------------ | ------------------- |
| `/about`                 | 19 / 19             |
| `/cv`                    | 23 / 23             |
| `/`                      | 6 / 8               |
| `/work`                  | 3 / 8               |
| `/contact`               | 3 / 13              |
| `/work/2d-web-animation` | **5 / 267**         |

The homepage's two are the wordmark and its label, which are decoration and fade
deliberately. The rest are finding 2.

### 2. Decorative marks sized against the viewport while content sits on the grid

**Fixed on both pages, 2026-09-21.** Kept here because the shape recurs.

Both pages positioned their mark with `w-[60vw] max-w-[600px]` plus `-right-1/6` /
`-right-1/4` and `-translate-x-1/2` pulling against each other. Measured: the mark's centre
moved **485 px** on `/about` between a 1440 and a 1024 viewport, and its right edge sat 20 px
past the content container at one width and 55 px short of it at another — there was no width
at which it was correct, only widths where it happened to miss. On `/about` it also escaped
the section's `overflow-x-hidden`, because its containing block was `main` rather than
anything inside the section, and put a **20 px horizontal scrollbar** on the document at 1920. And it carried `pointer-events-auto` over live text: **8–9 sampled text nodes were
intercepted at every width**, the `h1` among them.

**The rule, now implemented identically on both pages:** the content container is the mark's
containing block; the mark is sized against that container (`w-2/3 max-w-[600px]`, about
eight of the same twelve columns the text uses); it bleeds exactly one gutter past it
(`-right-8`) from a **single** offset; and it is `pointer-events-none`. The invariant to
re-check after any change to either page: the mark's right edge is the container's right edge
plus 32 px at every width, and `scrollWidth == clientWidth`.

It stayed `absolute`, deliberately. The tension this file used to flag — "grid citizen"
versus "bleeds off the right edge" — resolves by making the grid container the mark's
_containing block_ rather than making the mark a grid _item_. It is then measured in column
units while reserving no columns, so it still costs no layout with JS off. A real grid item
would leave a visible gap there, because the WebGL probe never resolves without JS.

Two corrections to what this file used to claim:

- **They are not the same mark.** `/about` renders `WireframeLogo3D` (WebGL, behind the
  support probe); `/work` renders `AnimatedLogoFrame` (SVG, always renders). The positioning
  defect was identical; the components and their no-JS behaviour are not.
- **`/work` never actually intercepted the pointer**, despite carrying
  `pointer-events-auto`. Its header keeps the text in `relative z-10` wrappers, so hit
  testing reached the text first — measured **0** interceptions at every width. `/about` had
  no such wrappers, which is why only it was affected. Both are `pointer-events-none` now
  regardless, so the next page that forgets a `z-10` wrapper does not reintroduce it.

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

Ink under opacity, for reference: **50% is 3.24:1 and 60% is 4.37:1, both failing.**
`opacity-70` is the floor for text, at 6.03:1.

**The ground carries opacity too.** A callout label sat at `text-terracotta`, full opacity,
on a `bg-terracotta/5` wash and measured **4.30:1** — the token's own 4.57:1 less what the
wash took out from behind it. Because terracotta has no headroom, there is no wash strength
that both reads as a wash and clears AA, so the wash went rather than the colour; the
left border still carries which kind of callout it is. Measure the pixel, not the token, and
remember the pixel includes what is behind it.

This class has produced: `opacity-80` on terracotta (2.94:1), `opacity-50` twice on
`/contact` (3.24:1), a `dark:border-white/10` on a site with no dark scheme that rendered
white-on-cream, and 62 sub-AA text nodes on the research page plus 2 on `/work` — all since
cleared.

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

**Three related traps:**

- **Substring matches.** Searching for `ATS` hits `stats`; searching for `AI product
engineer` hits `AI Product Engineering`, which is approved copy. Use word boundaries and
  verify what actually matched before acting on a count.
- **A green build is not evidence the site changed.** `deploy.sh` must run, and the live URL
  must be checked. Two rounds ended with correct work merged and the old copy still public,
  and a third ended with a merge to `main` that was never deployed.
- **A thing can attach and still do nothing.** `animation-timeline: view()` on `/about`
  produced a genuine `ViewTimeline` object and no animation whatsoever: `overflow-x: hidden`
  on the section makes the other axis compute to `auto`, so the section was the nearest
  scroll container, and it never scrolls. The animation resolved to a fixed 21% duration and
  finished before first paint. `overflow-x: clip` clips the same and creates no scroll
  container. Confirming the object exists is not confirming it works — read the computed
  `clip-path` at several scroll positions.

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

Ordered by what to do first. None is in progress. Ratios are measured in-browser against
composited pixels, not derived from the tokens.

1. **`/work`'s hover arrow is `text-black/30` at 2.09:1.** `aria-hidden` decoration that
   duplicates an affordance the whole card already carries, so it is arguably exempt from
   1.4.11 — but it is also invisible, and darkening it changes the card's resting
   appearance. Left deliberately out of the contrast sweep. Settle it with the `/work`
   case-study step, not on its own.
2. **`/work`, `/contact` and `/work/2d-web-animation` are largely blank without
   JavaScript** — class 1, at scale, and never previously written down. The research page
   paints **5 of 267** text nodes: every `Section` is a `motion.section` with
   `initial={{ opacity: 0 }}` and a `whileInView`, so the whole article is invisible until an
   IntersectionObserver fires. `/work`'s `h1`, intro and every `ProjectCard` do the same;
   `/contact` hides its heading, address and links. It is not a copy or layout defect, so the
   layout pass did not touch it — but it is the largest single measured defect here, and the
   fix is the one already applied twice: animate transform only and leave opacity at 1. Take
   `/work` and `/contact` with their roadmap steps and the research page with step 5, where
   its 262 nodes are all one component.
3. **A callout treatment for the body copy on `/about`** — the third item of roadmap step 3.
   The other two are done. This one is a design decision rather than a defect, and it was
   left out of the brief that commissioned the rest, so it is unstarted.
4. **The `/cv` page and the PDFs are still two copies for everything but the stats.** The
   page markup was ported from the same source the PDFs export from, and nothing keeps them
   together except re-porting. Narrower than it was: the stats strip and the photograph now
   come from one declaration each — `CV_STATS` in `src/lib/cv.ts`, and
   `src/assets/cv-photo.jpg`, which is the byte-exact image embedded in the photographed PDF
   (same sha256). Everything else — the prose, the role list, the dates — is still a copy
   that an upstream edit silently leaves behind. `pnpm cv:check` cannot see this; it checks
   the files, not the words.
5. **~~`CvDownloads`' hardcoded file sizes and page count~~** — solved. They are declared in
   `src/lib/cv.ts` and asserted against the files by `pnpm cv:check`, which also fails on a
   stale version segment, a superseded version directory left published, an undeclared file
   in the directory, and the filename crossover below. They survived one re-export correct by
   luck, which was the warning.
6. **`Timeline`'s two magic numbers** — class 4 above.
7. **`Timeline` renders nothing for a crawler if it ever regains a measurement gate.** It was
   fixed to position from percentages precisely so it appears in the static HTML. The
   `--x`/`--y` custom properties and the `0 0 100 100` viewBox with
   `preserveAspectRatio="none"` are load-bearing, not stylistic. Do not reintroduce a
   `ResizeObserver` here.
8. **`overflow: clip` needs Safari 16+.** `/about` and `/work` rely on it to clip the mark's
   bleed. Below that it falls back to `visible` and those pages get a short horizontal
   scrollbar. Acceptable, but it is the reason the clip cannot go back to `hidden`.

### Closed, with the numbers

Recorded so nobody re-derives them.

- **The research page's sub-AA text: 62 nodes → 0.** 14 section summaries, 26 table-of-
  contents spans and 12 "Avoid When" headings at `opacity-60` (4.37:1); one callout source at
  `opacity-50` (3.24:1); 7 terracotta callout labels on a `bg-terracotta/5` wash (4.30:1);
  "Demo Player" at `opacity-30` (1.91:1) and "No demo for this section" at `opacity-20`
  (1.51:1). Everything on ink went to `opacity-70` (6.03:1); the wash was dropped so
  terracotta reads on cream (4.57:1). The count was **62, not the 57 this file used to
  claim** — the 5 it missed were the tinted-ground labels, which the old figure had no class
  for.
- **`/work`'s project descriptions: `text-black/50` (3.87:1) → `text-text/70` (6.03:1).**
  Pure black under an opacity was also the only place on the site not reading a token.
- **The decorative mark on both pages** — class 2 above.
- **The CV re-export.** Verified independently before landing: 0 pixels of the retired
  tertiary ink `#938E7E` and 1,750 of `#6E6A5C` on page 1 of the primary, against 1,852 and 0
  the other way in the file it replaced, with terracotta, lapis and `ink-2` pixel-identical
  between the two. All three PDFs carry the floors; page counts 2/2/3 agree with `pdfinfo`;
  the primary embeds no image. Published under `2026-09-21` because `deploy.sh` caches
  non-HTML for a year and an invalidation clears the edge, not the client.
- **`/about`'s timeline reveal.** It ran 1.5 s on a 0.4 s delay against the clock, so it
  always finished 1.9 s after load. **This file claimed the chart is "far below the fold" and
  that nobody had ever seen it; that is only true at some viewports.** Measured share of the
  chart visible on load: 0% at 1280×720 and 1366×768, 38% at 1440×900, 94% at 1920×1080, and
  it is never 100%. Below `lg` the chart is not rendered at all, so the animation is moot on
  mobile. The defect was real at the two commonest laptop heights and the reveal was never
  seen whole anywhere; the reasoning was overstated. It is now positioned against the chart
  entering the viewport.

## Decisions since implemented

Both are done, recorded because the reasoning is not visible in the diff.

**The CV stats are floors.** `790+ PRs merged`, `700+ tickets shipped`, `30+ design docs
authored`. The exact figures were two behind within a day of shipping and a reader cannot
verify the digit anyway, so the precision was false. It landed on the page and in all three
PDFs in the same commit, which was the condition — the page was a copy of the PDFs' source,
and changing one alone was the drift in finding 4. The strings now live once, in `CV_STATS`.

**The CV photo's date-stamp is cleaned at source.** The asset carried a camera date-stamp
bottom-left and a small glyph bottom-right, illegible at the 104 px display size and present
in the photographed PDF too. It was fixed in the source the PDFs export from and re-exported,
not painted out on the page. The page's asset is now the JPEG stream lifted out of the
photographed PDF without re-encoding, so page and download are the same bytes rather than two
files that happen to agree.

**Identify a re-export by content, not by filename.** The three incoming files do not map
one-to-one onto the published names. The file whose incoming name has no suffix is the
**photographed** variant, while the published file of that same name is the **unphotographed
primary**. So a copy that trusts the names puts the photographed CV behind the primary
download — the one outcome the unphotographed default exists to prevent — and every candidate
is a valid CV, so nothing else notices.

Tell them apart by what is inside them:

| published                       | embeds a photo | pages |
| ------------------------------- | -------------- | ----- |
| `…-CV.pdf` — _primary download_ | no             | 2     |
| `…-CV-Photo.pdf`                | yes            | 2     |
| `…-CV-Plain.pdf`                | no             | 3     |

`hasPhoto` in `src/lib/cv.ts` is verified by counting embedded images, so getting this wrong
is now a CI failure rather than something a reviewer has to notice.

## The remaining roadmap, and why it is ordered this way

The order is deliberate: each step removes a reason the next one would be wasted work.

1. **~~Align the copy~~** — done. Copy came first because a page whose words contradict the
   CV cannot be improved by layout work; you would be polishing a contradiction.
2. **~~Put the real CV on `/cv`~~** — done. Before the layout pass, because `/cv` was the
   last route with placeholder content and a layout pass over a placeholder is thrown away.
3. **Polish the About page layout** — two of three done. The mark (class 2) and the
   timeline's reveal are shipped; **the callout treatment for the body copy is not**, and is
   finding 3. `animation-timeline: view()` did degrade safely as predicted, and both
   predicted gotchas were real: the line does re-clip when the chart leaves the view range
   going up, which is benign and replays on the way back down; and the reduced-motion guard's
   `animation` shorthand does reset `animation-timeline`, which is why the `@supports` block
   is declared before it. The one thing nobody predicted is in class 5 — the section's own
   `overflow-x-hidden` captured the timeline's scroll container and stopped it working at
   all.
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
- **Check the instrument before believing a clean run.** Three measuring mistakes inside one
  session, each of which produced a confident, wrong, reassuring answer:
  - `python3 -m http.server` over `out/` serves a **directory listing** for `/work/` and
    `/work/2d-web-animation/`, because those directories exist beside the `.html` files. An
    audit of every route came back clean because it had been auditing Netscape-era file
    lists. Request the `.html` paths, which is what CloudFront serves anyway.
  - A colour parser matching `rgba?\(` **silently skips every Tailwind slash-opacity value**,
    because `text-black/50` computes to `oklab(0 0 0 / 0.5)`. Normalise through a 1×1 canvas
    and read the pixel back instead of matching a string.
  - `elementsFromPoint` **omits anything with `pointer-events: none`**, so it is useless for
    "what is painted under this text". The hero's cream label looked like 1.00:1 cream-on-
    cream; it is fully inside a lapis bar at every width, at 7.23:1. Compare geometry, or
    sample the rendered pixel.
