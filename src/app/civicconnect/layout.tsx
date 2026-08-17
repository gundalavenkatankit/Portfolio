import type { Metadata } from "next";
import "./civicconnect.css";
import "./service-expansion.css";

export const metadata: Metadata = {
  title: "CivicConnect",
  description: "A fictional and accessible city services experience created as a public portfolio project.",
  alternates: { canonical: "/civicconnect" },
  openGraph: {
    title: "CivicConnect | Accessible City Services",
    description: "Explore a working city services experience with accessible discovery, applications, issue reporting, and request tracking.",
    url: "/civicconnect",
  },
};

export default function CivicConnectLayout({ children }: LayoutProps<"/civicconnect">) {
  return <div className="civicApp">{children}</div>;
}
