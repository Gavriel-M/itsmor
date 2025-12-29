"use client";

import Link from "next/link";
import { useNavigation } from "@/contexts/NavigationContext";
import { type ComponentProps, type MouseEvent } from "react";

type LinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: LinkProps) {
  const { navigate } = useNavigation();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (e.defaultPrevented) return;

    const hrefString = typeof href === "string" ? href : href.pathname || "/";

    if (hrefString.startsWith("http") || hrefString.startsWith("//")) {
      return;
    }

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    if (e.button !== 0) {
      return;
    }

    e.preventDefault();

    navigate(hrefString);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
