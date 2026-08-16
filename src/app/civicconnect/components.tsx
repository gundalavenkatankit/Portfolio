import Link from "next/link";

export function CivicHeader() {
  return (
    <>
      <a className="civicSkip" href="#civicMain">Skip to main content</a>
      <div className="utilityBar"><div><span>City of Fairview</span><nav aria-label="Utility navigation"><a href="#alerts">City alerts</a><a href="#events">Events</a><a href="#contact">Contact</a></nav></div></div>
      <header className="civicHeader">
        <Link className="civicBrand" href="/civicconnect" aria-label="CivicConnect home"><span>FV</span><strong>CivicConnect</strong></Link>
        <nav aria-label="Primary navigation"><Link href="/civicconnect/services">Services</Link><a href="#departments">Departments</a><a href="#residents">Residents</a><a href="#business">Business</a></nav>
        <div className="headerActions"><button aria-label="Search CivicConnect">Search</button><button aria-label="Open account">My account</button></div>
      </header>
    </>
  );
}

export function CivicFooter() {
  return <footer className="civicFooter" id="contact"><div><Link className="civicBrand" href="/civicconnect"><span>FV</span><strong>CivicConnect</strong></Link><p>A fictional city services experience created for a public portfolio project.</p></div><div><strong>Get help</strong><Link href="/#contact">Contact the project creator</Link><Link href="/">Return to portfolio</Link></div></footer>;
}

export function Arrow() {
  return <span aria-hidden="true">→</span>;
}
