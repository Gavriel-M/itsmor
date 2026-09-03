import { routeMetadata } from "@/lib/site";

export const metadata = routeMetadata({ title: "Work", nested: true });

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
