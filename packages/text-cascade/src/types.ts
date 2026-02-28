import type { ReactNode } from "react";

/** A single frame in a glow-morph transition sequence */
export interface CascadeGlowFrame {
  text: string;
  glowIndex: number;
}

/** Phase of the cascade state machine */
export type CascadePhase =
  | "idle"
  | "entering"
  | "visible"
  | "glowing"
  | "confirmed"
  | "exiting";

/** Optional glow-morph transition config (e.g. "Copy" -> "Copied") */
export interface CascadeGlowTransition {
  frames: readonly CascadeGlowFrame[];
  confirmedText: string;
}

/** Timing overrides — all optional, defaults in constants.ts */
export interface CascadeTiming {
  charStepMs?: number;
  charTransitionMs?: number;
  confirmHoldMs?: number;
  containerEasing?: string;
  containerTransitionMs?: number;
}

/** Internal options for useTextCascade */
export interface UseTextCascadeOptions {
  text: string;
  glowTransition?: CascadeGlowTransition;
  timing?: CascadeTiming;
}

/** Internal return value from useTextCascade */
export interface TextCascadeState {
  phase: CascadePhase;
  displayText: string;
  revealCount: number;
  glowCharIndex: number;
  charStepMs: number;
  isExpanded: boolean;
  isConfirmed: boolean;
  enter: () => void;
  exit: () => void;
  confirm: () => void;
}

/** Internal props for TextCascadeRenderer */
export interface TextCascadeRendererProps {
  state: TextCascadeState;
  className?: string;
  charClassName?: string;
  glowClassName?: string;
  stableWidth: string;
  timing?: CascadeTiming;
  glowColor?: string;
  cascadeWeight?: number;
  fontWeight?: number;
  dynamicWidth?: boolean;
}

/** Props for the public TextCascade component */
export interface TextCascadeProps {
  hoverText: string;
  clickText?: string;
  onClick?: () => void;
  trigger?: (props: { clicked: boolean }) => ReactNode;
  timing?: CascadeTiming;
  className?: string;
  textClassName?: string;
  charClassName?: string;
  glowClassName?: string;
  glowColor?: string;
  cascadeWeight?: number;
  fontWeight?: number;
  dynamicWidth?: boolean;
  as?: "span" | "button" | "div";
  "aria-label"?: string;
  onEnter?: () => void;
  onExit?: () => void;
  onConfirm?: () => void;
}

/** Imperative handle for TextCascade */
export interface TextCascadeHandle {
  enter: () => void;
  exit: () => void;
  confirm: () => void;
  readonly phase: CascadePhase;
  readonly isExpanded: boolean;
  readonly isConfirmed: boolean;
}
