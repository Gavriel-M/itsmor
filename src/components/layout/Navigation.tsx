"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import AnimatedLogoFrame from "@/components/ui/AnimatedLogoFrame";

const navItems = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  console.log("🚀 ~ navItems:", navItems)
  console.log("🚀 ~ Navigation ~ pathname:", pathname)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-8 flex justify-between items-start pointer-events-none">
      {/* Logo Area */}
      <div className="pointer-events-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo className="w-8 h-8 md:w-10 md:h-10 text-text group-hover:text-terracotta transition-colors duration-300" />
          <span className="font-sans font-bold text-lg md:text-xl tracking-tight text-text group-hover:text-terracotta transition-colors duration-300">
            itsmor
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-6 md:gap-8 pointer-events-auto mix-blend-difference">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={`font-sans font-bold text-sm md:text-base tracking-tight hover:text-terracotta transition-colors uppercase`}
            >
              {item.label}
            </Link>
            {pathname === item.href && <span className="block w-full h-1 bg-terracotta"/>}
          </li>
        ))}
      </ul>
    </nav>
  );
}
