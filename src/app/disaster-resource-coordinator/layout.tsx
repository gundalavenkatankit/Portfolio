import type { Metadata } from "next";
import "./relief.css";
import "./shelters.css";
import "./declarations.css";
import "./recovery-centers.css";
import "./my-area.css";

export const metadata: Metadata = {
  title: "ReliefReady | Disaster Resource Coordinator",
  description: "A public safety resource experience for finding official alerts, emergency guidance, and nearby support.",
};

export default function DisasterLayout({ children }: LayoutProps<"/disaster-resource-coordinator">) {
  return <div className="reliefApp">{children}</div>;
}
