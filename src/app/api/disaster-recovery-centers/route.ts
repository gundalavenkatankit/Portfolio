import { NextRequest } from "next/server";
import { buildGeocodeQuery, rankNearestShelters } from "@/lib/shelter-search.mjs";

const supportedAreas = new Set("AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,PR,VI,GU,AS,MP".split(","));
const fields = "drc_id,primary_disaster,drc_name,street_1,street_2,city,county_parish,state,zip,status,notes,drc_type_desc,monday_open_tm,monday_close_tm,tuesday_open_tm,tuesday_close_tm,wednesday_open_tm,wednesday_close_tm,thursday_open_tm,thursday_close_tm,friday_open_tm,friday_close_tm,saturday_open_tm,saturday_close_tm,sunday_open_tm,sunday_close_tm,latitude,longitude,last_report_date";

type CenterAttributes = Record<string, string | number | null> & { drc_id: number; primary_disaster: number; drc_name: string; street_1: string | null; street_2: string | null; city: string; county_parish: string | null; state: string; zip: string | null; status: string; notes: string | null; drc_type_desc: string | null; latitude: number | null; longitude: number | null; last_report_date: number | null };

function schedule(attributes: CenterAttributes) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return days.map(day => ({ day: day[0].toUpperCase() + day.slice(1), open: attributes[`${day}_open_tm`] as string | null, close: attributes[`${day}_close_tm`] as string | null })).filter(item => item.open && item.close);
}

async function geocodeLocation(location: string, area: string) {
  const parameters = new URLSearchParams({ q: buildGeocodeQuery(location, area), format: "jsonv2", countrycodes: "us", limit: "1" });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${parameters}`, { headers: { "User-Agent": "ReliefReady portfolio project contact gundalavenkatankit@gmail.com" }, next: { revalidate: 86400 } });
  if (!response.ok) return null;
  const results = await response.json() as { lat: string; lon: string; display_name: string }[];
  return results[0] ? { latitude: Number(results[0].lat), longitude: Number(results[0].lon), label: results[0].display_name } : null;
}

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area")?.toUpperCase() ?? "TX";
  const location = request.nextUrl.searchParams.get("location")?.trim().slice(0, 100) ?? "";
  const latitudeValue = request.nextUrl.searchParams.get("latitude");
  const longitudeValue = request.nextUrl.searchParams.get("longitude");
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);
  if (!supportedAreas.has(area)) return Response.json({ error: "Unsupported area" }, { status: 400 });

  const parameters = new URLSearchParams({ where: `state='${area}'`, outFields: fields, returnGeometry: "true", outSR: "4326", resultRecordCount: "200", orderByFields: "city ASC", f: "json" });
  try {
    const response = await fetch(`https://gis.fema.gov/arcgis/rest/services/FEMA/DRC/FeatureServer/0/query?${parameters}`, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error(`FEMA recovery center service returned ${response.status}`);
    const data = await response.json() as { features?: { attributes: CenterAttributes; geometry?: { x: number; y: number } }[] };
    const centers = (data.features ?? []).map(({ attributes, geometry }) => {
      const address = [attributes.street_1, attributes.street_2, attributes.city, attributes.state, attributes.zip].filter(Boolean).join(", ");
      return { id: attributes.drc_id, disasterNumber: attributes.primary_disaster, name: attributes.drc_name, type: attributes.drc_type_desc ?? "Disaster Recovery Center", address, city: attributes.city, county: attributes.county_parish ?? "Not provided", state: attributes.state, postalCode: attributes.zip ?? "", status: attributes.status, notes: attributes.notes, schedule: schedule(attributes), latitude: attributes.latitude ?? geometry?.y ?? null, longitude: attributes.longitude ?? geometry?.x ?? null, lastReportedAt: attributes.last_report_date ? new Date(attributes.last_report_date).toISOString() : null, directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` };
    });
    if (!location) return Response.json({ centers, source: "FEMA Active Disaster Recovery Centers" });
    const origin = latitudeValue !== null && longitudeValue !== null && Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude, label: location } : await geocodeLocation(location, area);
    if (!origin) return Response.json({ centers: [], searchedLocation: null, source: "FEMA Active Disaster Recovery Centers" });
    return Response.json({ centers: rankNearestShelters(centers, origin, 10), searchedLocation: origin.label, source: "FEMA Active Disaster Recovery Centers" });
  } catch {
    return Response.json({ centers: [], unavailable: true, source: "FEMA Active Disaster Recovery Centers" });
  }
}
