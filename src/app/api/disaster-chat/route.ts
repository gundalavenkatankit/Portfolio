import { understandDisasterQuestion } from "@/lib/deterministic-assistant.mjs";

type ConversationContext = { area?: string | null; location?: string | null };
type Source = { name: string; url: string };
type Result = { title: string; details: string[]; url?: string | null };

const sources = {
  alerts: { name: "National Weather Service", url: "https://www.weather.gov/alerts" },
  declarations: { name: "OpenFEMA", url: "https://www.fema.gov/disaster/declarations" },
  shelters: { name: "FEMA ESF 6 Shelter System", url: "https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" },
  recovery: { name: "FEMA Disaster Recovery Centers", url: "https://egateway.fema.gov/ESF6/DRCLocator" },
};

function getBaseUrl(request: Request) {
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return productionHost ? `https://${productionHost}` : new URL(request.url).origin;
}

async function readApi<T>(request: Request, path: string, parameters: Record<string, string>) {
  const url = new URL(path, getBaseUrl(request));
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Data service returned ${response.status}`);
  return response.json() as Promise<T>;
}

async function resolveLocation(request: Request, query: string) {
  return readApi<{ location?: { label: string; stateCode: string | null; postalCode: string | null } | null }>(request, "/api/disaster-location", { query });
}

function payload(answer: string, context: ConversationContext, sourceList: Source[] = [], results: Result[] = []) {
  return { answer, context, sources: sourceList, results };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 10000) return Response.json({ error: "Request is too large" }, { status: 413 });
  const body = await request.json().catch(() => null) as { question?: string; context?: ConversationContext } | null;
  const question = body?.question?.trim().slice(0, 600) ?? "";
  if (!question) return Response.json({ error: "A question is required" }, { status: 400 });

  const understood = understandDisasterQuestion(question, body?.context ?? {});
  let area = understood.area;
  let location = understood.location;

  if (understood.intent === "emergency") return Response.json(payload("Call 911 now if you or someone else is in immediate danger. Follow instructions from local emergency officials. ReliefReady cannot replace emergency services.", { area, location }));
  if (understood.intent === "capabilities") return Response.json(payload("I can check current weather alerts, recent federal disaster declarations, FEMA shelter records, and active FEMA recovery centers. Include a state, city, or postal code in your question.", { area, location }, Object.values(sources)));
  if (understood.intent === "unknown") return Response.json(payload("I can only answer questions about ReliefReady disaster resources. Try asking about weather alerts, shelters, disaster declarations, or FEMA recovery centers.", { area, location }, Object.values(sources)));

  try {
    if ((!area || ((understood.intent === "shelter" || understood.intent === "recovery") && !location)) && location) {
      const resolved = await resolveLocation(request, location);
      area = area ?? resolved.location?.stateCode ?? null;
      location = resolved.location?.postalCode ?? location;
    }
    if (!area) {
      const resolved = await resolveLocation(request, understood.location ?? question);
      area = resolved.location?.stateCode ?? null;
      location = resolved.location?.postalCode ?? understood.location ?? null;
    }
    if (!area) return Response.json(payload("Please include a United States state, city and state, or postal code so I can select the correct official data.", { area: null, location }));

    if (understood.intent === "alert") {
      const data = await readApi<{ alerts?: { event: string; headline: string; severity: string; urgency: string; area: string; instruction: string; url: string }[]; unavailable?: boolean }>(request, "/api/disaster-alerts", { area });
      if (data.unavailable) return Response.json(payload("The National Weather Service alert service is temporarily unavailable. Use the official source directly.", { area, location }, [sources.alerts]));
      const alerts = data.alerts ?? [];
      if (!alerts.length) return Response.json(payload(`No active National Weather Service alerts were found for ${area}. Conditions can change, so continue monitoring local officials.`, { area, location }, [sources.alerts]));
      return Response.json(payload(`${alerts.length} active National Weather Service alert${alerts.length === 1 ? " was" : "s were"} found for ${area}.`, { area, location }, [sources.alerts], alerts.slice(0, 5).map(alert => ({ title: alert.event, details: [`${alert.severity} severity`, `${alert.urgency} urgency`, alert.area, alert.headline, alert.instruction], url: alert.url }))));
    }

    if (understood.intent === "declaration") {
      const data = await readApi<{ declarations?: { title: string; declarationCode: string; declarationDate: string; incidentType: string; designatedAreas: string[]; individualAssistance: boolean; publicAssistance: boolean; sourceUrl: string }[]; unavailable?: boolean }>(request, "/api/disaster-declarations", { area });
      if (data.unavailable) return Response.json(payload("OpenFEMA declaration data is temporarily unavailable. Use the official source directly.", { area, location }, [sources.declarations]));
      const declarations = data.declarations ?? [];
      if (!declarations.length) return Response.json(payload(`No recent federal declarations were returned for ${area}.`, { area, location }, [sources.declarations]));
      return Response.json(payload(`These are the ${declarations.length} most recent federal disaster declarations returned for ${area}.`, { area, location }, [sources.declarations], declarations.slice(0, 5).map(item => ({ title: item.title, details: [item.declarationCode, item.incidentType, new Date(item.declarationDate).toLocaleDateString("en-US"), `Designated areas: ${item.designatedAreas.slice(0, 6).join(", ")}`, `Individual assistance: ${item.individualAssistance ? "Declared" : "Not declared"}`, `Public assistance: ${item.publicAssistance ? "Declared" : "Not declared"}`], url: item.sourceUrl }))));
    }

    if (!location) return Response.json(payload(`Please provide a city or postal code in ${area} so I can find nearby ${understood.intent === "shelter" ? "shelter records" : "recovery centers"}.`, { area, location: null }));

    if (understood.intent === "shelter") {
      const data = await readApi<{ shelters?: { name: string; address: string; city: string; state: string; postalCode: string; status: string; distanceMiles?: number; wheelchairAccessible: string; pets: string; phone: string | null; directionsUrl: string }[]; listingType?: string; searchedLocation?: string | null }>(request, "/api/disaster-shelters", { area, location });
      const shelters = data.shelters ?? [];
      if (!shelters.length) return Response.json(payload(`No FEMA shelter records were found near ${location}. Check the official source and local emergency management before traveling.`, { area, location }, [sources.shelters]));
      const typeMessage = data.listingType === "open" ? `confirmed open shelter record${shelters.length === 1 ? "" : "s"}` : `registered shelter location${shelters.length === 1 ? "" : "s"} that may be closed`;
      return Response.json(payload(`I found ${shelters.length} ${typeMessage} nearest to ${data.searchedLocation ?? location}. Verify status before traveling.`, { area, location }, [sources.shelters], shelters.slice(0, 5).map(item => ({ title: item.name, details: [[item.address, item.city, item.state, item.postalCode].filter(Boolean).join(", "), `Status: ${item.status}`, item.distanceMiles != null ? `Approximately ${item.distanceMiles} miles away` : "Distance unavailable", `Wheelchair access: ${item.wheelchairAccessible}`, `Pet accommodations: ${item.pets}`, item.phone ? `Phone: ${item.phone}` : "Phone not provided"], url: item.directionsUrl }))));
    }

    const data = await readApi<{ centers?: { name: string; type: string; address: string; status: string; distanceMiles?: number; schedule: { day: string; open: string; close: string }[]; directionsUrl: string }[]; searchedLocation?: string | null; unavailable?: boolean }>(request, "/api/disaster-recovery-centers", { area, location });
    if (data.unavailable) return Response.json(payload("FEMA recovery center data is temporarily unavailable. Use the official source directly.", { area, location }, [sources.recovery]));
    const centers = data.centers ?? [];
    if (!centers.length) return Response.json(payload(`No active FEMA recovery centers were returned near ${location}. Use the official locator for the latest information.`, { area, location }, [sources.recovery]));
    return Response.json(payload(`I found ${centers.length} active FEMA recovery center${centers.length === 1 ? "" : "s"} nearest to ${data.searchedLocation ?? location}. Confirm hours before traveling.`, { area, location }, [sources.recovery], centers.slice(0, 5).map(item => ({ title: item.name, details: [item.type, item.address, `Status: ${item.status}`, item.distanceMiles != null ? `Approximately ${item.distanceMiles} miles away` : "Distance unavailable", item.schedule.length ? `${item.schedule[0].day}: ${item.schedule[0].open} to ${item.schedule[0].close}` : "Hours not provided"], url: item.directionsUrl }))));
  } catch {
    return Response.json(payload("An official data service is temporarily unavailable. Please use the official source links and try again later.", { area, location }, Object.values(sources)), { status: 503 });
  }
}
