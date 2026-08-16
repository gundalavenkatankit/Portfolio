import { NextRequest } from "next/server";
import { buildGeocodeQuery, rankNearestShelters } from "@/lib/shelter-search.mjs";

const supportedAreas = new Set("AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,PR,VI,GU,AS,MP".split(","));
const fields = "shelter_id,shelter_name,address_1,city,state,zip,ada_compliant,wheelchair_accessible,pet_accommodations_desc,generator_onsite,latitude,longitude,org_main_phone,shelter_status_code,total_population,evacuation_capacity";

type ShelterAttributes = {
  shelter_id: number;
  shelter_name: string | null;
  address_1: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  ada_compliant: string | null;
  wheelchair_accessible: string | null;
  pet_accommodations_desc: string | null;
  generator_onsite: string | null;
  latitude: number | null;
  longitude: number | null;
  org_main_phone: string | null;
  shelter_status_code: string | null;
  total_population: number | null;
  evacuation_capacity: number | null;
};

async function queryShelters(layer: 0 | 5, area: string) {
  const parameters = new URLSearchParams({
    where: `state='${area}'`,
    outFields: fields,
    returnGeometry: "true",
    outSR: "4326",
    resultRecordCount: "1000",
    orderByFields: "city ASC",
    f: "json",
  });
  const response = await fetch(`https://gis.fema.gov/arcgis/rest/services/NSS/FEMA_NSS/FeatureServer/${layer}/query?${parameters}`, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`FEMA shelter service returned ${response.status}`);
  const data = await response.json() as { features?: { attributes: ShelterAttributes; geometry?: { x: number; y: number } }[] };
  return (data.features ?? []).map(({ attributes, geometry }) => ({
    id: attributes.shelter_id,
    name: attributes.shelter_name?.trim() || "Shelter location",
    address: attributes.address_1?.trim() || "Address unavailable",
    city: attributes.city?.trim() || "City unavailable",
    state: attributes.state?.trim() || area,
    postalCode: attributes.zip?.trim() || "",
    status: attributes.shelter_status_code?.trim() || (layer === 0 ? "OPEN" : "UNKNOWN"),
    wheelchairAccessible: normalizeValue(attributes.wheelchair_accessible),
    adaCompliant: normalizeValue(attributes.ada_compliant),
    pets: attributes.pet_accommodations_desc?.trim() || "Unknown",
    generator: normalizeValue(attributes.generator_onsite),
    capacity: attributes.evacuation_capacity,
    population: attributes.total_population,
    phone: attributes.org_main_phone?.trim() || null,
    latitude: attributes.latitude ?? geometry?.y ?? null,
    longitude: attributes.longitude ?? geometry?.x ?? null,
    directionsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([attributes.address_1, attributes.city, attributes.state, attributes.zip].filter(Boolean).join(", "))}`,
  }));
}

async function geocodeLocation(location: string, area: string) {
  const parameters = new URLSearchParams({
    q: buildGeocodeQuery(location, area),
    format: "jsonv2",
    countrycodes: "us",
    limit: "1",
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${parameters}`, {
    headers: { "User-Agent": "ReliefReady portfolio project contact gundalavenkatankit@gmail.com" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) return null;
  const results = await response.json() as { lat: string; lon: string; display_name: string }[];
  if (!results[0]) return null;
  return { latitude: Number(results[0].lat), longitude: Number(results[0].lon), label: results[0].display_name };
}

async function addNearestResults(shelters: Awaited<ReturnType<typeof queryShelters>>, location: string, area: string, providedOrigin?: { latitude: number; longitude: number; label: string }) {
  const origin = providedOrigin ?? await geocodeLocation(location, area);
  if (!origin) return { shelters: [], searchedLocation: null };
  const nearest = rankNearestShelters(shelters, origin);
  return { shelters: nearest, searchedLocation: origin.label };
}

function normalizeValue(value: string | null) {
  const normalized = value?.trim().toUpperCase();
  if (normalized === "YES") return "Yes";
  if (normalized === "NO") return "No";
  return "Unknown";
}

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area")?.toUpperCase() ?? "TX";
  const location = request.nextUrl.searchParams.get("location")?.trim().slice(0, 100) ?? "";
  const latitudeValue = request.nextUrl.searchParams.get("latitude");
  const longitudeValue = request.nextUrl.searchParams.get("longitude");
  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);
  const providedOrigin = latitudeValue !== null && longitudeValue !== null && Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude, label: location } : undefined;
  if (!supportedAreas.has(area)) return Response.json({ error: "Unsupported area" }, { status: 400 });
  try {
    const openShelters = await queryShelters(0, area);
    if (openShelters.length) {
      if (location) return Response.json({ ...await addNearestResults(openShelters, location, area, providedOrigin), listingType: "open", source: "FEMA ESF 6 Shelter System" });
      return Response.json({ shelters: openShelters, listingType: "open", source: "FEMA ESF 6 Shelter System" });
    }
    const registeredShelters = await queryShelters(5, area);
    if (location) return Response.json({ ...await addNearestResults(registeredShelters, location, area, providedOrigin), listingType: "registered", source: "FEMA ESF 6 Shelter System" });
    return Response.json({ shelters: registeredShelters, listingType: "registered", source: "FEMA ESF 6 Shelter System" });
  } catch {
    return Response.json({ shelters: [], listingType: "unavailable", source: "FEMA ESF 6 Shelter System" });
  }
}
