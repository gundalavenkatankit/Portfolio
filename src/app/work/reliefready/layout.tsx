import type { Metadata } from "next";
import "../civicconnect/case-study.css";
import "./relief-case-study.css";

export const metadata: Metadata = {
  title: "ReliefReady Case Study",
  description: "A product design and full stack engineering case study for an accessible disaster resource coordinator powered by official public data.",
  alternates: { canonical: "/work/reliefready" },
  openGraph: {
    title: "ReliefReady Case Study",
    description: "See the research, data architecture, safety decisions, testing, and implementation behind ReliefReady.",
    url: "/work/reliefready",
  },
};

export default function ReliefReadyCaseStudyLayout({ children }: LayoutProps<"/work/reliefready">) {
  return <div className="caseStudy reliefCase">{children}</div>;
}
