import Link from "next/link";
import { RecoveryCenterFinder } from "./recovery-center-finder";

export default function RecoveryCentersPage() {
  return <><a className="reliefSkip" href="#recoveryMain">Skip to recovery center search</a><header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator">Dashboard</Link><Link href="/disaster-resource-coordinator/shelters">Shelters</Link><Link href="/disaster-resource-coordinator/declarations">Declarations</Link></nav><Link href="/">Portfolio</Link></header><main id="recoveryMain"><RecoveryCenterFinder /><section className="sourceBand"><p>Recovery center information comes from FEMA’s active Disaster Recovery Center service.</p><Link href="/disaster-resource-coordinator">Return to ReliefReady →</Link></section></main></>;
}
