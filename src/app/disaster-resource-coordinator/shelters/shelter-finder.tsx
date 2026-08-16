"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";

type Shelter = { id: number; name: string; address: string; city: string; state: string; postalCode: string; status: string; wheelchairAccessible: string; adaCompliant: string; pets: string; generator: string; capacity: number | null; population?: number | null; phone?: string | null; directionsUrl: string; distanceMiles?: number };

const areas = [{ code: "CA", name: "California" }, { code: "FL", name: "Florida" }, { code: "NY", name: "New York" }, { code: "TX", name: "Texas" }, { code: "WA", name: "Washington" }];
const sheltersPerPage = 10;

export function ShelterFinder() {
  const [area, setArea] = useState("TX");
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [status, setStatus] = useState("Choose a state to search official FEMA shelter records.");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [accessibility, setAccessibilityState] = useState(false);
  const [pets, setPetsState] = useState(false);
  const [generator, setGeneratorState] = useState(false);
  const [knownCapacity, setKnownCapacityState] = useState(false);
  const [requestedPage, setPage] = useState(1);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  async function loadShelters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Checking the FEMA shelter system.");
    try {
      const response = await fetch(`/api/disaster-shelters?area=${area}`);
      const data = await response.json() as { shelters?: Shelter[]; listingType?: string };
      const nextShelters = data.shelters ?? [];
      setShelters(nextShelters);
      setPage(1);
      setStatus(data.listingType === "open" ? `${nextShelters.length} confirmed open shelters found.` : data.listingType === "registered" ? "No confirmed open shelters were found. Showing registered locations that may be closed. Verify before traveling." : "FEMA shelter information is temporarily unavailable.");
    } catch {
      setShelters([]);
      setStatus("FEMA shelter information is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  const filteredShelters = shelters.filter(shelter => {
    if (accessibility && shelter.wheelchairAccessible !== "Yes" && shelter.adaCompliant !== "Yes") return false;
    if (pets && shelter.pets === "Unknown") return false;
    if (generator && shelter.generator !== "Yes") return false;
    if (knownCapacity && (!shelter.capacity || shelter.capacity <= 0)) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredShelters.length / sheltersPerPage));
  const page = Math.min(requestedPage, totalPages);
  const pageShelters = filteredShelters.slice((page - 1) * sheltersPerPage, page * sheltersPerPage);

  function setAccessibility(value: boolean) { setAccessibilityState(value); setPage(1); }
  function setPets(value: boolean) { setPetsState(value); setPage(1); }
  function setGenerator(value: boolean) { setGeneratorState(value); setPage(1); }
  function setKnownCapacity(value: boolean) { setKnownCapacityState(value); setPage(1); }

  function changePage(nextPage: number) {
    setPage(nextPage);
    requestAnimationFrame(() => resultsHeadingRef.current?.focus());
  }

  async function findNearest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setStatus("Finding the nearest FEMA shelter locations.");
    try {
      const response = await fetch(`/api/disaster-shelters?area=${area}&location=${encodeURIComponent(query)}`);
      const data = await response.json() as { shelters?: Shelter[]; listingType?: string; searchedLocation?: string | null };
      const nextShelters = data.shelters ?? [];
      setShelters(nextShelters);
      setPage(1);
      setStatus(data.searchedLocation ? nextShelters.length ? `Showing the ${nextShelters.length} nearest shelter locations to ${query}. Distance is approximate.` : `No shelter locations with coordinates were found near ${query}.` : `We could not locate ${query}. Check the city or postal code and try again.`);
    } catch {
      setStatus("The location search is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return <section className="shelterSection">
    <div className="reliefSectionIntro"><div><p className="reliefEyebrow">FEMA shelter system</p><h1>Find shelter locations</h1></div><form onSubmit={loadShelters}><label htmlFor="shelterArea">State</label><select id="shelterArea" value={area} onChange={event => setArea(event.target.value)}>{areas.map(item => <option value={item.code} key={item.code}>{item.name}</option>)}</select><button disabled={loading}>{loading ? "Checking shelters" : "Find shelters"}</button></form></div>
    <div className="shelterSafety"><strong>Verify before traveling</strong><p>Shelter status and capacity can change quickly. Registered locations are not necessarily open.</p></div>
    <p className="alertStatus" role="status">{status}</p>
    <form className="shelterFilter" onSubmit={findNearest}><label htmlFor="shelterLocation">City or postal code</label><div><input id="shelterLocation" value={query} onChange={event => setQuery(event.target.value)} placeholder="For example, Arlington or 76013" /><button disabled={loading || !query.trim()}>{loading ? "Searching" : "Find nearest"}</button></div></form>
    {shelters.length ? <><fieldset className="shelterOptions"><legend>Filter shelter results</legend><label><input type="checkbox" checked={accessibility} onChange={event => setAccessibility(event.target.checked)} />Accessibility confirmed</label><label><input type="checkbox" checked={pets} onChange={event => setPets(event.target.checked)} />Pet information available</label><label><input type="checkbox" checked={generator} onChange={event => setGenerator(event.target.checked)} />Generator available</label><label><input type="checkbox" checked={knownCapacity} onChange={event => setKnownCapacity(event.target.checked)} />Capacity available</label></fieldset><h2 className="resultsHeading" ref={resultsHeadingRef} tabIndex={-1}>Shelter results</h2><p className="resultCount" role="status">{filteredShelters.length} locations match these filters. Page {Math.min(page, totalPages)} of {totalPages}.</p>{filteredShelters.length ? <><div className="shelterList">{pageShelters.map(shelter => <article key={shelter.id}><div className="shelterHeading"><span className={shelter.status === "OPEN" ? "open" : "verify"}>{shelter.status === "OPEN" ? "Confirmed open" : "Verify status"}</span><small>{shelter.distanceMiles !== undefined ? `${shelter.distanceMiles} miles away` : `FEMA record ${shelter.id}`}</small></div><h2>{shelter.name}</h2><p>{shelter.address}, {shelter.city}, {shelter.state} {shelter.postalCode}</p><dl><dt>Wheelchair access</dt><dd>{shelter.wheelchairAccessible}</dd><dt>ADA compliant</dt><dd>{shelter.adaCompliant}</dd><dt>Pets</dt><dd>{shelter.pets}</dd><dt>Generator</dt><dd>{shelter.generator}</dd><dt>Capacity</dt><dd>{shelter.capacity && shelter.capacity > 0 ? shelter.capacity : "Unknown"}</dd></dl><div className="shelterActions"><Link href={`/disaster-resource-coordinator/shelters/${shelter.id}?area=${area}`}>View shelter details →</Link><a href={shelter.directionsUrl} target="_blank" rel="noreferrer">Directions →</a></div></article>)}</div>{totalPages > 1 && <nav className="shelterPagination" aria-label="Shelter result pages"><button type="button" onClick={() => changePage(page - 1)} disabled={page === 1}>← Previous</button><span>Page {page} of {totalPages}</span><button type="button" onClick={() => changePage(page + 1)} disabled={page === totalPages}>Next →</button></nav>}</> : <div className="emptyAlerts"><span aria-hidden="true">i</span><div><strong>No locations match these filters</strong><p>Remove one or more filters to see additional FEMA records.</p></div></div>}</> : <div className="emptyAlerts"><span aria-hidden="true">i</span><div><strong>No shelter locations displayed</strong><p>Search by state, city, or postal code, or use the official FEMA shelter guidance.</p></div><a href="https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" target="_blank" rel="noreferrer">Official shelter guidance →</a></div>}
  </section>;
}
