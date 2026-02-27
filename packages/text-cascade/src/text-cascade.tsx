import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useTextCascade } from "./use-text-cascade";
import { TextCascadeRenderer } from "./text-cascade-renderer";
import { generateGlowTransition } from "./generate-glow-transition";
import type { TextCascadeProps, TextCascadeHandle, CascadePhase } from "./types";

export const TextCascade = forwardRef<TextCascadeHandle, TextCascadeProps>(
  function TextCascade(
    {
      hoverText,
      clickText,
      onClick,
      trigger,
      timing,
      expandedWidth,
      className,
      textClassName,
      charClassName,
      glowClassName,
      glowColor,
      cascadeWeight,
      as: Tag = "span",
      "aria-label": ariaLabel,
      onEnter,
      onExit,
      onConfirm,
    },
    ref
  ) {
    const glowTransition = useMemo(
      () =>
        clickText ? generateGlowTransition(hoverText, clickText) : undefined,
      [hoverText, clickText]
    );

    const state = useTextCascade({
      text: hoverText,
      glowTransition,
      timing,
    });

    const prevPhaseRef = useRef<CascadePhase>("idle");

    useImperativeHandle(
      ref,
      () => ({
        enter: state.enter,
        exit: state.exit,
        confirm: state.confirm,
        get phase() {
          return state.phase;
        },
        get isExpanded() {
          return state.isExpanded;
        },
        get isConfirmed() {
          return state.isConfirmed;
        },
      }),
      [state]
    );

    useEffect(() => {
      const prev = prevPhaseRef.current;
      const curr = state.phase;
      prevPhaseRef.current = curr;

      if (prev === "idle" && curr === "entering") {
        onEnter?.();
      } else if (prev === "idle" && curr === "visible") {
        // Reduced motion: skip entering, go straight to visible
        onEnter?.();
      }

      if (curr === "idle" && prev !== "idle") {
        onExit?.();
      }

      if (curr === "confirmed" && prev !== "confirmed") {
        onConfirm?.();
      }
    }, [state.phase, onEnter, onExit, onConfirm]);

    const handleClick = onClick
      ? () => {
          onClick();
          if (glowTransition) {
            state.confirm();
          }
        }
      : undefined;

    return (
      <Tag
        onMouseEnter={state.enter}
        onMouseLeave={state.exit}
        onClick={handleClick}
        className={className}
        aria-label={ariaLabel}
      >
        {trigger?.({ clicked: state.isConfirmed })}
        <TextCascadeRenderer
          state={state}
          expandedWidth={expandedWidth}
          className={textClassName}
          charClassName={charClassName}
          glowClassName={glowClassName}
          glowColor={glowColor}
          cascadeWeight={cascadeWeight}
          timing={timing}
        />
      </Tag>
    );
  }
);
