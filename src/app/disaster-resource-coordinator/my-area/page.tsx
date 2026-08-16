import Link from "next/link";
import { CoordinatorSearch } from "./coordinator-search";

export default function MyAreaPage() {
  return <><a className="reliefSkip" href="#myAreaMain">Skip to location search</a><header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator">Dashboard</Link><Link href="/disaster-resource-coordinator/shelters">Shelters</Link><Link href="/disaster-resource-coordinator/declarations">Declarations</Link><Link href="/disaster-resource-coordinator/recovery-centers">Recovery</Link></nav><Link href="/">Portfolio</Link></header><main id="myAreaMain"><CoordinatorSearch /><section className="sourceBand"><p>Results combine official data from the National Weather Service, FEMA, and OpenFEMA.</p><Link href="/disaster-resource-coordinator">Return to ReliefReady →</Link></section></main></>;
}
