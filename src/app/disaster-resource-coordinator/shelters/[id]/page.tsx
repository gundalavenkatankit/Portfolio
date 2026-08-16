import Link from "next/link";
import { notFound } from "next/navigation";
import { ShelterDetail } from "./shelter-detail";

const supportedAreas = new Set(["CA", "FL", "NY", "TX", "WA"]);

export default async function ShelterDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ area?: string }> }) {
  const { id } = await params;
  const query = await searchParams;
  const shelterId = Number(id);
  const area = query.area?.toUpperCase() ?? "TX";
  if (!Number.isInteger(shelterId) || !supportedAreas.has(area)) notFound();

  return <><a className="reliefSkip" href="#shelterDetailMain">Skip to shelter details</a><header className="reliefHeader"><Link href="/disaster-resource-coordinator" className="reliefBrand"><span>RR</span><strong>ReliefReady</strong></Link><nav aria-label="Primary navigation"><Link href="/disaster-resource-coordinator">Dashboard</Link><Link href="/disaster-resource-coordinator/shelters">Shelter search</Link></nav><Link href="/">Portfolio</Link></header><ShelterDetail shelterId={shelterId} area={area} /></>;
}
