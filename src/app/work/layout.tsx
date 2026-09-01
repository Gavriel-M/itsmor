import { routeMetadata } from "@/lib/site";

/**
 * page.tsx is a client component, so it cannot export metadata. A route layout
 * can. `nested` because /work/2d-web-animation sits underneath and needs the
 * title template.
 */
export const metadata = routeMetadata({ title: "Work", nested: true });

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
