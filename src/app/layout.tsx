import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import GridBackground from "@/components/layout/GridBackground";
import Navigation from "@/components/layout/Navigation";
import PageTransition from "@/components/layout/PageTransition";
import { ScrollNavigationLoader } from "@/components/layout/ScrollNavigationLoader";
import { NavigationProvider } from "@/contexts/NavigationContext";
import { DESCRIPTION, NAME, SITE_URL, TITLE, TITLE_TEMPLATE } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  // Child routes set a bare title ("Work"); the template keeps the name on
  // every tab and every search result without repeating it in each route.
  title: { default: TITLE, template: TITLE_TEMPLATE },
  description: DESCRIPTION,
  applicationName: "itsmor",
  authors: [{ name: NAME, url: SITE_URL }],
  creator: NAME,
  // "./" resolves against the current route rather than pinning every page's
  // canonical to the homepage, which is what a literal "/" here would do.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "itsmor",
    title: TITLE,
    description: DESCRIPTION,
    // "./" for the same reason as the canonical: a literal SITE_URL here
    // makes every page claim og:url of the homepage, so a pasted /work link
    // previews as the homepage.
    url: "./",
    locale: "en_US",
    // No `images` key on purpose: src/app/opengraph-image.png is picked up by
    // Next's file convention, which emits the absolute URL plus width, height
    // and type. Declaring images here would override that and drop them.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/itsmor-logo-full-split.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="itsmor-transition",r=sessionStorage.getItem(k);if(!r)return;var d=JSON.parse(r);if(Date.now()-d.timestamp>5000){sessionStorage.removeItem(k);return;}var t=d.targetPath==="/"?d.targetPath:d.targetPath.replace(/\\/+$/,"");var p=location.pathname==="/"?location.pathname:location.pathname.replace(/\\/+$/,"");if(t===p)document.documentElement.classList.add("transition-recovery");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased bg-background text-text selection:bg-terracotta selection:text-white relative">
        <NavigationProvider>
          <GridBackground />
          <Navigation />
          <ScrollNavigationLoader />
          <PageTransition>
            <main className="relative z-10">{children}</main>
          </PageTransition>
        </NavigationProvider>
      </body>
    </html>
  );
}
