import { type ResearchSection } from "@/components/animationResearch/types";

export const sections: ResearchSection[] = [
  {
    id: "preface",
    number: "01",
    title: "Preface",
    summary:
      "Why animation principles from the 1930s still govern how pixels should move on screens today.",
    paragraphs: [
      "The twelve principles of animation were first articulated by Frank Thomas and Ollie Johnston at Walt Disney Studios. They emerged not from theory but from decades of observation — how audiences respond to motion, what makes movement feel alive versus mechanical. These principles were codified in 'The Illusion of Life' (1981), a book that remains the canonical reference for animators across every medium.",
      "Web interfaces are not cartoons, but they share a fundamental challenge: making abstract changes feel natural to a human observer. When a modal slides into view or a list reorders itself, the user's visual cortex applies the same heuristics it uses to track objects in the physical world. Motion that violates those heuristics — instantaneous teleportation, linear velocity, abrupt stops — registers as wrong even when the user can't articulate why.",
      "This research page translates the classical animation toolkit into the specific constraints of web UI: 60fps budgets, CSS and JavaScript execution models, accessibility requirements, and the expectation that motion should inform rather than entertain. Each section maps a studio principle to its web equivalent, provides implementation guidance, and includes an interactive demo where applicable.",
    ],
    callouts: [
      {
        type: "studio",
        title: "The Illusion of Life",
        body: "Thomas and Johnston identified twelve principles through the production of films like Snow White, Bambi, and Fantasia. The principles describe how to create the illusion of characters that obey physics and possess internal intention — even when they are ink on celluloid.",
        source: "Thomas & Johnston, 1981",
      },
    ],
  },
  {
    id: "human-perception",
    number: "02",
    title: "Human Perception of Motion",
    summary:
      "Why some changes feel instant, and others demand motion to stay legible.",
    paragraphs: [
      "UI motion lives inside human response-time limits. If the system reacts within about 0.1 seconds, it feels immediate. Around 1 second, users notice the delay but keep their flow. Beyond ~10 seconds, attention drops and you need explicit progress feedback. These aren’t “web rules” — they’re interaction limits that haven’t changed for decades.",
      "Animation sits in the middle: it can add clarity, but it also adds delay. Use it when it helps the eye track relationships (where did that panel come from? what did that button affect?), and skip it when it only decorates.",
      "For web animation, the practical constraints are frame budgets: at 60Hz you have 16.7ms per frame, and at 120Hz only 8.3ms. That’s why high-quality UI motion defaults to compositor-friendly properties (`transform`, `opacity`) and keeps continuous effects opt-in.",
    ],
    callouts: [
      {
        type: "implementation",
        title: "Frame Budget",
        body: "At 60fps, you get 16.7ms per frame. At 120Hz, you get 8.3ms. If your animation depends on JS every frame (or triggers layout/paint), you’ll feel it immediately as stutter. Prefer `transform` + `opacity`, and avoid animating layout properties.",
      },
    ],
    checklist: {
      useWhen: [
        "Transitions between 200-400ms for layout changes",
        "Micro-interactions at 100-200ms for immediate feedback",
        "Staggered delays of 30-60ms between sequential items",
      ],
      avoidWhen: [
        "Durations over 1s for any single transition",
        "Durations under 100ms for spatial movement (perceived as jump)",
        "Identical timing for all elements in a group (looks robotic)",
      ],
      a11yPerf: [
        "Always provide prefers-reduced-motion fallbacks",
        "Motion triggered by interaction should be reducible (WCAG 2.3.3)",
        "Avoid flashing patterns; keep motion subtle and optional",
        "Use will-change sparingly — it allocates GPU memory",
      ],
    },
  },
  {
    id: "timing-and-spacing",
    number: "03",
    title: "Timing & Spacing",
    summary:
      "The foundational principle — how the distribution of frames creates weight, mood, and intention.",
    paragraphs: [
      "In traditional animation, timing refers to the number of frames allocated to an action, while spacing refers to how those frames are distributed across the motion path. Fewer frames mean faster movement; more frames mean slower. But the distribution matters as much as the count — clustered frames at the start with wide gaps at the end produce acceleration, and vice versa.",
      "On the web, timing maps to CSS transition-duration or Framer Motion's duration property, while spacing maps directly to the easing function. A linear easing distributes keyframes evenly — every 16ms interval covers the same distance. An ease-out curve clusters frames at the end of the motion, producing deceleration. An ease-in curve clusters them at the start, producing acceleration.",
      "The interplay between timing and spacing is what separates professional motion from amateur work. A 300ms ease-out and a 500ms linear can cover the same distance, but the ease-out version feels snappier and more intentional because it front-loads the visible change. Studio animators call this 'hitting the pose' — reaching the key position quickly and then settling into it. Try the demo to compare how linear, ease-out, and exponential curves distribute the same distance over the same duration.",
    ],
    callouts: [
      {
        type: "studio",
        title: "Ones vs Twos",
        body: "Disney animators distinguish between 'on ones' (a new drawing every frame, 24fps) and 'on twos' (a new drawing every other frame, 12fps). Web animation is always 'on ones' at 60fps, but the concept transfers: some properties update every frame while others can be throttled without perceptual loss. For example, a box-shadow can update every other frame while transform updates every frame, with no perceptible quality loss.",
      },
    ],
    demoId: "timing-scrubber",
    demoHint: "Press Play. Watch how the same distance feels different.",
    demoLegend: [
      { label: "Linear", color: "rgba(0,0,0,0.4)" },
      { label: "Ease-out", color: "#004e98" },
      { label: "Expo", color: "#b85b40" },
    ],
    checklist: {
      useWhen: [
        "ease-out for elements entering the viewport",
        "ease-in-out for elements moving between positions",
        "Custom cubic-bezier curves for brand-specific feel",
      ],
      avoidWhen: [
        "Linear easing for any spatial movement (feels mechanical)",
        "ease-in for entrances (feels sluggish starting up)",
        "Symmetric curves for asymmetric actions",
      ],
      a11yPerf: [
        "Easing has zero performance cost — always prefer it over linear",
        "CSS transitions on transform/opacity are compositor-optimized",
        "Avoid transitioning width/height — use transform: scale instead",
      ],
    },
  },
  {
    id: "easing-vs-physics",
    number: "04",
    title: "Easing vs Physics-Based Motion",
    summary:
      "Bézier curves are deterministic; spring physics are responsive. When to use each.",
    paragraphs: [
      "CSS and Framer Motion offer two fundamentally different motion models. Cubic-bezier easing defines a deterministic curve: given a duration, the position at any point in time is mathematically fixed. Spring physics, by contrast, define a system of forces (mass, stiffness, damping) that simulate physical momentum. The resulting motion has no predetermined duration — it runs until the system reaches equilibrium.",
      "Deterministic easing excels when you need precise control over timing: page transitions that must synchronize with other animations, loading sequences, orchestrated reveals. Springs excel when motion must feel responsive to interruption — a draggable element released mid-gesture should continue with its current velocity, not restart from a predetermined curve.",
      "Framer Motion's spring implementation uses the analytical solution to the damped harmonic oscillator equation, running entirely on the main thread. For most UI springs, a stiffness of 200-300 and damping of 20-30 produces a satisfying feel without excessive overshoot. Lower damping creates bouncier motion (playful UIs); higher damping creates critically-damped motion (professional/tool UIs).",
    ],
    callouts: [
      {
        type: "implementation",
        title: "Spring Interruption",
        body: "The key advantage of springs is velocity preservation on interruption. When a user hovers over a button that's still animating from a previous hover-out, a spring picks up from the current position and velocity. A bezier transition restarts from zero velocity, creating a jarring visual discontinuity.",
      },
    ],
    checklist: {
      useWhen: [
        "Springs for interactive elements that can be interrupted",
        "Bezier curves for orchestrated, non-interactive sequences",
        "Springs for drag-and-drop and gesture-driven motion",
      ],
      avoidWhen: [
        "Springs when exact duration synchronization is needed",
        "Low-damping springs in professional/enterprise UIs",
        "Mixing spring and bezier on the same element without reason",
      ],
      a11yPerf: [
        "Springs can run indefinitely — set restDelta to prevent sub-pixel oscillation",
        "Spring animations run on the main thread in Framer Motion",
        "For reduced motion, replace springs with instant transitions",
      ],
    },
  },
  {
    id: "anticipation",
    number: "05",
    title: "Anticipation",
    summary:
      "The windup before the pitch — a small reverse motion that telegraphs what's about to happen.",
    paragraphs: [
      "In animation, anticipation is the preparatory action before a main action. A character crouches before jumping, pulls back before throwing, inhales before speaking. The anticipation serves two purposes: it makes the subsequent motion more believable by implying stored energy, and it directs the viewer's attention to where the action will occur.",
      "In web UI, anticipation translates to subtle reverse motion before a primary transition. A button might scale down slightly (0.95) before scaling up on click. A card being dismissed might shift a few pixels in the opposite direction before flying off-screen. A modal might scale from 1.02 to 1.0 rather than from 0.95 to 1.0, creating a sense of the content settling into place.",
      "The key constraint is subtlety. In film animation, anticipation can be exaggerated for comedic effect. In UI, excessive anticipation feels sluggish — the user clicked a button and expects immediate response, not a theatrical windup. Keep anticipation well under 100ms and proportionally small relative to the total motion — typically just enough for the user to feel, not consciously notice. Click both buttons in the demo to feel the difference a small preparatory dip makes.",
    ],
    demoId: "anticipation-button",
    demoHint: "Click both. Feel the difference a wind-up makes.",
    callouts: [
      {
        type: "studio",
        title: "The Windup",
        body: "Disney's principle states that almost every action benefits from anticipation. In UI, this is more selective — anticipation works best for destructive or significant actions where the brief pause gives the user a moment to register what's about to happen.",
      },
    ],
    checklist: {
      useWhen: [
        "Button press feedback (subtle scale down before action)",
        "Dismissal animations (slight reverse before exit)",
        "Significant state changes that benefit from visual preparation",
      ],
      avoidWhen: [
        "Micro-interactions that need to feel instant",
        "Repeated/high-frequency actions (typing, scrolling)",
        "When the anticipation would delay perceived response time",
      ],
      a11yPerf: [
        "Keep anticipation well under 100ms to stay within instant-feel threshold",
        "Use transform only — no layout-triggering properties",
        "Skip anticipation entirely under prefers-reduced-motion",
      ],
    },
  },
  {
    id: "staging",
    number: "06",
    title: "Staging",
    summary:
      "Directing the viewer's eye — ensuring only one thing demands attention at a time.",
    paragraphs: [
      "Staging in animation means presenting an idea so that it is unmistakably clear. Only one action should dominate the scene at any time; everything else should support or recede. A character's pose, the camera angle, the background activity — all are orchestrated so the audience knows exactly where to look.",
      "Web interfaces constantly violate staging. Notifications compete with form submissions. Loading spinners spin while content pops in around them. Multiple elements animate simultaneously with equal visual weight, creating a cacophony of motion where nothing reads clearly.",
      "Good UI staging means sequential, not simultaneous. When a page loads, establish the layout first (skeleton), then reveal primary content, then secondary content. When a dialog opens, dim the background before sliding in the modal. When a user submits a form, disable the button and show the spinner before transitioning to the success state. Each beat should complete before the next begins — or at minimum, each beat should have clearly differentiated visual priority.",
    ],
    callouts: [
      {
        type: "implementation",
        title: "Stagger Orchestration",
        body: "Framer Motion's staggerChildren prop on a parent variant container is the primary tool for staging in React. A stagger of 0.03-0.06s between items in a list creates a cascade that reads as a single choreographed motion rather than simultaneous chaos.",
      },
    ],
    checklist: {
      useWhen: [
        "Page transitions with multiple content regions",
        "List/grid reveals with staggered children",
        "Multi-step processes (form → spinner → confirmation)",
      ],
      avoidWhen: [
        "Simple toggle states that should feel instant",
        "Excessive stagger delays that slow perceived load time",
        "More than 3 sequential staging beats (feels sluggish)",
      ],
      a11yPerf: [
        "Ensure screen readers announce state changes immediately, not after animation",
        "aria-live regions should update at the start of transition, not the end",
        "Stagger delays compound — 20 items × 60ms = 1.2s total, which is too long",
      ],
    },
  },
  {
    id: "overlapping-action",
    number: "07",
    title: "Overlapping Action & Follow-Through",
    summary:
      "Not everything stops at the same time — overlapping motion creates organic feel.",
    paragraphs: [
      "In traditional animation, overlapping action means that different parts of a character move at different rates. When a character stops running, the body stops first, then the arms swing past, then the hair settles, then the clothing drapes. Nothing stops simultaneously because real objects have different masses and attachment points.",
      "Follow-through is the related principle: when a primary action stops, secondary elements continue past the resting point before settling back. A pendant swings past center. Hair overshoots. Fabric ripples.",
      "In web UI, overlapping action manifests as staggered property transitions on a single element. A card might translate to its final position over 350ms while its opacity reaches 1.0 in 200ms and its scale settles from 0.92 to 1.0 over 500ms. Each property has independent timing, creating the impression of a single fluid motion with internal complexity. This is easily achieved with Framer Motion's per-property transition definitions. Toggle between lockstep and overlapping modes in the demo to see how independent property timing creates organic feel.",
    ],
    demoId: "overlap-chain",
    demoHint: "Toggle modes. Then press Play.",
    callouts: [
      {
        type: "studio",
        title: "Drag and Overlap",
        body: "The 'drag' in overlapping action refers to elements that trail behind the primary motion — like a character's cape dragging behind their torso. In UI, this translates to elements that follow a primary animation with a slight delay, creating depth and hierarchy.",
      },
    ],
    checklist: {
      useWhen: [
        "Complex component entrances (card with image, title, subtitle)",
        "Page transitions where header, content, footer enter separately",
        "Interactive feedback with multiple visual properties changing",
      ],
      avoidWhen: [
        "Simple opacity fades that don't need internal complexity",
        "High-frequency updates where stagger adds latency",
        "When total overlap duration exceeds 600ms",
      ],
      a11yPerf: [
        "Overlapping transitions on a single element are free — same GPU layer",
        "Overlapping across elements may trigger multiple compositing layers",
        "Under reduced motion, collapse all overlapping to a single instant change",
      ],
    },
  },
  {
    id: "arcs",
    number: "08",
    title: "Arcs",
    summary:
      "Natural motion follows curved paths — straight lines feel robotic.",
    paragraphs: [
      "Almost nothing in nature moves in a straight line. Arms swing in arcs. Balls follow parabolas. Even eye saccades follow curved trajectories. The arc principle states that organic motion should follow curved paths unless deliberately communicating mechanical or robotic movement.",
      "On the web, most transitions implicitly use straight-line interpolation. A translate from (0,0) to (100,200) moves diagonally in a straight line. To create an arc, you need to either decompose the motion into separate x and y transitions with different easing curves (x with ease-in, y with ease-out creates a parabolic path) or use SVG path-based motion.",
      "The practical application is selective. Navigation transitions, floating action buttons, and thrown/dismissed elements benefit from arcs. Standard slide-in panels and fade transitions do not — they already feel natural because they move along a single axis. Over-applying arcs makes a UI feel whimsical rather than professional. The demo traces both paths simultaneously so you can compare the mechanical straight line against the natural-feeling arc.",
    ],
    demoId: "arc-vs-line",
    demoHint: "Press Play. Compare the path your eye prefers.",
    demoLegend: [
      { label: "Straight", color: "rgba(0,0,0,0.4)" },
      { label: "Arc", color: "#b85b40" },
    ],
    callouts: [
      {
        type: "implementation",
        title: "Decomposed Arcs in Framer Motion",
        body: "To create an arc, set independent transitions for x and y: x with a linear or ease-in curve and y with an ease-out curve (or vice versa). Framer Motion allows per-property transition definitions, making this straightforward without path interpolation libraries.",
      },
    ],
    checklist: {
      useWhen: [
        "Floating action button reveals (arc up from bottom-right)",
        "Drag-to-dismiss or throw gestures",
        "Playful or organic design systems",
      ],
      avoidWhen: [
        "Standard slide-in/slide-out panels (single axis is fine)",
        "Professional tool UIs where precision trumps personality",
        "Any motion that already feels natural with linear interpolation",
      ],
      a11yPerf: [
        "Arcs via transform decomposition have no extra perf cost",
        "CSS motion paths (offset-path) are widely supported in modern browsers — still test across devices",
        "Under reduced motion, simplify arcs to direct position change",
      ],
    },
  },
  {
    id: "smears",
    number: "09",
    title: "Smear Frames & Motion Blur",
    summary:
      "Bridging the gap between keyframes — how fast motion maintains visual continuity.",
    paragraphs: [
      "In traditional animation, when an action is so fast that it spans a large distance in a single frame, animators draw 'smear frames' — intentionally distorted drawings that stretch or blur the character to bridge the gap between positions. Without smears, fast motion reads as teleportation: the character is at position A, then position B, with nothing connecting the two.",
      "Cameras achieve this naturally through motion blur — the physical smearing of light on film during the exposure window. Digital animation and UI rendering produce perfectly sharp frames, which is why fast UI transitions can feel unnatural. A dialog that slides 400px in 200ms shows approximately 12 distinct, sharp positions — each perfectly rendered but with noticeable gaps between them.",
      "CSS and browser APIs offer limited motion blur capabilities. The filter: blur() property can be dynamically applied during transitions but is computationally expensive. A more practical approach is to use opacity and scale creatively: an element moving fast can increase its scaleX in the direction of motion — in production, a 3–8% stretch is sufficient, though the demo below exaggerates the effect to make the principle visible at small scale. This is the web equivalent of a smear frame — a subtle shape distortion during the fastest part of the motion. Toggle smear on and off in the demo to see how a subtle stretch during peak velocity adds continuity to fast motion.",
    ],
    demoId: "smear-frames",
    demoHint: "Toggle smear. Press Play.",
    callouts: [
      {
        type: "studio",
        title: "Single-Frame Distortion",
        body: "Classic smear frames are only visible for 1-2 frames (42-83ms at 24fps). They're never meant to be seen as still images. If you pause a Disney film during fast action, you'll find drawings that look bizarre in isolation but create perfect continuity in motion.",
      },
    ],
    checklist: {
      useWhen: [
        "Page transitions covering large distances (>300px)",
        "Swipe or throw gestures where velocity is high",
        "Playful UIs where a touch of exaggeration fits the brand",
      ],
      avoidWhen: [
        "Subtle transitions under 200px of travel",
        "Enterprise or data-heavy interfaces",
        "Any context where distortion could confuse meaning",
      ],
      a11yPerf: [
        "filter: blur() triggers paint — avoid on mobile",
        "transform: scaleX is compositor-friendly",
        "Under reduced motion, skip all smear effects entirely",
      ],
    },
  },
  {
    id: "abstract-displacement",
    number: "10",
    title: "Semantic Displacement",
    summary:
      "Motion as metaphor: lift, press, recoil — cues that communicate state.",
    paragraphs: [
      "Traditional animation uses 'squash and stretch' to give weight and flexibility to objects. A bouncing ball squashes on impact and stretches in free-fall. This displacement from the rest shape communicates material properties — rubber vs. metal — and emotional tone — playful vs. rigid.",
      "Web UI has its own form of abstract displacement: elements that move, scale, or transform not because they're physically traveling through space, but to communicate state, hierarchy, or relationship. A card that lifts (translateY + shadow increase) on hover communicates interactivity. A toggle that overshoots its endpoint communicates that a state change has registered. A notification that shakes communicates urgency or error.",
      "The key insight is that these displacements are semantic, not spatial. The card isn't actually rising off the screen — the upward motion is a metaphor for 'ready to interact.' This means the displacement should be just large enough to register (4-8px for hover lifts, 2-4px for micro-feedback) and should use easing that communicates the intended physical metaphor (spring for organic, ease-out for deliberate). Hover, press, and click the cards in the demo to feel how displacement communicates different interactive states.",
    ],
    demoId: "displacement",
    demoHint: "Hover, press, and click to compare signals.",
    callouts: [
      {
        type: "studio",
        title: "Squash & Stretch in UI",
        body: "Pure squash-and-stretch (deforming the element's shape) is rare in UI and should be used sparingly. More common is the derived principle: using scale and position changes together to imply physical properties. A button that scales down on press and springs back implies elasticity.",
      },
    ],
    checklist: {
      useWhen: [
        "Hover states that need to communicate interactivity",
        "State-change confirmations (toggle, checkbox)",
        "Error or attention-directing feedback (shake, pulse)",
      ],
      avoidWhen: [
        "Data-dense interfaces where motion distracts from reading",
        "Displacements larger than 12px (feels unstable)",
        "Multiple elements displacing simultaneously",
      ],
      a11yPerf: [
        "Keep displacement transforms under 8px for comfort",
        "Use transform and opacity only — never animate layout properties",
        "Error shakes must have aria-live equivalent for screen readers",
      ],
    },
  },
  {
    id: "color-theory",
    number: "11",
    title: "Color & Opacity in Motion",
    summary:
      "How color transitions create depth, focus, and emotional cadence.",
    paragraphs: [
      "Traditional animators use 'color scripts' — frame-by-frame color palettes that shift to match emotional beats. Warm tones during joy, cool tones during tension, desaturated tones during melancholy. The color changes are gradual and synchronized with the action, creating an almost subliminal emotional current.",
      "In web UI, color transitions serve structural rather than emotional purposes, but the same principles apply. Background color shifts can delineate sections during scroll. Opacity gradients create depth hierarchies — fully opaque elements are 'near,' partially transparent elements are 'far.' Color transitions during state changes (default → hover → active → focus) create a tactile rhythm.",
      "The critical implementation detail is that color transitions should generally be faster than spatial transitions. A background color change at 150ms feels snappy; at 400ms it feels sluggish. Opacity transitions are the exception — because they affect perceived brightness, abrupt opacity changes are more jarring than abrupt color changes. Opacity transitions benefit from 200-300ms durations even when co-occurring with faster color changes. The demo shows a different aspect — how staggered color transitions across multiple elements create a wave-like cascade, a technique used in color scripts to direct visual flow.",
    ],
    demoId: "color-script",
    demoHint: "Switch palettes. Notice the cascade and mood shift.",
    callouts: [
      {
        type: "implementation",
        title: "Color Interpolation",
        body: "CSS transitions interpolate color in sRGB space by default, which can produce muddy midpoints (e.g., blue-to-yellow passes through gray). The CSS color-mix() function and the oklch color space produce more perceptually uniform transitions. Framer Motion interpolates in sRGB but the visual difference is minimal for small color shifts.",
      },
    ],
    checklist: {
      useWhen: [
        "State transitions (hover, active, disabled) as color shifts",
        "Scroll-linked background changes between page sections",
        "Focus indicators that transition rather than snap",
      ],
      avoidWhen: [
        "Large color jumps that could trigger photosensitive reactions",
        "Background color animations on large areas (expensive paint)",
        "Color as the sole indicator of state change (accessibility issue)",
      ],
      a11yPerf: [
        "Flashing content: never exceed 3 flashes per second",
        "Ensure 4.5:1 contrast ratio is maintained throughout transition",
        "background-color triggers paint — use opacity on a pseudo-element instead",
      ],
    },
  },
  {
    id: "web-toolkit",
    number: "12",
    title: "The Web Animation Toolkit",
    summary:
      "CSS transitions, Web Animations API, Framer Motion, and GSAP — when to use what.",
    paragraphs: [
      "The web platform offers four primary animation mechanisms, each with distinct tradeoffs. CSS transitions and @keyframes are declarative, compositor-optimized, and zero-dependency. The Web Animations API (WAAPI) offers JavaScript control with compositor optimization. Framer Motion provides a React-native declarative API with gesture support and layout animations. GSAP offers the most powerful timeline and sequencing capabilities with broad browser support.",
      "For most React applications, a tiered approach works well. Use CSS transitions for simple state changes (hover, focus, color). Use Framer Motion for component-level animations (enter/exit, layout, gestures). Reserve WAAPI or GSAP for complex sequences that Framer Motion's declarative model doesn't handle well — such as scroll-linked timelines with multiple synchronized tracks.",
      "The key architectural decision is avoiding mixing animation systems on the same element. If Framer Motion controls an element's transform, don't also apply CSS transitions to transform. The systems will fight for control, producing unpredictable results. Choose one system per element and use that system for all animated properties on that element.",
    ],
    callouts: [
      {
        type: "implementation",
        title: "Compositor vs Main Thread",
        body: "CSS transitions on transform and opacity can run on the compositor thread, meaning they continue smoothly even when the main thread is blocked by JavaScript. Framer Motion runs on the main thread by default. For performance-critical animations (60fps during heavy computation), CSS transitions or WAAPI are preferable.",
      },
    ],
    checklist: {
      useWhen: [
        "CSS transitions for hover/focus states and simple reveals",
        "Framer Motion for component enter/exit and layout animations",
        "WAAPI for scroll-linked effects and compositor-thread performance",
      ],
      avoidWhen: [
        "Mixing animation systems on the same element",
        "GSAP in small projects (large bundle for simple needs)",
        "CSS @keyframes for dynamic values (prefer JS-driven)",
      ],
      a11yPerf: [
        "CSS transitions: browser-native and compositor-friendly for transform/opacity",
        "Motion: use LazyMotion (m + feature packs) when you care about initial JS cost",
        "Any JS-driven animation: measure main-thread work during motion (jank is a UX bug)",
      ],
    },
  },
  {
    id: "performance-a11y",
    number: "13",
    title: "Performance & Accessibility",
    summary:
      "Rendering pipeline, compositor layers, and making motion inclusive.",
    paragraphs: [
      "The browser rendering pipeline processes changes in a fixed order: Style → Layout → Paint → Composite. Animating properties that trigger early stages (width, height, top, left trigger Layout) forces the browser to re-execute all subsequent stages every frame. Animating compositor-only properties (transform, opacity) skips directly to the Composite stage, executing on a separate GPU thread.",
      "This distinction is not theoretical. On a mid-range mobile device, a width animation will drop to 20-30fps while a transform animation maintains 60fps. The visual result may be identical (both resize an element), but the performance is dramatically different. Always prefer transform: scale() over width/height, transform: translate() over top/left, and opacity over visibility.",
      "Accessibility is equally non-negotiable. The prefers-reduced-motion media query should gate all non-essential animation. 'Non-essential' means animation that doesn't convey information the user needs to understand the interface. A loading spinner is essential (it communicates 'wait'). A decorative parallax effect is not. When reduced motion is active, transitions should either be instant (duration: 0) or replaced with opacity-only crossfades at reduced duration.",
    ],
    callouts: [
      {
        type: "implementation",
        title: "will-change Pitfalls",
        body: "will-change: transform promotes an element to its own compositor layer, enabling smooth animation. But each layer consumes GPU memory. Applying will-change to dozens of elements (e.g., every item in a virtualized list) can cause memory pressure and actually worsen performance. Apply will-change only to elements that are actively animating, and remove it afterward.",
      },
    ],
    checklist: {
      useWhen: [
        "transform and opacity for all spatial and visibility animations",
        "will-change on elements about to animate (hover intent)",
        "prefers-reduced-motion to disable decorative motion",
      ],
      avoidWhen: [
        "Animating layout properties (width, height, margin, padding)",
        "will-change on static elements 'just in case'",
        "Disabling all animation under reduced motion (essential motion should remain)",
      ],
      a11yPerf: [
        "Use Chrome DevTools → Rendering → Frame Rendering Stats for real-time FPS",
        "Test on real mobile devices — DevTools throttling is not representative",
        "WCAG 2.1 SC 2.3.3: motion from interaction must be disableable",
      ],
    },
  },
  {
    id: "further-reading",
    number: "14",
    title: "Further Reading",
    summary: "Books, talks, and tools for continued exploration.",
    paragraphs: [
      "'The Illusion of Life' by Frank Thomas and Ollie Johnston remains the definitive reference for animation principles. For web-specific application, 'Animation at Work' by Rachel Nabors bridges the gap between traditional animation theory and CSS/JavaScript implementation.",
      "Val Head's 'Designing Interface Animation' provides a practical framework for deciding when, where, and how to use motion in digital products. For the technical implementation layer, the MDN Web Animations API documentation and Framer Motion's official docs are comprehensive references.",
      "For ongoing learning, the Chrome DevTools Performance panel and the Rendering tab's paint flashing and layer borders overlays are essential tools for diagnosing animation performance. Josh Comeau's blog and Emil Kowalski's 'animations.dev' site provide excellent practical examples of animation principles applied to web interfaces.",
    ],
    callouts: [
      {
        type: "studio",
        title: "Recommended Reading List",
        body: "The Illusion of Life (Thomas & Johnston, 1981), The Animator's Survival Kit (Richard Williams, 2001), Designing Interface Animation (Val Head, 2016), Animation at Work (Rachel Nabors, 2017).",
      },
    ],
  },
];
