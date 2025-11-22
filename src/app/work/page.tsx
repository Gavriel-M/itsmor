"use client";

import ProjectCard from "@/components/work/ProjectCard";

const projects = [
  {
    title: "Neon Genesis",
    category: "Web Development",
    year: "2025",
    href: "/work/neon-genesis",
  },
  {
    title: "Type Foundry",
    category: "Brand Identity",
    year: "2023",
    href: "/work/type-foundry",
  },
  {
    title: "Archive 01",
    category: "Editorial Design",
    year: "2023",
    href: "/work/archive-01",
  },
  {
    title: "Mono System",
    category: "UI/UX Design",
    year: "2022",
    href: "/work/mono-system",
  },
  {
    title: "Flux Engine",
    category: "Creative Coding",
    year: "2022",
    href: "/work/flux-engine",
  },
];

export default function WorkPage() {
  return (
    <section className="min-h-screen w-full pt-32 md:pt-48 px-4 md:px-8 pb-20">
      <div className="max-w-screen-xl mx-auto">
        <header className="mb-20 md:mb-32">
          <h1 className="font-sans font-bold text-6xl md:text-8xl mb-6 tracking-tighter text-text">
            SELECTED <br className="hidden md:block" />
            <span className="text-terracotta">WORK</span>
          </h1>
          <p className="font-mono text-sm md:text-base max-w-md leading-relaxed opacity-80">
            A collection of digital artifacts, web experiences, and brand
            systems designed with precision and purpose.
          </p>
        </header>

        <div className="flex flex-col">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
