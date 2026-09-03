/**
 * Asserts that what `output: "export"` actually publishes matches what we
 * intend to publish.
 *
 * `INDEXABLE_ROUTES` was previously a hand-maintained list whose stated purpose
 * was that a new route "has to be added deliberately rather than appearing by
 * accident". Nothing checked it, so it could not deliver that: every directory
 * under src/app/ ships whether or not it is listed, and deploy.sh syncs all of
 * out/. A stray dev route is exactly how /banner nearly went live.
 *
 * Run against a build: pnpm build && pnpm routes:check
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, relative } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");

/** Published but deliberately not in the sitemap. */
const UNLISTED = new Set(["/cv", "/404", "/_not-found"]);

if (!existsSync(OUT)) {
  console.error("✗ no out/ — run pnpm build first");
  process.exit(1);
}

const { INDEXABLE_ROUTES } = await import(
  pathToFileURL(join(ROOT, "src/lib/routes.ts")).href
);

function htmlRoutes(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      return entry === "_next" ? [] : htmlRoutes(full);
    }
    if (!entry.endsWith(".html")) return [];
    const rel = relative(OUT, full).replace(/\.html$/, "");
    return [rel === "index" ? "/" : `/${rel}`];
  });
}

const published = new Set(htmlRoutes(OUT));
const intended = new Set([...INDEXABLE_ROUTES, ...UNLISTED]);

const unexpected = [...published].filter((r) => !intended.has(r)).sort();
const missing = [...INDEXABLE_ROUTES].filter((r) => !published.has(r)).sort();

if (unexpected.length || missing.length) {
  console.error("✗ route check failed\n");
  for (const r of unexpected) {
    console.error(`  ${r} is published but not intended`);
  }
  for (const r of missing) {
    console.error(`  ${r} is in INDEXABLE_ROUTES but was not published`);
  }
  console.error(
    "\n  Add it to INDEXABLE_ROUTES, add it to UNLISTED here, or move it out of src/app/."
  );
  process.exit(1);
}

console.log("✓ routes");
console.log(
  `  ${published.size} published, all intended (${INDEXABLE_ROUTES.length} in the sitemap, ${UNLISTED.size} unlisted)`
);
