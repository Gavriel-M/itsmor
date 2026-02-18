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

Package manager is **pnpm**. No test runner is configured.

## Architecture

### Framework & Deployment

- **Next.js 16 App Router** with `output: "export"` (fully static, no SSR/API routes)
- Images are unoptimized (`next.config.ts`) since they're served via CloudFront
- Path alias: `@/*` → `./src/*`

### Component Organization

Components live in `src/components/` organized by page domain:

- `home/` — Hero section, MagneticCircle (mouse-tracking)
- `work/` — Project cards, WireframeLogo3D (React Three Fiber)
- `about/` — Timeline with SVG path animation
- `contact/` — Network visualization with canvas-based lightning hover effect, cursor-tracking logo rotation
- `layout/` — Navigation, GridBackground, PageTransition, ScrollNavigationLoader
- `ui/` — Shared primitives (Logo, AnimatedLogoFrame, TransitionLink)

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
