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
```

Package manager is **pnpm**. The `packages/text-cascade` local package has vitest for tests (`pnpm --filter text-cascade test`). No test runner for the main app.

## Architecture

### Framework & Deployment

- **Next.js 16 App Router** with `output: "export"` (fully static, no SSR/API routes)
- Images are unoptimized (`next.config.ts`) since they're served via CloudFront
- Path alias: `@/*` → `./src/*`

### Component Organization

Components live in `src/components/` organized by page domain:

- `home/` — Hero section, MagneticCircle (mouse-tracking)
- `work/` — ProjectCard (handles internal + external links), WireframeLogo3D (React Three Fiber)
- `about/` — Timeline (SVG path animation), RotatingText (cycling text with Framer Motion)
- `animationResearch/` — Research page system: ResearchLayout, DemoCard, DemoPopover (draggable mobile panel), Section, Toc, HeroHeader, and 7 lazy-loaded demo components in `demos/`
- `contact/` — Network visualization with canvas-based lightning hover effect, cursor-tracking logo rotation
- `layout/` — Navigation, GridBackground, PageTransition, ScrollNavigationLoader
- `ui/` — Shared primitives (Logo, AnimatedLogoFrame, TransitionLink)

### Content Data

Content-heavy pages store structured data in `src/data/` (e.g., `animationResearchContent.ts` defines all 14 research sections with paragraphs, callouts, checklists, and demo references).

### Pages

- `/` — Hero with magnetic circle and geometric shapes
- `/work` — Project list (inline `projects` array in page component)
- `/work/2d-web-animation` — 14-section research article with interactive demos
- `/about` — Rotating titles, bio, timeline, tech stack, expertise
- `/contact` — Email, social network visualization, copyright footer
- `/cv` — Embedded PDF viewer with download fallback for mobile

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
- `useLightningEffect.ts` — Canvas-based lightning crackling on hovered link nodes (two-pass: terracotta outside, background inside)
- Types shared via `src/components/contact/types.ts`

## Code Conventions

- Prettier: 2-space indent, trailing commas (es5), double quotes (single quotes disabled)
- All interactive components use `"use client"` directive
- Most components are client components due to heavy interactivity
- `ProjectCard` detects external URLs (`http` prefix) and renders `<a target="_blank">` instead of Next.js `<Link>`
- Project data lives inline in page components (no separate config/JSON files)
