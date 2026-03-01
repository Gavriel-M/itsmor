# itsmor

A portfolio site that practices what it preaches - where engineering rigor meets intentional design.

## Philosophy

I believe software development is a craft, not just manufacturing. The code is the medium; the experience is the goal. This project embodies that philosophy: every interaction is deliberate, every animation purposeful, and every technical decision serves both performance and aesthetics.

This isn't a template dressed up with content. It's an exercise in **constraint-driven creativity** — building a site that feels light and fluid while being technically grounded and architecturally sound.

## Design System: Digital Bauhaus

The visual language draws from Bauhaus principles — function informing form, grid-based precision, and high contrast clarity.

**Core Tenets:**

- **Grid as Foundation**: Everything aligns to a strict 4rem grid (`--grid-cell`). Not decorative; structural.
- **Restrained Palette**: Terracotta (#B85B40) as the accent, off-white (#F2F0E6) as the canvas, near-black (#1A1A1A) for type. High contrast, zero ambiguity.
- **Typography as Hierarchy**: Inter for bold statements, IBM Plex Mono for technical precision.
- **Motion with Purpose**: Animations aren't decoration — they guide attention, provide feedback, and enhance spatial understanding.

## Technical Approach

This project is statically exported to AWS S3 + CloudFront. No server-side rendering, no runtime overhead — just pre-built HTML/CSS/JS served from the edge. This constraint forces discipline: every feature must work within a static context, which ironically enables creative solutions.

**Stack:**

- **Next.js 14+** (App Router, Static Export) — Leveraging React's ecosystem while maintaining a static footprint
- **TypeScript** — Type safety as a design tool, not just error prevention
- **Tailwind CSS** — Configured with custom design tokens for grid precision and color consistency
- **Framer Motion** — High-performance declarative animations
- **React Three Fiber** — For 3D wireframe logo visualization (WebGL-based, GPU-accelerated)

**Why Static?**

- **Performance**: Sub-100ms response times from CloudFront edge locations
- **Cost**: Nearly zero infrastructure cost compared to server-rendered alternatives
- **Simplicity**: No server to manage, no runtime to monitor, no scaling concerns

This isn't a limitation — it's a forcing function for better architecture.

## Key Features

### 3D Wireframe Logo

A custom React Three Fiber component that renders the brand mark as an engineered, glowing wireframe in 3D space. The SVG is decomposed into separate extruded geometries, centered collectively, and animated with phased opacity transitions (drawing → settling → rotating). Built with `EdgesGeometry` and additive blending for that "blueprint aesthetic."

### Network Visualization

The Contact page features a particle network that responds to user interaction — nodes repel from cursor position using force-directed physics. Built with Canvas API and requestAnimationFrame for 60fps performance.

### Timeline Component

A vertical timeline on the About page that progressively reveals as you scroll. Intersection Observer API triggers staggered Framer Motion animations for a fluid, responsive feel.

### Animated Logo Frame

A "glitch/scramble" effect on hover that distorts the logo through SVG filter manipulations. The animation system handles play/pause states, prevents stuck loops, and respects reduced-motion preferences.

### Hero Geometric Overlays

The homepage features animated geometric primitives (circles, rectangles) that enter the viewport with staggered delays and spring physics. Each element is grid-aligned using CSS `calc(var(--grid-cell) * N)` for pixel-perfect placement.

## Development Philosophy

**Holistic Ownership**: Understanding backend constraints, browser limitations, and business goals — not to compromise, but to design better solutions that serve all three.

**Performance as Design**: A beautiful UI is worthless if it stutters. Memory management, render cycle optimization, and browser mechanics aren't chores — they're what allow creativity to shine.

**Iterative Refinement**: This project evolved through multiple passes. The grid system was added after the initial layout. The 3D logo went through three refactors. The contact network was rebuilt for better physics. That's the process — ship, critique, improve.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Home (Hero)
│   ├── work/         # Projects grid
│   ├── about/        # Timeline & background
│   └── contact/      # Network visualization
├── components/       # Reusable components organized by domain
│   ├── home/         # Hero components
│   ├── work/         # Project cards, 3D logo
│   ├── about/        # Timeline
│   ├── contact/      # Network visualization
│   ├── layout/       # Grid, Navigation
│   └── ui/           # Shared primitives
└── .docs/            # Architecture, roadmap, deployment docs
```

## Running Locally

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production (static export)
pnpm build

# Preview production build
pnpm start
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

The site deploys to AWS S3 with CloudFront distribution. The `deploy.sh` script handles the build → upload → invalidation flow. See `.docs/DEPLOYMENT_SETUP.md` for infrastructure configuration.

```bash
./deploy.sh
```

## What's Next

This project is intentionally incomplete — not because it's abandoned, but because it's **evolving**. Some planned explorations:

- Micro-interactions on hero circle (mouse tracking, physics-based response)
- Shader-based effects for the 3D logo (bloom, chromatic aberration)
- Real project case studies in the Work section with rich media
- Extended About page with more biographical depth
- Focus state refinements for accessibility

The point isn't perfection. It's practice.

---

**Built by [Gavriel Mor](https://www.linkedin.com/in/gavriel-mor/)** — Frontend Engineer passionate about the intersection of logic and design.

This project is public to showcase my approach: how I think about constraints, how I architect systems, and how I balance technical rigor with creative expression.
