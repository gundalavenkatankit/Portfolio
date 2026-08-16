"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const parks = [
  { name: "Central Square Park", detail: "Playground, walking paths, picnic tables", area: "Downtown" },
  { name: "Riverside Green", detail: "Sports fields, trail, accessible restrooms", area: "River District" },
  { name: "Oak Street Garden", detail: "Community garden, seating, quiet space", area: "North Fairview" },
];

const housingResources: Record<string, string[]> = {
  rent: ["Emergency rental assistance", "Tenant counseling", "Utility support"],
  repairs: ["Essential home repair grant", "Accessibility modification support", "Energy efficiency guidance"],
  shelter: ["Call 311 for placement support", "Family shelter intake", "Housing crisis counseling"],
};

export function ServiceTool({ slug }: { slug: string }) {
  const [result, setResult] = useState("");
  const [choice, setChoice] = useState("");

  function demonstrate(event: FormEvent<HTMLFormElement>, message: string) {
    event.preventDefault();
    setResult(message);
  }

  if (slug === "trash-schedule") return <Tool title="Find your collection schedule" description="Enter a Fairview address to view a demonstration schedule."><form className="taskForm" onSubmit={event => demonstrate(event, "Trash collection is Tuesday. Recycling is every other Friday. Yard waste collection is Monday.")}><label>Street address<input required placeholder="Example 125 Oak Street" /></label><button type="submit">Find schedule</button></form><Result text={result} /></Tool>;

  if (slug === "pay-a-bill") return <Tool title="Make a simulated payment" description="Choose a bill and enter fictional account information. No payment is processed."><form className="taskForm" onSubmit={event => demonstrate(event, "Payment demonstration complete. Confirmation number FV 80412.")}><label>Bill type<select required defaultValue=""><option value="" disabled>Select a bill</option><option>Water and sewer</option><option>Property tax</option><option>Parking citation</option><option>City invoice</option></select></label><label>Account or citation number<input required /></label><label>Payment amount<input required inputMode="decimal" placeholder="0.00" /></label><button type="submit">Continue payment</button></form><Result text={result} /></Tool>;

  if (slug === "business-license") return <Tool title="Find a license type" description="Select a business activity to see common preparation steps."><form className="taskForm" onSubmit={event => demonstrate(event, "Prepare proof of identity, the business address, ownership details, and the applicable fee. A zoning review may also be required.")}><label>Business activity<select required defaultValue=""><option value="" disabled>Select an activity</option><option>General retail</option><option>Restaurant or food service</option><option>Professional services</option><option>Home based business</option></select></label><button type="submit">View requirements</button></form><Result text={result} /><p className="sourceLink"><Link href="/civicconnect/data">Search the official reference dataset →</Link></p></Tool>;

  if (slug === "business-services") return <Tool title="Business resource guide" description="Choose your current goal to find the right starting points."><div className="taskChoices">{["Start a business", "Find permits", "Explore support programs", "Sell to the city"].map(item => <button className={choice === item ? "selected" : ""} onClick={() => setChoice(item)} key={item}>{item}</button>)}</div>{choice && <Result text={`${choice}: review registration, zoning, licensing, funding, and procurement guidance for your situation. Call 311 when you need help choosing a department.`} />}</Tool>;

  if (slug === "housing-support") return <Tool title="Find housing support" description="Choose the kind of help you need right now."><div className="taskChoices">{[["rent", "Rent or utilities"], ["repairs", "Home repairs"], ["shelter", "Emergency shelter"]].map(([value, label]) => <button className={choice === value ? "selected" : ""} onClick={() => setChoice(value)} key={value}>{label}</button>)}</div>{choice && <div className="taskResult" role="status"><strong>Suggested resources</strong><ul>{housingResources[choice].map(resource => <li key={resource}>{resource}</li>)}</ul></div>}</Tool>;

  if (slug === "parks-and-recreation") return <Tool title="Find a park" description="Browse fictional Fairview parks and their amenities."><div className="recordList">{parks.map(park => <article key={park.name}><span>{park.area}</span><h3>{park.name}</h3><p>{park.detail}</p></article>)}</div><p className="sourceLink"><Link href="/civicconnect/data">Explore the official parks reference dataset →</Link></p></Tool>;

  if (slug === "public-safety") return <Tool title="Safety resources" description="Use the right service for the situation."><div className="recordList"><article><span>Immediate danger</span><h3>Call 911</h3><p>Use emergency services when someone is in immediate danger.</p></article><article><span>Nonemergency issue</span><h3>Fairview 311</h3><p>Report damaged streets, lights, signs, graffiti, trash, or park maintenance.</p><Link href="/civicconnect/report">Report an issue →</Link></article></div><p className="sourceLink"><Link href="/civicconnect/data">Explore the official public safety reference dataset →</Link></p></Tool>;

  if (slug === "city-records") return <Tool title="Prepare a records request" description="Describe the record clearly so the correct department can locate it."><form className="taskForm" onSubmit={event => demonstrate(event, "Request demonstration submitted. Reference number FV 65027.")}><label>Record type<select required defaultValue=""><option value="" disabled>Select a record type</option><option>Meeting document</option><option>Permit or license record</option><option>Property record</option><option>Other city record</option></select></label><label>Record description<textarea required minLength={15} placeholder="Include names, dates, locations, or departments" /></label><button type="submit">Submit demonstration request</button></form><Result text={result} /><p className="sourceLink"><Link href="/civicconnect/data">Browse published public datasets →</Link></p></Tool>;

  return null;
}

function Tool({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="serviceTool" id="serviceTool"><p className="civicEyebrow">Interactive demonstration</p><h2>{title}</h2><p>{description}</p>{children}</section>;
}

function Result({ text }: { text: string }) {
  return text ? <div className="taskResult" role="status"><strong>Result</strong><p>{text}</p></div> : null;
}
