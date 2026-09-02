/**
 * Asserts the two things `~/logzio/career/check.sh --tokens` cannot see into.
 *
 *   1. `globals.css`'s `@theme` block agrees with `src/lib/tokens.ts`.
 *      Tailwind v4 needs literal hex in CSS to generate utilities, so the
 *      values are necessarily written twice. This is why that is safe.
 *   2. No palette hex appears anywhere in `src/` except `src/lib/tokens.ts`.
 *      A count-based guard passes a migration that moves a literal from one
 *      component to another; a location-based one does not.
 *
 * Run: pnpm tokens:check
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_FILE = "src/lib/tokens.ts";

const { PALETTE } = await import(join(ROOT, TOKENS_FILE));

const problems = [];

// ── 1. globals.css @theme must match PALETTE ────────────────────────────────
const css = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
const theme = css.slice(
  css.indexOf("@theme"),
  css.indexOf("}", css.indexOf("@theme"))
);

const declared = new Map();
for (const m of theme.matchAll(
  /--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g
)) {
  declared.set(m[1], m[2].toLowerCase());
}

for (const [name, hex] of Object.entries(PALETTE)) {
  const inCss = declared.get(name);
  if (inCss === undefined) {
    problems.push(
      `globals.css @theme is missing --color-${name} (tokens.ts has ${hex})`
    );
  } else if (inCss !== hex.toLowerCase()) {
    problems.push(
      `--color-${name}: globals.css says ${inCss}, tokens.ts says ${hex.toLowerCase()}`
    );
  }
}
for (const name of declared.keys()) {
  if (!(name in PALETTE)) {
    problems.push(
      `globals.css declares --color-${name}, which is not in PALETTE`
    );
  }
}

// ── 2. palette hex may live in exactly one file ─────────────────────────────
// The retired terracotta is included on purpose: it must not reappear, and it
// is legitimate only inside tokens.ts, where it is documented as retired.
const HEXES = [...Object.values(PALETTE), "#b85b40"].map((h) => h.slice(1));
let hits = "";
try {
  hits = execFileSync(
    "grep",
    [
      "-rnoiE",
      `#(${HEXES.join("|")})`,
      "src",
      "--include=*.ts",
      "--include=*.tsx",
    ],
    { cwd: ROOT, encoding: "utf8" }
  );
} catch (err) {
  // grep exits 1 when it matches nothing, which is a pass for this check.
  if (err.status !== 1) throw err;
}

const strays = hits
  .split("\n")
  .filter(Boolean)
  .map((line) => line.split(":")[0])
  .filter((file) => relative(".", file) !== TOKENS_FILE);

if (strays.length) {
  const counts = strays.reduce((a, f) => ((a[f] = (a[f] || 0) + 1), a), {});
  for (const [file, n] of Object.entries(counts)) {
    problems.push(
      `${file}: ${n} palette hex literal(s) — read the token instead`
    );
  }
}

// ── 3. no jig may carry a palette hex either ───────────────────────────────
// The jigs are the surfaces that actually drifted onto the retired terracotta,
// so they are checked, not trusted, exactly like src/.
let jigHits = "";
try {
  jigHits = execFileSync(
    "grep",
    ["-rnoiE", `#(${HEXES.join("|")})`, "tools", "--include=*.html"],
    { cwd: ROOT, encoding: "utf8" }
  );
} catch (err) {
  if (err.status !== 1) throw err;
}
for (const line of jigHits.split("\n").filter(Boolean)) {
  problems.push(
    `${line.split(":").slice(0, 2).join(":")}: palette hex in a jig — use var(--color-*)`
  );
}

// ── 4. the jigs' generated stylesheet must be current ──────────────────────
try {
  execFileSync(
    process.execPath,
    [
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "tools/gen-tokens.mjs",
      "--check",
    ],
    { cwd: ROOT, encoding: "utf8", stdio: "pipe" }
  );
} catch {
  problems.push(
    "tools/tokens.generated.css is stale — run node tools/gen-tokens.mjs"
  );
}

// ── report ──────────────────────────────────────────────────────────────────
const total = hits.split("\n").filter(Boolean).length;
if (problems.length) {
  console.error("✗ token check failed\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    `\n  ${TOKENS_FILE} is the only place a palette hex may appear.`
  );
  process.exit(1);
}
console.log("✓ tokens");
console.log(
  `  globals.css @theme agrees with ${TOKENS_FILE} on all ${Object.keys(PALETTE).length} colours`
);
console.log(`  ${total} palette hex literal(s) in src/, all in ${TOKENS_FILE}`);
console.log(
  "  tools/tokens.generated.css is current, and no jig carries a palette hex"
);
