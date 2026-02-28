# text-cascade

Per-character staggered text reveal animation for React, with glow-morph support.

## Install

```bash
npm install text-cascade
# or
pnpm add text-cascade
```

## Quick Start

```tsx
import { TextCascade } from "text-cascade";
import "text-cascade/styles.css";

function App() {
  return <TextCascade hoverText="Hello" />;
}
```

## API

### `<TextCascade>`

Single component — hover reveals text, optional click-to-confirm with glow morph.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `hoverText` | `string` | required | Text revealed on hover |
| `clickText` | `string` | — | Text after click confirm. Omit to disable click/glow-morph |
| `onClick` | `() => void` | — | Fires on click (before confirm animation begins) |
| `trigger` | `(props: { clicked: boolean }) => ReactNode` | — | Render prop for companion UI (e.g. icon) |
| `timing` | `CascadeTiming` | — | Timing overrides |
| `expandedWidth` | `string` | auto | Text container width when expanded |
| `className` | `string` | — | Class on the root wrapper element |
| `textClassName` | `string` | — | Class on the text animation container |
| `charClassName` | `string` | — | Class on per-character spans |
| `glowClassName` | `string` | — | Class on glowing character during morph |
| `as` | `"span" \| "button" \| "div"` | `"span"` | Root wrapper element type |
| `aria-label` | `string` | — | Accessible label for the wrapper |
| `onEnter` | `() => void` | — | Fires when enter begins |
| `onExit` | `() => void` | — | Fires when exit completes (idle) |
| `onConfirm` | `() => void` | — | Fires when confirm completes |

### Progressive Disclosure

```tsx
// Simplest: hover text reveal only
<TextCascade hoverText="Copy" />

// Add click-to-confirm with glow morph
<TextCascade hoverText="Copy" clickText="Copied" onClick={handleCopy} />

// Add companion icon that reacts to click state
<TextCascade
  hoverText="Copy"
  clickText="Copied"
  onClick={handleCopy}
  trigger={({ clicked }) => (
    <span>{clicked ? <CheckIcon /> : <LinkIcon />}</span>
  )}
/>
```

### Imperative Handle

Use a ref for programmatic control:

```tsx
import { useRef } from "react";
import { TextCascade, type TextCascadeHandle } from "text-cascade";

function App() {
  const ref = useRef<TextCascadeHandle>(null);

  return (
    <>
      <TextCascade hoverText="Hello" ref={ref} />
      <button onClick={() => ref.current?.enter()}>Enter</button>
      <button onClick={() => ref.current?.exit()}>Exit</button>
    </>
  );
}
```

## Styling

Import the CSS file for animations:

```tsx
import "text-cascade/styles.css";
```

Customize the glow color with CSS:

```css
:root {
  --cascade-glow-color: #ffd700;
}
```

## Accessibility

Respects `prefers-reduced-motion: reduce` — all animations are skipped and state transitions are instant.

## License

MIT
