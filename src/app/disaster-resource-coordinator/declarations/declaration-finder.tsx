"use client";

import { FormEvent, useState } from "react";

type Declaration = { disasterNumber: number; declarationCode: string; title: string; declarationType: string; declarationDate: string; incidentType: string; incidentBeginDate: string | null; incidentEndDate: string | null; designatedAreas: string[]; individualAssistance: boolean; publicAssistance: boolean; hazardMitigation: boolean; filingDeadline: string | null; lastRefresh: string; sourceUrl: string };

const areas = [{ code: "CA", name: "California" }, { code: "FL", name: "Florida" }, { code: "NY", name: "New York" }, { code: "TX", name: "Texas" }, { code: "WA", name: "Washington" }];
const declarationTypes: Record<string, string> = { DR: "Major disaster", EM: "Emergency", FM: "Fire management" };
const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value)) : "Ongoing or not reported";

export function DeclarationFinder() {
  const [area, setArea] = useState("TX");
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [status, setStatus] = useState("Choose a state to check recent federal disaster declarations.");
  const [loading, setLoading] = useState(false);

  async function loadDeclarations(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Checking official OpenFEMA records.");
    try {
      const response = await fetch(`/api/disaster-declarations?area=${area}`);
      const data = await response.json() as { declarations?: Declaration[]; unavailable?: boolean };
      const nextDeclarations = data.declarations ?? [];
      setDeclarations(nextDeclarations);
      setStatus(data.unavailable ? "OpenFEMA declarations are temporarily unavailable." : nextDeclarations.length ? `Showing ${nextDeclarations.length} recent federal declarations.` : "No recent federal declarations were found for this state.");
    } catch {
      setDeclarations([]);
      setStatus("OpenFEMA declarations are temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="declarationSection"><div className="reliefSectionIntro"><div><p className="reliefEyebrow">Official federal status</p><h1>Disaster declarations</h1></div><form onSubmit={loadDeclarations}><label htmlFor="declarationArea">State</label><select id="declarationArea" value={area} onChange={event => setArea(event.target.value)}>{areas.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select><button disabled={loading}>{loading ? "Checking records" : "Check declarations"}</button></form></div><div className="declarationNotice"><strong>A declaration is not an immediate warning</strong><p>Use current alerts and instructions from local authorities for urgent safety decisions.</p></div><p className="alertStatus" role="status">{status}</p>{declarations.length ? <div className="declarationList">{declarations.map(declaration => <article key={declaration.disasterNumber}><div className="declarationHeading"><span>{declarationTypes[declaration.declarationType] ?? declaration.declarationType}</span><small>{declaration.declarationCode}</small></div><h2>{declaration.title.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase())}</h2><p>{declaration.incidentType} affecting {declaration.designatedAreas.length} designated areas.</p><dl><dt>Declared</dt><dd>{formatDate(declaration.declarationDate)}</dd><dt>Incident began</dt><dd>{formatDate(declaration.incidentBeginDate)}</dd><dt>Incident ended</dt><dd>{formatDate(declaration.incidentEndDate)}</dd><dt>Areas</dt><dd>{declaration.designatedAreas.slice(0, 8).join(", ")}{declaration.designatedAreas.length > 8 ? ` and ${declaration.designatedAreas.length - 8} more` : ""}</dd></dl><div className="assistanceTags" aria-label="Declared assistance programs"><span className={declaration.individualAssistance ? "available" : "unavailable"}>Individual assistance {declaration.individualAssistance ? "available" : "not declared"}</span><span className={declaration.publicAssistance ? "available" : "unavailable"}>Public assistance {declaration.publicAssistance ? "available" : "not declared"}</span><span className={declaration.hazardMitigation ? "available" : "unavailable"}>Hazard mitigation {declaration.hazardMitigation ? "available" : "not declared"}</span></div><a href={declaration.sourceUrl} target="_blank" rel="noreferrer">View official FEMA declaration →</a></article>)}</div> : <div className="emptyAlerts"><span aria-hidden="true">i</span><div><strong>No declarations displayed</strong><p>Choose a state and check the latest OpenFEMA records.</p></div><a href="https://www.fema.gov/disaster/declarations" target="_blank" rel="noreferrer">Official declarations →</a></div>}</section>;
}
