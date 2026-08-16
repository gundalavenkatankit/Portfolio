import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, CivicFooter, CivicHeader } from "../../components";
import { serviceDetails } from "../../data";
import { ServiceTool } from "./service-tool";

export function generateStaticParams() { return Object.keys(serviceDetails).map(slug => ({ slug })); }

export default async function GeneralServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceDetails[slug];
  if (!service) notFound();
  return <><CivicHeader /><main id="civicMain"><section className="serviceHero"><nav aria-label="Breadcrumb"><Link href="/civicconnect">Home</Link><span>/</span><Link href="/civicconnect/services">Services</Link><span>/</span><span>{service.title}</span></nav><p className="civicEyebrow">{service.group}</p><h1>{service.title}</h1><p>{service.summary}</p></section><section className="serviceDetail generalService"><article><section><h2>Choose what you need</h2><div className="actionGrid">{service.actions?.map((action, index) => <a href="#serviceTool" key={action}><span>0{index + 1}</span><strong>{action}</strong><Arrow /></a>)}</div></section><ServiceTool slug={slug} /><section id="serviceInformation"><h2>About this service</h2><p>This portfolio prototype demonstrates how a city can organize complex information around the task a resident wants to complete. Forms and payments shown here are demonstrations and do not submit information to a government agency.</p>{slug === "public-safety" && <div className="emergencyNotice"><strong>Call 911 when there is immediate danger</strong><p>Public datasets are informational and should never be used for emergency response.</p></div>}</section><section><h2>What happens next</h2><ol><li>Choose the service or information you need.</li><li>Review requirements and prepare relevant details.</li><li>Continue to the appropriate form, resource, or public dataset.</li></ol></section></article><aside><div className="helpCard"><p className="civicEyebrow">Need help</p><h2>Service support</h2><p>Call 311 for help finding the correct city service. Call 911 for an emergency.</p><Link className="civicButton" href="/civicconnect/services">View all services <Arrow /></Link></div></aside></section></main><CivicFooter /></>;
}
