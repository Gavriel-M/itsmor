import Link from "next/link";
import GridBackground from "@/components/layout/GridBackground";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background text-text">
      <GridBackground />

      <div className="relative z-10 text-center">
        <div className="relative inline-block">
          <h1 className="font-sans font-bold text-[20vw] leading-none tracking-tighter text-terracotta mix-blend-multiply opacity-80">
            404
          </h1>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-2 bg-lapis rotate-12" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-2 bg-lapis -rotate-12" />
        </div>

        <p className="mt-8 font-mono text-sm md:text-base uppercase tracking-widest">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-12 inline-block px-8 py-3 border border-text hover:bg-text hover:text-background transition-colors duration-300 font-mono text-sm uppercase tracking-widest"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
