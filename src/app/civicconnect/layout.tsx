import type { Metadata } from "next";
import "./civicconnect.css";
import "./service-expansion.css";

export const metadata: Metadata = {
  title: "CivicConnect | City services made simpler",
  description: "A fictional and accessible city services experience created as a public portfolio project.",
};

export default function CivicConnectLayout({ children }: LayoutProps<"/civicconnect">) {
  return <div className="civicApp">{children}</div>;
}
