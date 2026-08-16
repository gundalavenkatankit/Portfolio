import { NextRequest } from "next/server";

const supportedAreas = new Set("AL,AK,AZ,AR,CA,CO,CT,DE,DC,FL,GA,HI,ID,IL,IN,IA,KS,KY,LA,ME,MD,MA,MI,MN,MS,MO,MT,NE,NV,NH,NJ,NM,NY,NC,ND,OH,OK,OR,PA,RI,SC,SD,TN,TX,UT,VT,VA,WA,WV,WI,WY,PR,VI,GU,AS,MP".split(","));

type NwsFeature = {
  id: string;
  properties: {
    event?: string;
    headline?: string;
    severity?: string;
    urgency?: string;
    areaDesc?: string;
    instruction?: string;
    web?: string;
    expires?: string;
  };
};

export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area")?.toUpperCase() ?? "TX";
  if (!supportedAreas.has(area)) return Response.json({ error: "Unsupported area" }, { status: 400 });

  try {
    const response = await fetch(`https://api.weather.gov/alerts/active?area=${area}`, {
      headers: { "User-Agent": "Disaster Resource Coordinator portfolio project, gundalavenkatankit@gmail.com" },
      next: { revalidate: 300 },
    });
    if (!response.ok) throw new Error(`Weather service returned ${response.status}`);
    const data = await response.json() as { features?: NwsFeature[] };
    const alerts = (data.features ?? []).slice(0, 8).map(feature => ({
      id: feature.id,
      event: feature.properties.event ?? "Weather alert",
      headline: feature.properties.headline ?? "Official weather information is available.",
      severity: feature.properties.severity ?? "Unknown",
      urgency: feature.properties.urgency ?? "Unknown",
      area: feature.properties.areaDesc ?? area,
      instruction: feature.properties.instruction ?? "Follow instructions from local officials.",
      url: `https://www.weather.gov/alerts/${area.toLowerCase()}.html`,
      expires: feature.properties.expires ?? null,
    }));
    return Response.json({ alerts, source: "National Weather Service", area });
  } catch {
    return Response.json({ alerts: [], source: "National Weather Service", area, unavailable: true });
  }
}
