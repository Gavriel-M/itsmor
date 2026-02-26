import { type ComponentType, lazy } from "react";
import type { DemoId } from "../types";

export const DEMO_MAP: Record<DemoId, ComponentType> = {
  "timing-scrubber": lazy(() => import("./TimingScrubberDemo")),
  "anticipation-button": lazy(() => import("./AnticipationButtonDemo")),
  "overlap-chain": lazy(() => import("./OverlapChainDemo")),
  "arc-vs-line": lazy(() => import("./ArcVsLineDemo")),
  "smear-frames": lazy(() => import("./SmearFramesDemo")),
  displacement: lazy(() => import("./DisplacementDemo")),
  "color-script": lazy(() => import("./ColorScriptDemo")),
};
