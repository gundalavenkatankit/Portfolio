import Link from "next/link";
import { Arrow, CivicFooter, CivicHeader } from "./components";
import { categories, services } from "./data";
import { RequestTracker } from "./request-tracker";

export default function CivicConnectPage() {
  return (
    <>
      <CivicHeader />
      <main id="civicMain">
        <section className="civicHero">
          <div className="heroContent"><p className="civicEyebrow">Welcome to Fairview</p><h1>What do you need help with today?</h1><p>Find city services, complete common tasks, and track your requests in one clear place.</p><form className="serviceSearch" action="/civicconnect/services"><label htmlFor="serviceSearch">Search city services</label><div><input id="serviceSearch" name="query" placeholder="Try parking permit or trash schedule" /><button type="submit">Search</button></div></form></div>
          <aside className="alertCard" id="alerts"><span>City update</span><h2>Summer service hours begin June 1</h2><p>Some city offices will close at 3 PM on Fridays.</p><a href="#alerts">Read the update <Arrow /></a></aside>
        </section>

        <section className="civicSection popularSection"><div className="sectionIntro"><p className="civicEyebrow">Popular services</p><h2>Start with a common task</h2><Link href="/civicconnect/services">View all services <Arrow /></Link></div><div className="serviceGrid">{services.slice(0, 6).map((service) => <Link className="serviceCard" href={service.href} key={service.title}><span className="serviceIcon" aria-hidden="true">{service.icon}</span><h3>{service.title}</h3><p>{service.description}</p><Arrow /></Link>)}</div></section>

        <section className="civicSection categorySection"><div className="sectionIntro"><p className="civicEyebrow">Browse by category</p><h2>Find the right department</h2></div><div className="categoryList">{categories.map((category, index) => <Link href={`/civicconnect/services?query=${encodeURIComponent(category)}`} key={category}><span>{String(index + 1).padStart(2, "0")}</span>{category}<Arrow /></Link>)}</div></section>

        <section className="reportBand"><div><p className="civicEyebrow">Fairview 311</p><h2>See something that needs attention?</h2><p>Report a concern and receive a number to track its progress.</p></div><Link className="civicButton light" href="/civicconnect/report">Report an issue <Arrow /></Link></section>

        <section className="civicSection updateGrid"><article id="events"><p className="civicEyebrow">Upcoming events</p><h2>Meet your city</h2><div className="event"><time dateTime="2026-08-21"><strong>21</strong>Aug</time><div><h3>Community planning workshop</h3><p>6 PM at Fairview Public Library</p></div></div><div className="event"><time dateTime="2026-08-29"><strong>29</strong>Aug</time><div><h3>Summer night market</h3><p>4 PM at Central Square</p></div></div></article><article className="resourcePanel"><p className="civicEyebrow">Your requests</p><h2>Track an application or report</h2><p>Enter a request number to check its latest status.</p><RequestTracker /></article></section>
      </main>
      <CivicFooter />
    </>
  );
}
