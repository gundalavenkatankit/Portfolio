import Link from "next/link";
import { DeclarationFinder } from "./declaration-finder";

export default function DeclarationsPage() {
  return <><a className="reliefSkip" href="#declarationMain">Skip to declaration search</a><header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator">Dashboard</Link><Link href="/disaster-resource-coordinator/shelters">Shelters</Link></nav><Link href="/">Portfolio</Link></header><main id="declarationMain"><DeclarationFinder /><section className="sourceBand"><p>Declaration information comes from the official OpenFEMA Disaster Declarations Summaries dataset.</p><Link href="/disaster-resource-coordinator">Return to ReliefReady →</Link></section></main></>;
}
