import { createAgentUIStreamResponse, UIMessage } from "ai";
import { createReliefAgent } from "@/lib/agents/relief-agent";

export const maxDuration = 30;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 50000) return Response.json({ error: "Request is too large" }, { status: 413 });

  const body = await request.json().catch(() => null) as { messages?: UIMessage[] } | null;
  if (!body?.messages || !Array.isArray(body.messages) || body.messages.length > 24) {
    return Response.json({ error: "A valid conversation is required" }, { status: 400 });
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const baseUrl = productionHost ? `https://${productionHost}` : new URL(request.url).origin;

  return createAgentUIStreamResponse({
    agent: createReliefAgent(baseUrl),
    uiMessages: body.messages,
    abortSignal: request.signal,
    timeout: { totalMs: 28000 },
    onError: () => "The ReliefReady assistant could not complete this request. Please use the official source links on this page.",
  });
}
