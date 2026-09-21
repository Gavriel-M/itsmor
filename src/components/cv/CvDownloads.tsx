/**
 * Plain anchors, not LinkButton: `/cv/…pdf` is not an external href, so that
 * component renders a TransitionLink and the client router tries to navigate to
 * a PDF.
 *
 * Filenames, sizes, page counts and the version segment all come from
 * `@/lib/cv`, which `pnpm cv:check` verifies against the files on disk. The
 * `download` attribute keeps the saved filename canonical whatever the path says.
 */
import { CV_ALTERNATES, CV_PRIMARY, cvHref } from "@/lib/cv";

export default function CvDownloads() {
  return (
    <div className="border border-black/10">
      <p className="flex justify-between font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ink-3 px-4 py-3 border-b border-black/10">
        <span>Download</span>
        <span>PDF</span>
      </p>

      <div className="p-4">
        {/*
          The focus ring is the global 2px terracotta at 3px offset, which lands
          on cream beside this fill rather than on it. Do not zero that offset.
        */}
        <a
          href={cvHref(CV_PRIMARY.filename)}
          download={CV_PRIMARY.filename}
          className="flex items-baseline justify-between gap-4 bg-terracotta text-white px-4 py-3.5 font-mono text-[0.82rem] font-semibold uppercase tracking-[0.1em] hover:bg-text focus-visible:bg-text transition-colors duration-300"
        >
          <span>Download CV</span>
          <span className="font-normal text-[0.62rem] tracking-[0.06em]">
            {`A4 · ${CV_PRIMARY.pages} pp · ${CV_PRIMARY.size}`}
          </span>
        </a>

        <p className="font-mono text-[0.66rem] leading-relaxed text-ink-2 mt-3.5 mb-3 pb-3 border-b border-black/10">
          Same text in all three. Only the layout differs.
        </p>

        <ul className="flex flex-col gap-0.5">
          {CV_ALTERNATES.map((alt) => (
            <li key={alt.filename}>
              <a
                href={cvHref(alt.filename)}
                download={alt.filename}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-3 py-2"
              >
                <span className="text-[0.86rem] font-semibold underline decoration-black/35 underline-offset-4 group-hover:text-lapis group-hover:decoration-lapis group-focus-visible:text-lapis">
                  {alt.what}
                </span>
                <span className="font-mono text-[0.62rem] whitespace-nowrap text-ink-3">
                  {alt.size}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
