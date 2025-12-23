import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import GridBackground from "@/components/layout/GridBackground";
import Navigation from "@/components/layout/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "itsmor | Digital Bauhaus Portfolio",
  description: "A high-performance portfolio website.",
  icons: {
    icon: "/itsmor-logo-full-split.svg",
    shortcut: "/itsmor-logo-full-split.svg",
    apple: "/itsmor-logo-full-split.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="antialiased bg-background text-text selection:bg-terracotta selection:text-white relative">
        <GridBackground />
        <Navigation />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
