/**
 * Asserts what `~/logzio/career/check.sh --tokens` cannot see into: that
 * globals.css agrees with the token module, that no palette hex appears
 * anywhere else in src/ or in a jig, and that the jigs' generated stylesheet is
 * current. Location-based rather than count-based, so a migration that only
 * moves a literal between files still fails.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { renderTokensCss, tokensCssIsCurrent } from "./gen-tokens.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_FILE = "src/lib/tokens.ts";
const RETIRED = ["#b85b40"];

const { PALETTE } = await import(join(ROOT, TOKENS_FILE));
const problems = [];

const css = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
const theme = css.slice(
  css.indexOf("@theme"),
  css.indexOf("}", css.indexOf("@theme"))
);
const declared = new Map(
  [
    ...theme.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g),
  ].map((m) => [m[1], m[2].toLowerCase()])
);

for (const [name, hex] of Object.entries(PALETTE)) {
  const inCss = declared.get(name);
  if (inCss === undefined) {
    problems.push(`globals.css is missing --color-${name} (tokens.ts: ${hex})`);
  } else if (inCss !== hex.toLowerCase()) {
    problems.push(`--color-${name}: globals.css ${inCss}, tokens.ts ${hex}`);
  }
}
for (const name of declared.keys()) {
  if (!(name in PALETTE)) {
    problems.push(`globals.css declares --color-${name}, absent from PALETTE`);
  }
}

const pattern = `#(${[...Object.values(PALETTE), ...RETIRED]
  .map((h) => h.slice(1))
  .join("|")})`;

function grep(...args) {
  try {
    return execFileSync("grep", ["-rnoiE", pattern, ...args], {
      cwd: ROOT,
      encoding: "utf8",
    });
  } catch (err) {
    if (err.status === 1) return "";
    throw err;
  }
}

const strays = grep("src", "--include=*.ts", "--include=*.tsx")
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(":")[0])
  .filter((file) => relative(".", file) !== TOKENS_FILE);

for (const [file, n] of Object.entries(
  strays.reduce((a, f) => ((a[f] = (a[f] || 0) + 1), a), {})
)) {
  problems.push(
    `${file}: ${n} palette hex literal(s) — read the token instead`
  );
}

for (const line of grep("tools", "--include=*.html")
  .split("\n")
  .filter(Boolean)) {
  problems.push(
    `${line.split(":").slice(0, 2).join(":")}: palette hex in a jig — use var(--color-*)`
  );
}

if (!tokensCssIsCurrent(await renderTokensCss())) {
  problems.push(
    "tools/tokens.generated.css is stale — run node tools/gen-tokens.mjs"
  );
}

if (problems.length) {
  console.error("✗ token check failed\n");
  for (const p of problems) console.error("  " + p);
  console.error(`\n  ${TOKENS_FILE} is the only place a palette hex may live.`);
  process.exit(1);
}

console.log("✓ tokens");
console.log(
  `  globals.css agrees with ${TOKENS_FILE} on all ${Object.keys(PALETTE).length} colours`
);
console.log(`  no palette hex outside ${TOKENS_FILE}, in src/ or in a jig`);
console.log("  tools/tokens.generated.css is current");
