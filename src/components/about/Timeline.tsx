interface TimelineEvent {
  label: string;
  year: string;
  /** 0 = top, 1 = bottom. Only used by the chart layout. */
  yPosition: number;
  emphasis: "primary" | "secondary";
}

const EVENTS: TimelineEvent[] = [
  {
    label: "CS COURSEWORK",
    year: "2020",
    yPosition: 0.7,
    emphasis: "secondary",
  },
  {
    label: "HACKERU BOOTCAMP",
    year: "2021",
    yPosition: 0.55,
    emphasis: "secondary",
  },
  {
    label: "GRADUATED · SELF-STUDY",
    year: "2022",
    yPosition: 0.6,
    emphasis: "secondary",
  },
  {
    label: "JOINED LOGZ.IO",
    year: "2023",
    yPosition: 0.4,
    emphasis: "primary",
  },
  {
    label: "EXPLORE · ALERTS · FIRST AI FEATURES",
    year: "2024",
    yPosition: 0.32,
    emphasis: "secondary",
  },
  {
    label: "DESIGN SYSTEM LEAD",
    year: "2025",
    yPosition: 0.22,
    emphasis: "primary",
  },
  {
    label: "ACTING TEAM LEAD · SIEM MIGRATION",
    year: "2026",
    yPosition: 0.13,
    emphasis: "primary",
  },
  {
    label: "ORIONIQ · SECOND ENGINEER",
    year: "NOW",
    yPosition: 0.05,
    emphasis: "primary",
  },
];

/** Percent, so positions need no measurement. */
const PAD_X = 5;

/** IBM Plex Mono advance at text-xs: 12px x 0.6em. */
const LABEL_CHAR_PX = 7.2;

/**
 * Narrowest the chart ever gets, at the `lg` breakpoint where it appears. Label
 * anchoring is decided against this rather than a measured width: a left-anchored
 * label that clears the narrowest chart clears every wider one too.
 */
const CHART_MIN_PX = 620;

const positionOf = (i: number) => ({
  x: PAD_X + (i / (EVENTS.length - 1)) * (100 - PAD_X * 2),
  y: EVENTS[i].yPosition * 100,
});

const PATH = EVENTS.map((_, i) => {
  const { x, y } = positionOf(i);
  return `${i === 0 ? "M" : "L"} ${x},${y}`;
}).join(" ");

export default function Timeline() {
  return (
    <div className="w-full mt-12">
      <h3 className="font-mono text-xs text-terracotta uppercase tracking-widest mb-8">
        Personal Timeline
      </h3>

      <ol className="relative lg:h-80">
        {/*
          viewBox units are percentages of the box, matching the dots' left/top,
          so the line and the dots agree without either being measured.
          preserveAspectRatio="none" stretches those units to the box;
          vector-effect keeps the stroke from stretching with them.
        */}
        <svg
          className="timeline-line hidden lg:block absolute inset-0 w-full h-full overflow-visible text-lapis"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {EVENTS.map((event, i) => {
          const { x, y } = positionOf(i);
          const anchorRight =
            (x / 100) * CHART_MIN_PX + event.label.length * LABEL_CHAR_PX >
            CHART_MIN_PX;

          return (
            <li
              key={event.year + event.label}
              style={{ "--x": `${x}%`, "--y": `${y}%` } as React.CSSProperties}
              className="flex items-center gap-3 py-1.5 lg:absolute lg:block lg:py-0 lg:left-[var(--x)] lg:top-[var(--y)] lg:-translate-x-1/2 lg:-translate-y-1/2"
            >
              <span
                aria-hidden="true"
                className={`block shrink-0 rounded-full ${
                  event.emphasis === "primary"
                    ? "w-3 h-3 bg-amber border-4 border-terracotta"
                    : "w-2 h-2 mx-0.5 bg-terracotta lg:mx-0"
                }`}
              />

              <span className="shrink-0 w-10 font-mono text-xs text-lapis lg:hidden">
                {event.year}
              </span>

              <span
                className={`font-mono text-xs lg:absolute lg:whitespace-nowrap ${
                  anchorRight ? "lg:right-0 lg:bottom-3" : "lg:left-0"
                } ${!anchorRight && event.yPosition <= 0.5 ? "lg:top-4" : ""} ${
                  !anchorRight && event.yPosition > 0.5 ? "lg:bottom-3" : ""
                }`}
              >
                {event.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
