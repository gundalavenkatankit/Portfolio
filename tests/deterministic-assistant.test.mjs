import assert from "node:assert/strict";
import test from "node:test";
import { detectDisasterIntent, extractLocationQuery, extractStateCode, understandDisasterQuestion } from "../src/lib/deterministic-assistant.mjs";

test("detects each supported disaster question type", () => {
  assert.equal(detectDisasterIntent("Are there weather alerts in Texas?"), "alert");
  assert.equal(detectDisasterIntent("Find a shelter near 98121"), "shelter");
  assert.equal(detectDisasterIntent("Was a federal disaster declared in Florida?"), "declaration");
  assert.equal(detectDisasterIntent("Find a FEMA recovery center near Asheville"), "recovery");
  assert.equal(detectDisasterIntent("Someone is in immediate danger"), "emergency");
});

test("extracts state names, state codes, and postal codes", () => {
  assert.equal(extractStateCode("Find shelters in Washington"), "WA");
  assert.equal(extractStateCode("Are there alerts in TX?"), "TX");
  assert.equal(extractLocationQuery("Find shelters near 98121 in Washington"), "98121");
  assert.equal(extractLocationQuery("Find a recovery center near Asheville, North Carolina"), "Asheville, North Carolina");
});

test("retains useful context for follow up questions", () => {
  assert.deepEqual(understandDisasterQuestion("What declarations are active?", { area: "FL", location: "33101" }), { intent: "declaration", area: "FL", location: "33101" });
});

test("rejects unsupported general questions", () => {
  assert.equal(detectDisasterIntent("Who won the baseball game?"), "unknown");
});
