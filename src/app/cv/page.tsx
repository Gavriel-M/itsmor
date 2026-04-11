"use client";

import { motion } from "framer-motion";

const PDF_PATH = "/gavriel-mor-cv.pdf";

export default function CvPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20 flex flex-col">
      <div className="max-w-screen-xl mx-auto w-full flex-grow flex flex-col">
        <div className="flex items-end justify-between mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-default font-sans font-bold text-6xl md:text-8xl tracking-tighter text-text"
          >
            CV
          </motion.h1>

          <motion.a
            href={PDF_PATH}
            download
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-sm uppercase tracking-widest border border-black/10 px-4 py-2 hover:bg-black hover:text-white transition-all duration-300"
          >
            Download PDF
          </motion.a>
        </div>

        {/* PDF embed — desktop browsers render inline, mobile gets fallback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-grow min-h-[70vh] border border-black/10"
        >
          <object
            data={PDF_PATH}
            type="application/pdf"
            className="w-full h-full min-h-[70vh]"
          >
            <div className="w-full h-full min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
              <p className="font-mono text-sm uppercase tracking-widest opacity-50 text-center">
                PDF preview is not available on this device
              </p>
              <a
                href={PDF_PATH}
                download
                className="font-mono text-sm uppercase tracking-widest border border-terracotta text-terracotta px-6 py-3 hover:bg-terracotta hover:text-white transition-all duration-300"
              >
                Download CV
              </a>
            </div>
          </object>
        </motion.div>
      </div>
    </section>
  );
}
