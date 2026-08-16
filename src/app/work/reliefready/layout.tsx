import type { Metadata } from "next";
import "../civicconnect/case-study.css";
import "./relief-case-study.css";

export const metadata: Metadata = {
  title: "ReliefReady Case Study | Venkat Ankit Gundala",
  description: "A product design and full stack engineering case study for an accessible disaster resource coordinator powered by official public data.",
};

export default function ReliefReadyCaseStudyLayout({ children }: LayoutProps<"/work/reliefready">) {
  return <div className="caseStudy reliefCase">{children}</div>;
}
