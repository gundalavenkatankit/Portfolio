import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim().slice(0, 100) ?? "";
  if (!query) return Response.json({ error: "Location is required" }, { status: 400 });
  const parameters = new URLSearchParams({ q: `${query}, United States`, format: "jsonv2", countrycodes: "us", addressdetails: "1", limit: "1" });
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${parameters}`, { headers: { "User-Agent": "ReliefReady portfolio project contact gundalavenkatankit@gmail.com" }, next: { revalidate: 86400 } });
    if (!response.ok) throw new Error(`Location service returned ${response.status}`);
    const results = await response.json() as { lat: string; lon: string; display_name: string; address?: Record<string, string> }[];
    const result = results[0];
    if (!result) return Response.json({ location: null });
    const isoCode = Object.entries(result.address ?? {}).find(([key]) => key.startsWith("ISO3166-2-lvl"))?.[1];
    const stateCode = isoCode?.split("-").at(-1) ?? null;
    return Response.json({ location: { label: result.display_name, latitude: Number(result.lat), longitude: Number(result.lon), stateCode, postalCode: result.address?.postcode ?? null } });
  } catch {
    return Response.json({ location: null, unavailable: true });
  }
}
