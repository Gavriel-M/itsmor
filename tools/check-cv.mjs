/**
 * Asserts that the published CV set matches what `src/lib/cv.ts` declares.
 *
 * Two things this exists to catch, both of which fail silently otherwise because
 * every candidate file is a valid CV:
 *
 *   - **The filename crossover.** The export names and the published names do not
 *     mean the same thing: `CV.pdf` is the photographed variant on the way out and
 *     the unphotographed one once published. A copy by name puts the photographed
 *     CV behind the primary download. `hasPhoto` is checked by counting embedded
 *     images, so the check is on content rather than on the name.
 *   - **A stale version segment.** `deploy.sh` caches non-HTML for a year, so a
 *     re-export published to the previous path is invisible to every browser that
 *     already fetched one. Exactly one version directory may exist, and it must be
 *     the one the manifest names.
 *
 * Sizes and page counts are asserted rather than hand-maintained; they were
 * correct-by-luck through one re-export already.
 *
 * Pure Node on purpose — no poppler, so it runs in CI.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = "src/lib/cv.ts";

const { CV_VERSION, CV_PUBLIC_DIR, CV_FILES } = await import(
  pathToFileURL(join(ROOT, MANIFEST)).href
);
const problems = [];

const cvRoot = join(ROOT, "public/cv");
const versions = existsSync(cvRoot)
  ? readdirSync(cvRoot).filter((e) => statSync(join(cvRoot, e)).isDirectory())
  : [];

if (!versions.includes(CV_VERSION)) {
  problems.push(
    `public/cv/${CV_VERSION} does not exist (found: ${versions.join(", ") || "nothing"})`
  );
}
for (const stray of versions.filter((v) => v !== CV_VERSION)) {
  problems.push(
    `public/cv/${stray} is still published — a superseded CV stays downloadable at a guessable URL`
  );
}

const dir = join(ROOT, CV_PUBLIC_DIR);
if (existsSync(dir)) {
  const declared = new Set(CV_FILES.map((f) => f.filename));
  for (const entry of readdirSync(dir)) {
    if (!declared.has(entry)) {
      problems.push(
        `${CV_PUBLIC_DIR}/${entry} is published but not in ${MANIFEST}`
      );
    }
  }

  for (const file of CV_FILES) {
    const path = join(dir, file.filename);
    if (!existsSync(path)) {
      problems.push(
        `${CV_PUBLIC_DIR}/${file.filename} is declared but missing`
      );
      continue;
    }
    const raw = readFileSync(path);

    const size = `${Math.round(raw.length / 1024)} KB`;
    if (size !== file.size) {
      problems.push(
        `${file.filename}: ${MANIFEST} says ${file.size}, file is ${size} (${raw.length} bytes)`
      );
    }

    const pages = (raw.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || [])
      .length;
    if (pages !== file.pages) {
      problems.push(
        `${file.filename}: ${MANIFEST} says ${file.pages} pages, file has ${pages}`
      );
    }

    const images = (raw.toString("latin1").match(/\/Subtype\s*\/Image/g) || [])
      .length;
    const hasPhoto = images > 0;
    if (hasPhoto !== file.hasPhoto) {
      problems.push(
        `${file.filename}: ${MANIFEST} says hasPhoto ${file.hasPhoto}, file embeds ${images} image(s)` +
          (hasPhoto
            ? " — the export filenames cross over, check which file this is"
            : "")
      );
    }
  }
}

if (problems.length) {
  console.error("✗ cv check failed\n");
  for (const p of problems) console.error("  " + p);
  console.error(
    `\n  ${MANIFEST} is the single declaration; verify a re-export by content, not by name.`
  );
  process.exit(1);
}

console.log("✓ cv");
console.log(`  public/cv/${CV_VERSION} is the only published version`);
console.log(
  `  ${CV_FILES.length} files match ${MANIFEST} on size, page count and photo`
);
