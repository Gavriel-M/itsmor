export type DemoId =
  | "timing-scrubber"
  | "anticipation-button"
  | "overlap-chain"
  | "arc-vs-line"
  | "smear-frames"
  | "displacement"
  | "color-script";

export interface Callout {
  type: "studio" | "implementation";
  title: string;
  body: string;
  source?: string;
}

export interface Checklist {
  useWhen: string[];
  avoidWhen: string[];
  a11yPerf: string[];
}

export interface ResearchSection {
  id: string;
  number: string;
  title: string;
  summary?: string;
  paragraphs: string[];
  callouts?: Callout[];
  checklist?: Checklist;
  demoId?: DemoId;
}
