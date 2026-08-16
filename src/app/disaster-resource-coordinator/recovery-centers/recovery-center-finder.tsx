"use client";

import { FormEvent, useState } from "react";

type Center = { id: number; disasterNumber: number; name: string; type: string; address: string; city: string; county: string; state: string; postalCode: string; status: string; notes: string | null; schedule: { day: string; open: string; close: string }[]; lastReportedAt: string | null; directionsUrl: string; distanceMiles?: number };

const areas = "AL Alabama,AK Alaska,AZ Arizona,AR Arkansas,CA California,CO Colorado,CT Connecticut,DE Delaware,DC District_of_Columbia,FL Florida,GA Georgia,HI Hawaii,ID Idaho,IL Illinois,IN Indiana,IA Iowa,KS Kansas,KY Kentucky,LA Louisiana,ME Maine,MD Maryland,MA Massachusetts,MI Michigan,MN Minnesota,MS Mississippi,MO Missouri,MT Montana,NE Nebraska,NV Nevada,NH New_Hampshire,NJ New_Jersey,NM New_Mexico,NY New_York,NC North_Carolina,ND North_Dakota,OH Ohio,OK Oklahoma,OR Oregon,PA Pennsylvania,RI Rhode_Island,SC South_Carolina,SD South_Dakota,TN Tennessee,TX Texas,UT Utah,VT Vermont,VA Virginia,WA Washington,WV West_Virginia,WI Wisconsin,WY Wyoming,PR Puerto_Rico,VI U.S._Virgin_Islands,GU Guam,AS American_Samoa,MP Northern_Mariana_Islands".split(",").map(item => { const [code, name] = item.split(" "); return { code, name: name.replaceAll("_", " ") }; });

export function RecoveryCenterFinder() {
  const [area, setArea] = useState("TX");
  const [query, setQuery] = useState("");
  const [centers, setCenters] = useState<Center[]>([]);
  const [status, setStatus] = useState("Choose a state to check active FEMA recovery centers.");
  const [loading, setLoading] = useState(false);

  async function search(event: FormEvent<HTMLFormElement>, nearest = false) {
    event.preventDefault();
    setLoading(true);
    setStatus(nearest ? "Finding the nearest active recovery centers." : "Checking active FEMA recovery centers.");
    try {
      const location = nearest && query.trim() ? `&location=${encodeURIComponent(query)}` : "";
      const response = await fetch(`/api/disaster-recovery-centers?area=${area}${location}`);
      const data = await response.json() as { centers?: Center[]; unavailable?: boolean; searchedLocation?: string | null };
      const nextCenters = data.centers ?? [];
      setCenters(nextCenters);
      setStatus(data.unavailable ? "FEMA recovery center information is temporarily unavailable." : nearest && !data.searchedLocation ? `We could not locate ${query}. Check the city or postal code and try again.` : nextCenters.length ? nearest ? `Showing ${nextCenters.length} active centers nearest to ${query}.` : `${nextCenters.length} active recovery centers found.` : "No active FEMA recovery centers were found for this state.");
    } catch {
      setCenters([]);
      setStatus("FEMA recovery center information is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="recoverySection"><div className="reliefSectionIntro"><div><p className="reliefEyebrow">FEMA recovery support</p><h1>Find recovery centers</h1></div><form onSubmit={event => search(event)}><label htmlFor="recoveryArea">State or territory</label><select id="recoveryArea" value={area} onChange={event => setArea(event.target.value)}>{areas.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select><button disabled={loading}>{loading ? "Checking centers" : "Find centers"}</button></form></div><div className="recoveryNotice"><strong>Recovery centers are not emergency shelters</strong><p>Visit a recovery center for application help and recovery guidance. Call 911 for immediate danger.</p></div><p className="alertStatus" role="status">{status}</p><form className="shelterFilter" onSubmit={event => search(event, true)}><label htmlFor="recoveryLocation">City or postal code</label><div><input id="recoveryLocation" value={query} onChange={event => setQuery(event.target.value)} placeholder="For example, Phoenix or 85001" /><button disabled={loading || !query.trim()}>{loading ? "Searching" : "Find nearest"}</button></div></form>{centers.length ? <div className="recoveryList">{centers.map(center => <article key={center.id}><div className="recoveryHeading"><span>{center.status}</span><small>{center.distanceMiles !== undefined ? `${center.distanceMiles} miles away` : `FEMA disaster ${center.disasterNumber}`}</small></div><h2>{center.name}</h2><p>{center.address}</p><dl><dt>Center type</dt><dd>{center.type}</dd><dt>County</dt><dd>{center.county}</dd><dt>Hours</dt><dd>{center.schedule.length ? center.schedule.map(item => `${item.day} ${item.open} to ${item.close}`).join(", ") : "Check the official locator"}</dd></dl>{center.notes && <p className="recoveryNotes">{center.notes}</p>}<div className="recoveryActions"><a href={center.directionsUrl} target="_blank" rel="noreferrer">Directions →</a><a href="https://egateway.fema.gov/ESF6/DRCLocator" target="_blank" rel="noreferrer">Official center information →</a></div></article>)}</div> : <div className="emptyAlerts"><span aria-hidden="true">i</span><div><strong>No recovery centers displayed</strong><p>Search a state or use FEMA’s official locator for the latest information.</p></div><a href="https://egateway.fema.gov/ESF6/DRCLocator" target="_blank" rel="noreferrer">Official DRC Locator →</a></div>}</section>;
}
