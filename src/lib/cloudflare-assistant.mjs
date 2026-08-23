const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct";

function compactGrounding(data) {
  return {
    existingAnswer: data.answer,
    context: data.context,
    results: (data.results ?? []).slice(0, 5).map(result => ({
      title: result.title,
      details: result.details.map(detail => detail.slice(0, 280)),
    })),
    sources: (data.sources ?? []).map(source => source.name),
  };
}

export async function enhanceGroundedAnswer({ question, data, accountId, apiToken, fetchImpl = fetch }) {
  if (!accountId || !apiToken || !question || !data?.answer) return { answer: data?.answer, mode: "deterministic" };
  if (data.answer.startsWith("Call 911")) return { answer: data.answer, mode: "deterministic" };

  const response = await fetchImpl(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${DEFAULT_MODEL}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are ReliefReady, a disaster resource assistant. Rewrite the existing answer in clear, calm plain text using only the supplied grounding. Never add facts, locations, status, availability, eligibility, distances, dates, instructions, or links. Never imply that a registered shelter is open unless the grounding explicitly says confirmed open. Preserve warnings to verify information and follow local officials. Do not use markdown. Keep the response under 90 words.",
          },
          {
            role: "user",
            content: JSON.stringify({ question, grounding: compactGrounding(data) }),
          },
        ],
        max_tokens: 180,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!response.ok) throw new Error(`Cloudflare Workers AI returned ${response.status}`);
  const cloudflare = await response.json();
  const answer = cloudflare?.result?.response?.trim();
  if (!answer || answer.length > 1200) throw new Error("Cloudflare Workers AI returned an invalid answer");
  return { answer, mode: "ai" };
}
