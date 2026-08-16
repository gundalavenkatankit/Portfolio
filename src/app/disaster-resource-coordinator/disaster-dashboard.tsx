"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Alert = { id: string; event: string; headline: string; severity: string; urgency: string; area: string; instruction: string; url: string; expires: string | null };

const areas = [{ code: "CA", name: "California" }, { code: "FL", name: "Florida" }, { code: "NY", name: "New York" }, { code: "TX", name: "Texas" }, { code: "WA", name: "Washington" }];
const resources = [
  { type: "Assistance", name: "FEMA disaster assistance", detail: "Learn about help available after a federally declared disaster.", url: "https://www.disasterassistance.gov/" },
  { type: "Preparation", name: "Ready.gov guidance", detail: "Prepare plans, supplies, and communication before an emergency.", url: "https://www.ready.gov/" },
  { type: "Local support", name: "Call 211", detail: "Connect with food, housing, health, and emergency community resources.", url: "https://www.211.org/" },
];
const previousShelterResource = { type: "Shelter", name: "Emergency shelter finder", detail: "Find open shelters through official disaster assistance resources.", url: "https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" };
const checklist = ["Confirm your evacuation route", "Charge phones and backup batteries", "Store water and essential medication", "Save local emergency numbers", "Check on neighbors who may need help"];

export function DisasterDashboard({ useShelterPage = true }: { useShelterPage?: boolean }) {
  const [area, setArea] = useState("TX");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState("Choose an area to check current official alerts.");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  async function loadAlerts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Checking the National Weather Service.");
    try {
      const response = await fetch(`/api/disaster-alerts?area=${area}`);
      const data = await response.json() as { alerts?: Alert[]; unavailable?: boolean };
      const nextAlerts = data.alerts ?? [];
      setAlerts(nextAlerts);
      setStatus(data.unavailable ? "Official alerts are temporarily unavailable. Use the direct National Weather Service link below." : nextAlerts.length ? `${nextAlerts.length} active alerts found.` : "No active National Weather Service alerts were found for this area.");
    } catch {
      setAlerts([]);
      setStatus("Official alerts are temporarily unavailable. Use the direct National Weather Service link below.");
    } finally {
      setLoading(false);
    }
  }

  function toggleItem(item: string) {
    setCompleted(current => current.includes(item) ? current.filter(value => value !== item) : [...current, item]);
  }

  return <>
    <a className="reliefSkip" href="#reliefMain">Skip to emergency resources</a>
    <header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation">{useShelterPage && <Link href="/disaster-resource-coordinator/my-area">My area</Link>}<a href="#alerts">Alerts</a>{useShelterPage && <Link href="/disaster-resource-coordinator/shelters">Shelters</Link>}<a href="#resources">Resources</a><a href="#prepare">Prepare</a></nav><Link href="/">Portfolio</Link></header>
    <main id="reliefMain">
      <section className="reliefHero"><div><p className="reliefEyebrow">Disaster resource coordinator</p><h1>Clear information when every minute matters.</h1><p>Check official weather alerts, find trusted assistance, and prepare practical next steps in one accessible place.</p><div className="dangerNotice"><strong>Call 911 for immediate danger</strong><span>This portfolio project does not replace instructions from emergency officials.</span></div></div><aside aria-label="Current area"><span>Selected area</span><strong>{areas.find(item => item.code === area)?.name}</strong><p>Official alert and shelter data is requested from United States government services.</p></aside></section>

      <section className="alertSection" id="alerts"><div className="reliefSectionIntro"><div><p className="reliefEyebrow">Official information</p><h2>Check active alerts</h2></div><form onSubmit={loadAlerts}><label htmlFor="alertArea">State</label><select id="alertArea" value={area} onChange={event => setArea(event.target.value)}>{areas.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select><button disabled={loading}>{loading ? "Checking alerts" : "Check alerts"}</button></form></div><p className="alertStatus" role="status">{status}</p>{alerts.length ? <div className="alertList">{alerts.map(alert => <article key={alert.id}><div><span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span><span>{alert.urgency} urgency</span></div><h3>{alert.event}</h3><p>{alert.headline}</p><dl><dt>Area</dt><dd>{alert.area}</dd><dt>Official guidance</dt><dd>{alert.instruction}</dd></dl><a href={alert.url} target="_blank" rel="noreferrer">View state alerts on Weather.gov →</a></article>)}</div> : <div className="emptyAlerts"><span aria-hidden="true">✓</span><div><strong>No alerts displayed</strong><p>Run a search above or check the official source directly.</p></div><a href={`https://www.weather.gov/alerts/${area.toLowerCase()}.html`} target="_blank" rel="noreferrer">National Weather Service →</a></div>}</section>

      <section className="resourceSection" id="resources"><div className="reliefSectionIntro"><div><p className="reliefEyebrow">Trusted assistance</p><h2>Find the right resource</h2></div><p>These links open official or nationally recognized emergency resources.</p></div><div className="resourceGrid">{useShelterPage && <><Link href="/disaster-resource-coordinator/my-area"><span>01 · Coordinator</span><h3>My area summary</h3><p>Enter one location to coordinate alerts, shelters, declarations, and recovery support.</p><strong>Check my area →</strong></Link><Link href="/disaster-resource-coordinator/shelters"><span>02 · Shelter</span><h3>Shelter Finder</h3><p>Search FEMA shelter records by state, city, postal code, or shelter name.</p><strong>Find shelters →</strong></Link><Link href="/disaster-resource-coordinator/declarations"><span>03 · Federal status</span><h3>Disaster declarations</h3><p>Check recent federal declarations, affected areas, and declared assistance programs.</p><strong>Check declarations →</strong></Link><Link href="/disaster-resource-coordinator/recovery-centers"><span>04 · Recovery</span><h3>Recovery center finder</h3><p>Find active FEMA centers for application help, case questions, and recovery guidance.</p><strong>Find recovery centers →</strong></Link></>}{(useShelterPage ? resources : [previousShelterResource, ...resources]).map((resource, index) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.name}><span>0{index + (useShelterPage ? 5 : 1)} · {resource.type}</span><h3>{resource.name}</h3><p>{resource.detail}</p><strong>Open resource →</strong></a>)}</div></section>

      <section className="prepareSection" id="prepare"><div><p className="reliefEyebrow">Personal readiness</p><h2>A small plan can make a difficult moment safer.</h2><p>Use this checklist as a starting point. Your selections remain only in this browser session.</p></div><div className="checklist"><div className="checkProgress"><strong>{completed.length} of {checklist.length}</strong><span>steps reviewed</span></div>{checklist.map(item => <label className={completed.includes(item) ? "complete" : ""} key={item}><input type="checkbox" checked={completed.includes(item)} onChange={() => toggleItem(item)} /><span>{item}</span></label>)}</div></section>
      <section className="sourceBand"><p>This experience prioritizes official information from the National Weather Service, FEMA, Ready.gov, and DisasterAssistance.gov.</p><Link href="/">Return to Ankit’s portfolio →</Link></section>
    </main>
  </>;
}
