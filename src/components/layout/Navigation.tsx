"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import TransitionLink from "@/components/ui/TransitionLink";

const navItems = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-between pointer-events-none items-center">
      <div
        className="absolute top-0 left-0 right-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          height: "200px",
          background: `
            radial-gradient(ellipse 35vw 110px at 0% 0%, #f2f0e6c0 60%, transparent 100%),
            radial-gradient(ellipse 60vw 110px at 100% 0%, #f2f0e6c0 60%, transparent 100%)
          `,
        }}
      />
      <div className="relative z-10 pointer-events-auto">
        <TransitionLink href="/" className="flex items-center gap-2 group">
          <Logo
            className={`w-8 h-8 md:w-10 md:h-10 group-hover:text-terracotta transition-colors duration-300 text-text`}
          />
          <span
            className={`font-sans font-bold text-lg md:text-xl tracking-tight group-hover:text-terracotta transition-colors duration-300 text-text`}
          >
            itsmor
          </span>
        </TransitionLink>
      </div>

      <ul className="relative z-10 flex gap-6 md:gap-8 pointer-events-auto">
        {navItems.map((item) => (
          <li key={item.label}>
            <TransitionLink
              href={item.href}
              className={`font-sans font-bold text-sm md:text-base tracking-tight hover:text-terracotta focus-visible:text-terracotta transition-colors uppercase`}
            >
              {item.label}
            </TransitionLink>
            {pathname === item.href && (
              <span className="block w-full h-1 bg-terracotta" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
