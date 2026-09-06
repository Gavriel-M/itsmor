/**
 * Plain anchors, not LinkButton: `/cv/…pdf` is not an external href, so that
 * component renders a TransitionLink and the client router tries to navigate to
 * a PDF.
 *
 * Paths carry a version segment because deploy.sh caches non-HTML assets for a
 * year. Re-uploading a corrected CV to the same path leaves the old one in every
 * browser that already fetched it, and a CloudFront invalidation clears the edge
 * rather than the client. The `download` attribute keeps the saved filename
 * canonical whatever the path says.
 */
const VERSION = "2026-09";
const base = (name: string) => `/cv/${VERSION}/${name}`;

const PRIMARY = {
  href: base("Gavriel-Mor-Full-Stack-Engineer-CV.pdf"),
  filename: "Gavriel-Mor-Full-Stack-Engineer-CV.pdf",
  meta: "A4 · 2 pp · 194 KB",
};

const ALTERNATES = [
  {
    href: base("Gavriel-Mor-Full-Stack-Engineer-CV-Photo.pdf"),
    filename: "Gavriel-Mor-Full-Stack-Engineer-CV-Photo.pdf",
    what: "With a photo",
    why: "The German convention",
    size: "209 KB",
  },
  {
    href: base("Gavriel-Mor-Full-Stack-Engineer-CV-Plain.pdf"),
    filename: "Gavriel-Mor-Full-Stack-Engineer-CV-Plain.pdf",
    what: "Single column, plain",
    why: "For CV parsers and application portals",
    size: "186 KB",
  },
];

export default function CvDownloads() {
  return (
    <div className="border border-black/10">
      <p className="flex justify-between font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#6e6a5c] px-4 py-3 border-b border-black/10">
        <span>Download</span>
        <span>PDF</span>
      </p>

      <div className="p-4">
        {/*
          The focus ring is the global 2px terracotta at 3px offset, which lands
          on cream beside this fill rather than on it. Do not zero that offset.
        */}
        <a
          href={PRIMARY.href}
          download={PRIMARY.filename}
          className="flex items-baseline justify-between gap-4 bg-terracotta text-white px-4 py-3.5 font-mono text-[0.82rem] font-semibold uppercase tracking-[0.1em] hover:bg-text focus-visible:bg-text transition-colors duration-300"
        >
          <span>Download CV</span>
          <span className="font-normal text-[0.62rem] tracking-[0.06em]">
            {PRIMARY.meta}
          </span>
        </a>

        <p className="font-mono text-[0.66rem] leading-relaxed text-[#575347] mt-3.5 mb-3 pb-3 border-b border-black/10">
          Same text in all three. Only the layout differs.
        </p>

        <ul className="flex flex-col gap-0.5">
          {ALTERNATES.map((alt) => (
            <li key={alt.filename}>
              <a
                href={alt.href}
                download={alt.filename}
                className="group grid grid-cols-[1fr_auto] items-baseline gap-3 py-2.5"
              >
                <span className="text-[0.86rem] font-semibold underline decoration-black/35 underline-offset-4 group-hover:text-lapis group-hover:decoration-lapis group-focus-visible:text-lapis">
                  {alt.what}
                </span>
                <span className="font-mono text-[0.62rem] whitespace-nowrap text-[#6e6a5c]">
                  {alt.size}
                </span>
                <span className="col-span-2 font-mono text-[0.64rem] tracking-[0.02em] text-[#6e6a5c] mt-0.5">
                  {alt.why}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
