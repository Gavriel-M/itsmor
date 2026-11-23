/**
 * Writes dist/theme.css: the palette as a Tailwind v4 `@theme` block, for
 * consumers outside this workspace. itsmor.com keeps its own `@theme` in
 * globals.css, which `pnpm tokens:check` holds against the same module.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { PALETTE, GRID_LINE } = await import(
  pathToFileURL(join(ROOT, "src/index.ts")).href
);

const colours = Object.entries(PALETTE)
  .map(([name, hex]) => `  --color-${name}: ${hex};`)
  .join("\n");

const css = `/* GENERATED from @itsmor/tokens src/index.ts. Do not edit. */
@theme {
${colours}
}

:root {
  --grid-cell: 4rem;
  --grid-line: ${GRID_LINE};
}
`;

mkdirSync(join(ROOT, "dist"), { recursive: true });
writeFileSync(join(ROOT, "dist/theme.css"), css);
console.log("wrote dist/theme.css");
