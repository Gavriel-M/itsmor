import { DEFAULT_TIMING } from "./constants";
import type { TextCascadeRendererProps } from "./types";

export function TextCascadeRenderer({
  state,
  className = "",
  charClassName = "",
  glowClassName = "",
  expandedWidth,
  timing,
  glowColor,
  cascadeWeight,
}: TextCascadeRendererProps) {
  const containerEasing =
    timing?.containerEasing ?? DEFAULT_TIMING.containerEasing;
  const containerTransitionMs =
    timing?.containerTransitionMs ?? DEFAULT_TIMING.containerTransitionMs;
  const charTransitionMs =
    timing?.charTransitionMs ?? DEFAULT_TIMING.charTransitionMs;

  return (
    <span
      className={className}
      data-phase={state.phase}
      {...(glowColor ? { "data-glow": "" } : undefined)}
      style={
        {
          overflow: "hidden",
          display: "inline-flex",
          whiteSpace: "nowrap",
          transitionProperty: "all",
          maxWidth: state.isExpanded
            ? (expandedWidth ?? `${state.displayText.length + 2}ch`)
            : "0",
          transitionTimingFunction: containerEasing,
          transitionDuration: `${containerTransitionMs}ms`,
          "--char-step": `${state.charStepMs}ms`,
          "--char-transition": `${charTransitionMs}ms`,
          ...(glowColor
            ? {
                "--cascade-glow-color": glowColor,
                "--cascade-weight": cascadeWeight ?? 600,
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
              className={`text-cascade ${isGlowing ? glowClassName : ""}`}
              data-active={isActive || undefined}
              style={
                {
                  "--char-delay": `${i * state.charStepMs}ms`,
                  "--exit-delay": `${Math.max(0, exitDelay)}ms`,
                  ...(isGlowing && glowColor
                    ? {
                        color: glowColor,
                        fontWeight: cascadeWeight ?? 600,
                      }
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
