import type { CascadeTiming } from "./types";

export const DEFAULT_TIMING: Required<CascadeTiming> = {
  charStepMs: 60,
  charTransitionMs: 150,
  confirmHoldMs: 1500,
  containerEasing: "cubic-bezier(0.22, 1, 0.36, 1)",
  containerTransitionMs: 500,
};
