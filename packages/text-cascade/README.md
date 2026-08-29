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

| Prop            | Type                                         | Default   | Description                                                                |
| --------------- | -------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| `hoverText`     | `string`                                     | required  | Text revealed on hover                                                     |
| `clickText`     | `string`                                     | —         | Text after click confirm. Omit to disable click/glow-morph                 |
| `onClick`       | `() => void`                                 | —         | Fires on click (before confirm animation begins)                           |
| `trigger`       | `(props: { clicked: boolean }) => ReactNode` | —         | Render prop for companion UI (e.g. icon)                                   |
| `timing`        | `CascadeTiming`                              | —         | Timing overrides                                                           |
| `className`     | `string`                                     | —         | Class on the root wrapper element                                          |
| `textClassName` | `string`                                     | —         | Class on the text animation container                                      |
| `charClassName` | `string`                                     | —         | Class on per-character spans                                               |
| `glowClassName` | `string`                                     | —         | Class on glowing character during morph                                    |
| `glow`          | `boolean`                                    | see below | Turns the color-glow animation on                                          |
| `glowColor`     | `string`                                     | —         | Color the glow animates to; sets `--cascade-glow-color`                    |
| `weightPulse`   | `boolean`                                    | see below | Turns the weight-pulse animation on                                        |
| `cascadeWeight` | `number`                                     | —         | Weight the pulse animates to; sets `--cascade-weight`                      |
| `fontWeight`    | `number`                                     | inherit   | Resting font weight of the characters                                      |
| `dynamicWidth`  | `boolean`                                    | `false`   | Size the container from the current text instead of a fixed reserved width |
| `as`            | `"span" \| "button" \| "div"`                | `"span"`  | Root wrapper element type                                                  |
| `aria-label`    | `string`                                     | —         | Accessible label for the wrapper                                           |
| `onEnter`       | `() => void`                                 | —         | Fires when enter begins                                                    |
| `onExit`        | `() => void`                                 | —         | Fires when exit completes (idle)                                           |
| `onConfirm`     | `() => void`                                 | —         | Fires when confirm completes                                               |

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

There are two optional effects — a per-character color glow and a weight pulse.
Each has a **switch** that turns it on and a **value** that says what it animates
to:

| Effect       | Switch        | Value           | CSS variable           |
| ------------ | ------------- | --------------- | ---------------------- |
| Color glow   | `glow`        | `glowColor`     | `--cascade-glow-color` |
| Weight pulse | `weightPulse` | `cascadeWeight` | `--cascade-weight`     |

Both effects are off by default. Passing a value turns its effect on, so the
short form is all you need most of the time:

```tsx
<TextCascade hoverText="Copy" glowColor="#ffd700" cascadeWeight={700} />
```

Setting the switch on its own turns the effect on and leaves the value to CSS.
This is the way to drive the animation from a theme rather than hardcoding it:

```tsx
<TextCascade hoverText="Copy" glow />
```

```css
:root {
  --cascade-glow-color: #ffd700;
}
```

**Where both are present, the prop wins** — it writes the variable inline on the
animation container, which overrides anything inherited from `:root` or an
ancestor rule. Omit the value prop when you want CSS to decide, and pass it when
one instance needs to differ from the theme.

Set the switch to `false` to hold an effect off even though a value is present
(`glow={false}` with a `glowColor` set), which is useful when the value comes
from shared config.

One more variable has no switch, because it is a resting style rather than an
animation:

| Property                | Set by prop  | Effect                            |
| ----------------------- | ------------ | --------------------------------- |
| `--cascade-font-weight` | `fontWeight` | Resting weight of every character |

## Accessibility

Respects `prefers-reduced-motion: reduce` — all animations are skipped and state transitions are instant.

## License

MIT
