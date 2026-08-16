"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Shelter = { id: number; name: string; address: string; city: string; state: string; postalCode: string; status: string; wheelchairAccessible: string; adaCompliant: string; pets: string; generator: string; capacity: number | null; population: number | null; phone: string | null; directionsUrl: string };

export function ShelterDetail({ shelterId, area }: { shelterId: number; area: string }) {
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [status, setStatus] = useState("Loading the latest FEMA shelter record.");

  useEffect(() => {
    let active = true;
    fetch(`/api/disaster-shelters?area=${area}`)
      .then(response => response.json())
      .then((data: { shelters?: Shelter[] }) => {
        if (!active) return;
        const match = (data.shelters ?? []).find(item => item.id === shelterId) ?? null;
        setShelter(match);
        setStatus(match ? "Latest FEMA record loaded." : "This shelter is not present in the latest FEMA results.");
      })
      .catch(() => active && setStatus("FEMA shelter information is temporarily unavailable."));
    return () => { active = false; };
  }, [area, shelterId]);

  return <main id="shelterDetailMain" className="shelterDetailPage">
    <div className="shelterDetailBack"><Link href="/disaster-resource-coordinator/shelters">← Return to shelter search</Link></div>
    <p className="alertStatus" role="status">{status}</p>
    {shelter ? <article>
      <div className="shelterHeading"><span className={shelter.status === "OPEN" ? "open" : "verify"}>{shelter.status === "OPEN" ? "Confirmed open" : "Verify status"}</span><small>FEMA record {shelter.id}</small></div>
      <p className="reliefEyebrow">Shelter details</p>
      <h1>{shelter.name}</h1>
      <p className="shelterAddress">{shelter.address}, {shelter.city}, {shelter.state} {shelter.postalCode}</p>
      <div className="shelterDetailGrid">
        <section><h2>Access and services</h2><dl><dt>Wheelchair access</dt><dd>{shelter.wheelchairAccessible}</dd><dt>ADA compliant</dt><dd>{shelter.adaCompliant}</dd><dt>Pet accommodations</dt><dd>{shelter.pets}</dd><dt>Generator</dt><dd>{shelter.generator}</dd></dl></section>
        <section><h2>Current record</h2><dl><dt>Status</dt><dd>{shelter.status}</dd><dt>Capacity</dt><dd>{shelter.capacity && shelter.capacity > 0 ? shelter.capacity : "Unknown"}</dd><dt>Current population</dt><dd>{shelter.population !== null && shelter.population >= 0 ? shelter.population : "Unknown"}</dd><dt>Phone</dt><dd>{shelter.phone ?? "Not provided"}</dd></dl></section>
      </div>
      <div className="shelterSafety"><strong>Verify before traveling</strong><p>Capacity, access, and operating status can change. Follow instructions from local emergency officials.</p></div>
      <div className="detailActions"><a className="detailDirections" href={shelter.directionsUrl} target="_blank" rel="noreferrer">Open location and directions →</a><a className="detailOfficial" href="https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" target="_blank" rel="noreferrer">Official shelter information →</a></div>
    </article> : <div className="emptyAlerts"><span aria-hidden="true">i</span><div><strong>Shelter record unavailable</strong><p>Return to the finder to view the latest shelter locations.</p></div><Link href="/disaster-resource-coordinator/shelters">Shelter finder →</Link></div>}
  </main>;
}
