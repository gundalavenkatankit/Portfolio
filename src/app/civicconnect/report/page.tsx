import { CivicFooter, CivicHeader } from "../components";
import { IssueReport } from "./issue-report";

export default function ReportPage() {
  return <><CivicHeader /><main id="civicMain"><IssueReport /></main><CivicFooter /></>;
}
