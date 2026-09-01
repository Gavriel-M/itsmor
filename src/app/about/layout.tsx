import { routeMetadata } from "@/lib/site";

/**
 * page.tsx is a client component, so it cannot export metadata. A route layout
 * can. Without this the route inherits the root title and the social card
 * claims to be the homepage.
 */
export const metadata = routeMetadata({ title: "About" });

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
