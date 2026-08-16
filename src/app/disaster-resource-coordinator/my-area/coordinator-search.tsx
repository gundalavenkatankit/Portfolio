"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Location = { label: string; latitude: number; longitude: number; stateCode: string; postalCode: string | null };
type Alert = { id: string; event: string; headline: string; severity: string; urgency: string; area: string; instruction: string; url: string };
type Shelter = { id: number; name: string; city: string; state: string; status: string; distanceMiles?: number; directionsUrl: string };
type Declaration = { disasterNumber: number; declarationCode: string; title: string; incidentType: string; declarationDate: string; designatedAreas: string[]; individualAssistance: boolean; publicAssistance: boolean; hazardMitigation: boolean; sourceUrl: string };
type Center = { id: number; name: string; city: string; state: string; status: string; distanceMiles?: number; directionsUrl: string };
type Results = { location: Location; alerts: Alert[]; shelters: Shelter[]; declarations: Declaration[]; centers: Center[] };

export function CoordinatorSearch() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Enter a United States city or postal code to coordinate official resources.");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);

  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setStatus("Locating your area and checking official resources.");
    setResults(null);
    try {
      const locationResponse = await fetch(`/api/disaster-location?query=${encodeURIComponent(query)}`);
      const locationData = await locationResponse.json() as { location?: Location | null };
      const location = locationData.location;
      if (!location?.stateCode) {
        setStatus(`We could not identify the state for ${query}. Try a postal code or include the state abbreviation.`);
        return;
      }
      const locationParameters = `area=${location.stateCode}&location=${encodeURIComponent(query)}&latitude=${location.latitude}&longitude=${location.longitude}`;
      const [alertsResponse, sheltersResponse, declarationsResponse, centersResponse] = await Promise.all([
        fetch(`/api/disaster-alerts?area=${location.stateCode}`),
        fetch(`/api/disaster-shelters?${locationParameters}`),
        fetch(`/api/disaster-declarations?area=${location.stateCode}`),
        fetch(`/api/disaster-recovery-centers?${locationParameters}`),
      ]);
      const [alertsData, sheltersData, declarationsData, centersData] = await Promise.all([alertsResponse.json(), sheltersResponse.json(), declarationsResponse.json(), centersResponse.json()]);
      setResults({ location, alerts: alertsData.alerts ?? [], shelters: sheltersData.shelters ?? [], declarations: declarationsData.declarations ?? [], centers: centersData.centers ?? [] });
      setStatus(`Official resource summary for ${query} is ready.`);
    } catch {
      setStatus("One or more official services are temporarily unavailable. Try again or use the direct official links below.");
    } finally {
      setLoading(false);
    }
  }

  const urgentAlert = results?.alerts.find(alert => alert.severity === "Extreme" || alert.severity === "Severe");

  return <section className="coordinatorSection"><div className="coordinatorHero"><p className="reliefEyebrow">One location, coordinated resources</p><h1>What is happening near you?</h1><p>Check official alerts, shelter options, federal declarations, and recovery support with one search.</p><form onSubmit={search}><label htmlFor="coordinatorLocation">City or postal code</label><div><input id="coordinatorLocation" value={query} onChange={event => setQuery(event.target.value)} placeholder="For example, Seattle, WA or 98121" /><button disabled={loading || !query.trim()}>{loading ? "Coordinating resources" : "Check my area"}</button></div></form><p className="alertStatus" role="status">{status}</p></div>{results && <><section className="situationSummary"><div><span>Area identified</span><strong>{results.location.label}</strong></div><div><span>Active alerts</span><strong>{results.alerts.length}</strong></div><div><span>Shelter records</span><strong>{results.shelters.length}</strong></div><div><span>Recovery centers</span><strong>{results.centers.length}</strong></div></section><section className="coordinatorActions"><p className="reliefEyebrow">Start here</p><h2>Recommended next steps</h2><ol>{urgentAlert ? <li><strong>Review the {urgentAlert.event} alert.</strong><span>{urgentAlert.instruction}</span></li> : <li><strong>No severe or extreme weather alert is displayed.</strong><span>Continue monitoring official local information because conditions can change.</span></li>}<li><strong>Verify before traveling.</strong><span>Call or confirm shelter and recovery center status before leaving.</span></li><li><strong>Follow local authorities.</strong><span>This coordinator does not replace 911 or evacuation instructions.</span></li></ol></section><div className="coordinatorGrid"><section><div className="coordinatorSectionHeading"><div><span>01</span><h2>Active alerts</h2></div><Link href="/disaster-resource-coordinator#alerts">Full alert search →</Link></div>{results.alerts.length ? results.alerts.slice(0, 3).map(alert => <article key={alert.id}><strong>{alert.event}</strong><p>{alert.headline}</p><a href={alert.url} target="_blank" rel="noreferrer">Official alert →</a></article>) : <p className="coordinatorEmpty">No active National Weather Service alerts were returned.</p>}</section><section><div className="coordinatorSectionHeading"><div><span>02</span><h2>Nearest shelters</h2></div><Link href="/disaster-resource-coordinator/shelters">Shelter Finder →</Link></div>{results.shelters.length ? results.shelters.slice(0, 3).map(shelter => <article key={shelter.id}><strong>{shelter.name}</strong><p>{shelter.city}, {shelter.state}{shelter.distanceMiles !== undefined ? ` · ${shelter.distanceMiles} miles away` : ""}</p><Link href={`/disaster-resource-coordinator/shelters/${shelter.id}?area=${shelter.state}`}>Shelter details →</Link></article>) : <p className="coordinatorEmpty">No FEMA shelter records with coordinates were returned.</p>}</section><section><div className="coordinatorSectionHeading"><div><span>03</span><h2>Federal declarations</h2></div><Link href="/disaster-resource-coordinator/declarations">Declaration search →</Link></div>{results.declarations.length ? results.declarations.slice(0, 3).map(declaration => <article key={declaration.disasterNumber}><strong>{declaration.title}</strong><p>{declaration.declarationCode} · {declaration.incidentType} · {declaration.designatedAreas.length} designated areas</p><a href={declaration.sourceUrl} target="_blank" rel="noreferrer">Official declaration →</a></article>) : <p className="coordinatorEmpty">No recent OpenFEMA declarations were returned.</p>}</section><section><div className="coordinatorSectionHeading"><div><span>04</span><h2>Recovery centers</h2></div><Link href="/disaster-resource-coordinator/recovery-centers">Recovery Center Finder →</Link></div>{results.centers.length ? results.centers.slice(0, 3).map(center => <article key={center.id}><strong>{center.name}</strong><p>{center.city}, {center.state}{center.distanceMiles !== undefined ? ` · ${center.distanceMiles} miles away` : ""}</p><a href={center.directionsUrl} target="_blank" rel="noreferrer">Directions →</a></article>) : <p className="coordinatorEmpty">No active FEMA recovery centers were returned for this state.</p>}</section></div></>}</section>;
}
