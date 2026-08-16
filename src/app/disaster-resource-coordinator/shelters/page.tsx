import Link from "next/link";
import { ShelterFinder } from "./shelter-finder";

export default function SheltersPage() {
  return <>
    <a className="reliefSkip" href="#shelterMain">Skip to shelter search</a>
    <header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator">Dashboard</Link><a href="#shelterSearch">Shelter search</a></nav><Link href="/">Portfolio</Link></header>
    <main id="shelterMain"><div id="shelterSearch"><ShelterFinder /></div><section className="sourceBand"><p>Shelter information comes from the official FEMA Emergency Support Function 6 shelter system.</p><Link href="/disaster-resource-coordinator">Return to ReliefReady →</Link></section></main>
  </>;
}
