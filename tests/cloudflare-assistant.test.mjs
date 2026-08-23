import assert from "node:assert/strict";
import test from "node:test";
import { enhanceGroundedAnswer } from "../src/lib/cloudflare-assistant.mjs";

const groundedData = {
  answer: "One registered shelter location was found. Verify status before traveling.",
  context: { area: "WA", location: "98121" },
  sources: [{ name: "FEMA ESF 6 Shelter System", url: "https://example.gov" }],
  results: [{ title: "Example shelter", details: ["Status: CLOSED"] }],
};

test("uses the deterministic answer when Cloudflare credentials are missing", async () => {
  const result = await enhanceGroundedAnswer({ question: "Find a shelter", data: groundedData });
  assert.deepEqual(result, { answer: groundedData.answer, mode: "deterministic" });
});

test("returns a grounded Cloudflare response without exposing credentials in the prompt", async () => {
  let request;
  const fetchImpl = async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ result: { response: "One registered location was found. Confirm its status before traveling." } }) };
  };
  const result = await enhanceGroundedAnswer({ question: "Find a shelter", data: groundedData, accountId: "account", apiToken: "secret", fetchImpl });
  assert.equal(result.mode, "ai");
  assert.equal(result.answer, "One registered location was found. Confirm its status before traveling.");
  assert.equal(request.options.headers.Authorization, "Bearer secret");
  assert.doesNotMatch(request.options.body, /secret/);
});

test("keeps emergency instructions deterministic", async () => {
  let called = false;
  const result = await enhanceGroundedAnswer({ question: "Help", data: { ...groundedData, answer: "Call 911 now." }, accountId: "account", apiToken: "secret", fetchImpl: async () => { called = true; } });
  assert.equal(result.mode, "deterministic");
  assert.equal(called, false);
});
