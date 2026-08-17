import type { Metadata } from "next";
import "./case-study.css";

export const metadata: Metadata = {
  title: "CivicConnect Case Study",
  description: "A product design and frontend engineering case study for an accessible fictional city services platform.",
  alternates: { canonical: "/work/civicconnect" },
  openGraph: {
    title: "CivicConnect Case Study",
    description: "See the product decisions, accessible journeys, testing process, and implementation behind CivicConnect.",
    url: "/work/civicconnect",
  },
};

export default function CivicConnectCaseStudyLayout({ children }: LayoutProps<"/work/civicconnect">) {
  return <div className="caseStudy">{children}</div>;
}
