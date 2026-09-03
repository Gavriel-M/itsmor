"use client";

import { isExternalHref, newTabProps } from "@/lib/links";
import TransitionLink from "@/components/ui/TransitionLink";

const SIZES = {
  sm: "text-xs px-3 py-2",
  md: "text-sm px-4 py-2",
} as const;

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
}

export default function LinkButton({
  href,
  children,
  size = "sm",
  className = "",
}: LinkButtonProps) {
  const classes = `inline-block font-mono uppercase tracking-widest border border-text/15 hover:bg-text hover:text-background focus-visible:bg-text focus-visible:text-background transition-colors duration-300 ${SIZES[size]} ${className}`;

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes} {...newTabProps(href)}>
        {children}
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={classes}>
      {children}
    </TransitionLink>
  );
}
