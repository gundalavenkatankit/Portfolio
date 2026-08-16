import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
const samples = ["98001", "98121", "99201", "99403", "83856"];

for (const postalCode of samples) {
  const response = await fetch(`${baseUrl}/api/disaster-shelters?area=WA&location=${postalCode}`);
  assert.equal(response.ok, true, `${postalCode} returned HTTP ${response.status}`);
  const data = await response.json();
  assert.ok(data.searchedLocation, `${postalCode} was not recognized by the location service`);
  assert.ok(data.shelters.length > 0, `${postalCode} returned no FEMA shelter records`);
  assert.equal(typeof data.shelters[0].distanceMiles, "number", `${postalCode} returned no distance`);
  console.log(`${postalCode}: ${data.shelters.length} shelters, nearest ${data.shelters[0].distanceMiles} miles`);
}
