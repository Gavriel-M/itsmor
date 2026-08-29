import { DEFAULT_TIMING } from "./constants";
import type { TextCascadeRendererProps } from "./types";

export function TextCascadeRenderer({
  state,
  className,
  charClassName,
  glowClassName,
  stableWidth,
  timing,
  glow,
  glowColor,
  weightPulse,
  cascadeWeight,
  fontWeight,
  dynamicWidth,
}: TextCascadeRendererProps) {
  const containerEasing =
    timing?.containerEasing ?? DEFAULT_TIMING.containerEasing;
  const containerTransitionMs =
    timing?.containerTransitionMs ?? DEFAULT_TIMING.containerTransitionMs;
  const charTransitionMs =
    timing?.charTransitionMs ?? DEFAULT_TIMING.charTransitionMs;

  const glowOn = glow ?? Boolean(glowColor);
  const weightOn = weightPulse ?? Boolean(cascadeWeight);

  return (
    <span
      className={className}
      data-phase={state.phase}
      {...(glowOn ? { "data-glow": "" } : undefined)}
      {...(weightOn ? { "data-cascade-weight": "" } : undefined)}
      style={
        {
          overflow: "hidden",
          display: "inline-flex",
          whiteSpace: "nowrap",
          transitionProperty: "all",
          width: dynamicWidth
            ? state.isExpanded
              ? `${state.displayText.length + 2}ch`
              : "0"
            : stableWidth,
          transitionTimingFunction: containerEasing,
          transitionDuration: `${containerTransitionMs}ms`,
          "--char-step": `${state.charStepMs}ms`,
          "--char-transition": `${charTransitionMs}ms`,
          ...(glowColor
            ? {
                "--cascade-glow-color": glowColor,
              }
            : undefined),
          ...(cascadeWeight
            ? {
                "--cascade-weight": cascadeWeight,
              }
            : undefined),
          ...(fontWeight
            ? {
                "--cascade-font-weight": fontWeight,
              }
            : undefined),
        } as React.CSSProperties
      }
    >
      <span style={{ display: "inline-flex" }} className={charClassName}>
        {state.displayText.split("").map((char, i) => {
          const isActive =
            state.phase === "entering" ||
            state.phase === "visible" ||
            state.phase === "glowing" ||
            state.phase === "confirmed"
              ? true
              : state.phase === "exiting"
                ? i < state.revealCount
                : false;

          const isGlowing = i === state.glowCharIndex;

          const exitDelay =
            state.revealCount > 0
              ? (state.revealCount - 1 - i) * state.charStepMs
              : 0;

          return (
            <span
              key={i}
              className={
                isGlowing && glowClassName
                  ? `text-cascade ${glowClassName}`
                  : "text-cascade"
              }
              data-active={isActive || undefined}
              style={
                {
                  "--char-delay": `${i * state.charStepMs}ms`,
                  "--exit-delay": `${Math.max(0, exitDelay)}ms`,
                  ...(isGlowing && glowOn && glowColor
                    ? { color: glowColor }
                    : undefined),
                  ...(isGlowing && weightOn && cascadeWeight
                    ? { fontWeight: cascadeWeight }
                    : undefined),
                } as React.CSSProperties
              }
            >
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
