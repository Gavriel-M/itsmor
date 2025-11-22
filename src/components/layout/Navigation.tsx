import Link from "next/link";

const navItems = [
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact" },
];

export default function Navigation() {
  return (
    <nav className="fixed top-0 right-0 z-50 p-4 md:p-8 mix-blend-difference">
      <ul className="flex gap-6 md:gap-8">
        {navItems.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="font-sans font-bold text-sm md:text-base tracking-tight hover:text-terracotta transition-colors uppercase"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
