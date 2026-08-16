import Link from "next/link";
import { Arrow, CivicFooter, CivicHeader } from "../components";
import { categories, services } from "../data";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const query = (await searchParams).query?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const matchingServices = normalizedQuery
    ? services.filter(service => `${service.title} ${service.description} ${service.group}`.toLowerCase().includes(normalizedQuery))
    : services;

  return <><CivicHeader /><main id="civicMain"><section className="pageHero"><nav aria-label="Breadcrumb"><Link href="/civicconnect">Home</Link><span>/</span><span>Services</span></nav><p className="civicEyebrow">City services</p><h1>How can we help?</h1><p>Browse services by category or search for a specific task.</p><form className="serviceSearch" action="/civicconnect/services"><label className="visuallyHidden" htmlFor="directorySearch">Search city services</label><div><input id="directorySearch" name="query" defaultValue={query} placeholder="What are you looking for?" /><button>Search</button></div></form></section><section className="directoryLayout"><aside><h2>Categories</h2><nav aria-label="Service categories">{categories.map(category => <Link href={`/civicconnect/services?query=${encodeURIComponent(category)}`} key={category}>{category}</Link>)}</nav></aside><div>{query && <div className="searchSummary" role="status"><strong>{matchingServices.length} {matchingServices.length === 1 ? "result" : "results"}</strong><span> for “{query}”</span><Link href="/civicconnect/services">Clear search</Link></div>}{matchingServices.length ? <div className="directoryCards">{matchingServices.map(service => <Link className="directoryCard" id={service.group.toLowerCase().replaceAll(" ", "")} href={service.href} key={service.title}><span>{service.group}</span><h2>{service.title}</h2><p>{service.description}</p><strong>View service <Arrow /></strong></Link>)}</div> : <div className="emptyState"><h2>No services found</h2><p>Try a broader term such as parking, housing, business, or records.</p><Link className="civicButton" href="/civicconnect/services">View all services</Link></div>}</div></section></main><CivicFooter /></>;
}
