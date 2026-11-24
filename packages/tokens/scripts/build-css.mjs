import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PALETTE, GRID_CELL, GRID_LINE } from "../dist/index.js";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "../dist");

const colours = Object.entries(PALETTE)
  .map(([name, hex]) => `  --color-${name}: ${hex};`)
  .join("\n");

writeFileSync(
  join(DIST, "theme.css"),
  `/* GENERATED from @itsmor/tokens. Do not edit. */
@theme {
${colours}
}

:root {
  --grid-cell: ${GRID_CELL};
  --grid-line: ${GRID_LINE};
}
`
);
