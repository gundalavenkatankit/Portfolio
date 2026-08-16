import type { Metadata } from "next";
import "./case-study.css";

export const metadata: Metadata = {
  title: "CivicConnect Case Study | Venkat Ankit Gundala",
  description: "A product design and frontend engineering case study for an accessible fictional city services platform.",
};

export default function CivicConnectCaseStudyLayout({ children }: LayoutProps<"/work/civicconnect">) {
  return <div className="caseStudy">{children}</div>;
}
