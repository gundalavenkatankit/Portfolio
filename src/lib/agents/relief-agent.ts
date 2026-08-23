import { InferAgentUIMessage, isStepCount, tool, ToolLoopAgent } from "ai";
import { z } from "zod";

const areaSchema = z.string().length(2).transform(value => value.toUpperCase());

async function readApi<T>(url: URL): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`ReliefReady data service returned ${response.status}`);
  return response.json() as Promise<T>;
}

export function createReliefAgent(baseUrl: string) {
  return new ToolLoopAgent({
    model: "openai/gpt-5.6-luna",
    stopWhen: isStepCount(6),
    instructions: `You are the ReliefReady assistant for United States disaster information.

Answer only from the official data returned by your tools. Use a tool whenever a question asks about current alerts, declarations, shelters, recovery centers, or a location. Never invent a status, distance, capacity, deadline, phone number, or eligibility rule. If a service is unavailable or the data does not answer the question, say so plainly and direct the user to the official source.

Keep answers concise and practical. Distinguish confirmed open shelters from registered locations that may be closed. Tell users to verify shelter and recovery center status before traveling. For immediate danger, tell the user to call 911 and follow local emergency officials. This portfolio project does not replace emergency instructions.

When a location is ambiguous, ask for a city and state or postal code. When reporting tool results, name the official source. Do not answer unrelated general knowledge questions. Explain that you can help with ReliefReady disaster resources instead.`,
    tools: {
      getActiveAlerts: tool({
        description: "Get current National Weather Service alerts for a United States state or territory code.",
        inputSchema: z.object({ area: areaSchema.describe("Two letter state or territory code") }),
        execute: async ({ area }) => {
          const url = new URL("/api/disaster-alerts", baseUrl);
          url.searchParams.set("area", area);
          const data = await readApi<{ alerts?: unknown[]; source?: string; unavailable?: boolean }>(url);
          return { ...data, alerts: (data.alerts ?? []).slice(0, 8), officialSource: `https://www.weather.gov/alerts/${area.toLowerCase()}.html` };
        },
      }),
      getDisasterDeclarations: tool({
        description: "Get recent FEMA disaster declarations and assistance programs for a United States state or territory code.",
        inputSchema: z.object({ area: areaSchema.describe("Two letter state or territory code") }),
        execute: async ({ area }) => {
          const url = new URL("/api/disaster-declarations", baseUrl);
          url.searchParams.set("area", area);
          const data = await readApi<{ declarations?: unknown[]; source?: string; unavailable?: boolean }>(url);
          return { ...data, declarations: (data.declarations ?? []).slice(0, 8), officialSource: "https://www.fema.gov/disaster/declarations" };
        },
      }),
      findShelters: tool({
        description: "Find FEMA shelter records nearest to a city or postal code within a state. Results may be open shelters or registered locations.",
        inputSchema: z.object({
          area: areaSchema.describe("Two letter state or territory code"),
          location: z.string().min(2).max(100).describe("City, postal code, or location text"),
        }),
        execute: async ({ area, location }) => {
          const url = new URL("/api/disaster-shelters", baseUrl);
          url.searchParams.set("area", area);
          url.searchParams.set("location", location);
          const data = await readApi<{ shelters?: unknown[]; listingType?: string; searchedLocation?: string | null; source?: string }>(url);
          return { ...data, shelters: (data.shelters ?? []).slice(0, 8), officialSource: "https://www.disasterassistance.gov/information/immediate-needs/emergency-shelter" };
        },
      }),
      findRecoveryCenters: tool({
        description: "Find active FEMA Disaster Recovery Centers nearest to a city or postal code within a state.",
        inputSchema: z.object({
          area: areaSchema.describe("Two letter state or territory code"),
          location: z.string().min(2).max(100).describe("City, postal code, or location text"),
        }),
        execute: async ({ area, location }) => {
          const url = new URL("/api/disaster-recovery-centers", baseUrl);
          url.searchParams.set("area", area);
          url.searchParams.set("location", location);
          const data = await readApi<{ centers?: unknown[]; searchedLocation?: string | null; source?: string; unavailable?: boolean }>(url);
          return { ...data, centers: (data.centers ?? []).slice(0, 8), officialSource: "https://egateway.fema.gov/ESF6/DRCLocator" };
        },
      }),
      resolveLocation: tool({
        description: "Resolve a United States city, postal code, or address to a state and coordinates before searching other services.",
        inputSchema: z.object({ query: z.string().min(2).max(100) }),
        execute: async ({ query }) => {
          const url = new URL("/api/disaster-location", baseUrl);
          url.searchParams.set("query", query);
          return readApi<{ location?: unknown; unavailable?: boolean }>(url);
        },
      }),
    },
  });
}

export type ReliefAgentMessage = InferAgentUIMessage<ReturnType<typeof createReliefAgent>>;
