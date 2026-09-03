import { routeMetadata } from "@/lib/site";

export const metadata = routeMetadata({ title: "About" });

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
