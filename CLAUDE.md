# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site ("itsmor") — a performance-optimized, interactive portfolio built with Next.js 16, React 19, and TypeScript. Features cursor-tracking animations, 3D WebGL rendering, canvas-based lightning effects, and page transitions. Deployed as a static export to AWS S3 + CloudFront.

## Commands

```bash
pnpm dev           # Dev server at localhost:3000
pnpm build         # Static export build (output: "export")
pnpm lint          # ESLint
pnpm format        # Prettier format all files
pnpm format:check  # Prettier validation
pnpm tokens:check  # Palette guard — see Design Tokens
```

Package manager is **pnpm**. The `packages/text-cascade` local package has vitest for tests (`pnpm --filter text-cascade test`). No test runner for the main app.

## Architecture

### Framework & Deployment

- **Next.js 16 App Router** with `output: "export"` (fully static, no SSR/API routes)
- Images are unoptimized (`next.config.ts`) since they're served via CloudFront
- Path alias: `@/*` → `./src/*`

**`output: "export"` publishes every route under `src/app/`, and `deploy.sh` syncs all of
`out/` to S3 with `--delete`.** Anything placed in `src/app/` becomes a public page on
itsmor.com. Render jigs and other dev-only pages belong in `tools/` as standalone HTML —
see [Render Jigs](#render-jigs).

**Metadata route conventions need `export const dynamic = "force-static"`** under
`output: "export"`, or the build fails collecting page data. Applies to `robots.ts` and
`sitemap.ts`.

### Component Organization

Components live in `src/components/` organized by page domain:

- `home/` — Hero section, MagneticCircle (mouse-tracking)
- `work/` — ProjectCard (handles internal + external links), WireframeLogo3D (React Three Fiber)
- `about/` — Timeline (SVG path animation), RotatingText (cycling text with Framer Motion)
- `animationResearch/` — Research page system: ResearchLayout, DemoCard, DemoPopover (draggable mobile panel), Section, Toc, HeroHeader, and 7 lazy-loaded demo components in `demos/`
- `contact/` — Network visualization with canvas-based lightning hover effect, cursor-tracking logo rotation
- `layout/` — Navigation, GridBackground, PageTransition, ScrollNavigationLoader
- `ui/` — Shared primitives (Logo, AnimatedLogoFrame, TransitionLink)

### Shared Modules

`src/lib/` holds everything not tied to one component:

- `site.ts` — SEO strings and metadata builders, see [Metadata & SEO](#metadata--seo)
- `tokens.ts` — the palette, see [Design Tokens](#design-tokens)
- `links.ts` — external-href detection and new-tab props
- `webgl.ts` — `useWebGLSupport`, see [WebGL](#webgl)
- `motion/easing.ts`, `motion/usePrefersReducedMotion.ts` — shared motion primitives

### Content Data

Content-heavy pages store structured data in `src/data/` (e.g., `animationResearchContent.ts` defines all 14 research sections with paragraphs, callouts, checklists, and demo references).

### Pages

- `/` — Hero with magnetic circle and geometric shapes
- `/work` — Project list (inline `projects` array in page component)
- `/work/2d-web-animation` — 14-section research article with interactive demos
- `/about` — Rotating titles, bio, timeline, tech stack, expertise
- `/contact` — Email, social network visualization, copyright footer
- `/cv` — Interim state (`CvInterim`), `noindex`. The PDF it used to serve was removed from `public/` as well as unlinked, because S3 serves file paths directly

### Page Transitions

`NavigationContext` (`src/contexts/NavigationContext.tsx`) manages transition state machine: `idle` → `exiting` → `navigating` → `entering`. `TransitionLink` replaces standard `<Link>` for animated navigation.

### Animation Systems

Three distinct animation approaches coexist:

1. **Framer Motion** — Declarative UI animations (page transitions, reveals)
2. **Canvas API** — Lightning hover effect (`useLightningEffect.ts`) using requestAnimationFrame loops
3. **React Three Fiber** — 3D WebGL wireframe logo (`WireframeLogo3D.tsx`) with SVG→geometry conversion

### Performance Patterns

- **Ref-based state** over useState for high-frequency updates (cursor position, animation frames)
- **Passive event listeners** for scroll/mouse handlers
- **requestAnimationFrame** loops for canvas animations
- **Canvas rendering** with devicePixelRatio scaling instead of DOM manipulation for particles

### Styling

- **Tailwind CSS v4** (CSS-first mode via `@tailwindcss/postcss`)
- Design tokens defined as CSS variables in `globals.css`:
  - `--color-background: #f2f0e6`, `--color-text: #1a1a1a`
  - `--color-terracotta: #b85b40`, `--color-lapis: #004e98`
  - `--grid-cell: 4rem` (64px grid unit used in layout calculations)
- Fonts: `Inter` (sans-serif) and `IBM Plex Mono` (monospace), loaded via `next/font/google`
- Custom keyframe animations: `bounce-gentle`, `pulse-slow`

### Animation Research Demo System

The 2D Animation research page (`/work/2d-web-animation`) has a sophisticated demo player:

- `ResearchLayout` uses IntersectionObserver to track the active section and passes its `demoId` to the demo components
- `DemoCard` (desktop sidebar) and `DemoPopover` (mobile draggable panel) render the active demo or an empty "Demo Player" state
- `DemoPopover` supports drag-to-reposition with snap-to-corner, persists position in sessionStorage, and respects safe-area insets
- Demos are lazy-loaded via `React.lazy` through `DEMO_MAP` in `demos/index.ts`
- 7 of 14 sections have demos; the rest show a placeholder label

### Local Packages

`packages/text-cascade/` — Standalone React component for cascading text reveal animations with glow effects. Has its own build (tsup) and test suite (vitest).

### Contact Network System

The contact page has the most complex component architecture:

- `ContactNetwork.tsx` — Main canvas-based network visualization
- `SeparatedLogo.tsx` + `useCursorTracking.ts` — Logo that rotates to follow cursor with shortest-path angle normalization and smooth lerp interpolation
- `useLightningEffect.ts` — Canvas-based lightning crackling on hovered link nodes (two-pass: lapis outside, the cream ground inside, which knocks the crackle out of the node)
- Types shared via `src/components/contact/types.ts`

### Metadata & SEO

`src/lib/site.ts` owns every SEO string and shape. `layout.tsx` re-exports `rootMetadata`;
every other route calls `routeMetadata({ title, description?, type?, nested? })`.

Three Next.js behaviours the helper exists to contain:

- **A child segment's `openGraph` replaces the parent's rather than merging.** A partial
  one silently drops `og:image`, `og:site_name`, `og:locale` and `og:url`. Omitting it
  entirely is the opposite failure — the route inherits the root's `og:title` and its
  social card claims to be the homepage. `routeMetadata` has no partial form, so neither
  is reachable. Do not hand-roll a route metadata object.
- **`alternates.canonical` and `openGraph.url` must be `"./"`, not `"/"`.** A literal `/`
  pins every page's canonical and `og:url` to the homepage.
- **A plain-string `title` consumes the parent's template and passes nothing down.** A
  layout with children needs `nested: true` so nested routes keep the name in their title.

`INDEXABLE_ROUTES` in the same file drives `sitemap.ts`. `/cv` is absent because it is
`noindex`. `robots.ts` deliberately does not `Disallow: /cv` — a disallow stops the crawl,
so the crawler never reads the noindex.

The 1200×630 OG card is a real PNG at `src/app/opengraph-image.png`, generated by a jig,
picked up by Next's file convention. Regenerate it with `./tools/capture.sh`.

### Design Tokens

**`src/lib/tokens.ts` is the only place a palette hex may appear.** Everything else reads
`PALETTE` — canvas code, three.js material colours, raw CSS strings, the data file.
`src/app/globals.css`'s `@theme` block necessarily repeats the values, because Tailwind v4
needs literals in CSS to generate utilities; `pnpm tokens:check` asserts the two agree,
that no hex has leaked elsewhere in `src/` or into a jig, and that the jigs' generated
stylesheet is current. The guard is location-based, not count-based, so a migration that
only moves a literal between files still fails.

The palette contract, contrast measurements and use rules live in
`~/logzio/career/08-tokens.md`. Two rules that are easy to get wrong:

- **Opacity is part of the colour.** `terracotta` under `opacity-80` composites to 3.25:1
  and fails AA. No opacity below 100% clears 4.5:1 with it — remove the opacity rather
  than reducing it, and measure composites, never the token.
- **`gold` and `amber` may never carry text or state.** Both are under 1.5:1 on the cream
  ground. Decoration only; `--cascade-glow-color` is the legitimate use.

There is no `tailwind.config.ts`. Tailwind v4 reads a config only via an `@config`
directive and there is none, so a config file would be dead weight that looks live.

`DARK_BANNER` is the GitHub banner's dark ground, derived for that ground rather than
inverted — `lapis` manages only 2.2:1 there. It is independent of `PALETTE` on purpose, so
a light-token change does not restyle the dark banner.

### Render Jigs

`tools/` holds three standalone HTML jigs — the OG card, the GitHub profile banner and the
LinkedIn banner — plus `capture.sh` to render them with headless Chrome. They are **not**
Next routes, for the reason in [Framework & Deployment](#framework--deployment). All three
link `tools/tokens.generated.css`, written from the token module, because standalone HTML
cannot import TypeScript. See `tools/README.md`.

Two things that will otherwise waste time: **Chrome writes a screenshot and then never
exits**, so `capture.sh` backgrounds and reaps it; and **the jigs pull fonts from Google
Fonts over the network**, so capture needs connectivity.

### WebGL

`WireframeLogo3D` mounts a `<Canvas>` only after `useWebGLSupport()` confirms support.
R3F's own `fallback` prop is not sufficient on its own: it catches the throw but only
after three.js has attempted the context and logged two errors, which Lighthouse records.
The support check has to come first.

## Code Conventions

- Prettier: 2-space indent, trailing commas (es5), double quotes (single quotes disabled)
- All interactive components use `"use client"` directive
- Most components are client components due to heavy interactivity
- Link handling goes through `src/lib/links.ts`. `isExternalHref` decides `<a>` vs Next
  `Link`; `newTabProps` adds `target`/`rel` for http(s) only, since `mailto:` and `tel:`
  hand off to another app and would leave an empty tab behind
- `src/components/ui/LinkButton.tsx` is the shared bordered mono link, and picks `<a>` or
  `TransitionLink` from the href
- Reduced motion uses `usePrefersReducedMotion` from `src/lib/motion/`, not framer-motion's
  `useReducedMotion`. Easing curves come from `src/lib/motion/easing.ts` — do not inline
  `[0.22, 1, 0.36, 1]`
- Project data lives inline in page components (no separate config/JSON files)
