import { routeMetadata } from "@/lib/site";

/**
 * page.tsx is a client component, so it cannot export metadata. A route layout
 * can. Without this the route inherits the root title and the social card
 * claims to be the homepage.
 */
export const metadata = routeMetadata({ title: "Contact" });

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
