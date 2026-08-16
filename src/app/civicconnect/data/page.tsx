import Link from "next/link";
import { Arrow, CivicFooter, CivicHeader } from "../components";
import { publicDataSources } from "../data";

export default function PublicDataPage() {
  return <><CivicHeader /><main id="civicMain"><section className="pageHero"><nav aria-label="Breadcrumb"><Link href="/civicconnect">Home</Link><span>/</span><span>Public data</span></nav><p className="civicEyebrow">Open information</p><h1>Explore public data</h1><p>Trusted government datasets that inform the service concepts in this fictional city experience.</p></section><section className="dataLibrary"><div className="dataNotice"><strong>About these sources</strong><p>CivicConnect is fictional. The links below open official datasets from real United States cities. Their information is presented as design research and is not represented as Fairview data.</p></div><div className="dataGrid">{publicDataSources.map(source => <article className="dataCard" key={source.title}><p className="civicEyebrow">{source.category}</p><h2>{source.title}</h2><p>{source.description}</p><dl><dt>Published by</dt><dd>{source.publisher}</dd><dt>Useful fields</dt><dd>{source.fields.join(", ")}</dd></dl><a href={source.url} target="_blank" rel="noreferrer">Open official dataset <Arrow /></a></article>)}</div></section></main><CivicFooter /></>;
}
