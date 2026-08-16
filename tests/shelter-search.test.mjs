import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { buildGeocodeQuery, isPostalCode, rankNearestShelters } from "../src/lib/shelter-search.mjs";

const workbookPath = process.env.WASHINGTON_ZIP_WORKBOOK ?? "/Users/ankit/Downloads/washington_716_zip_codes.xlsx";

function readPostalCodes(path) {
  const xml = execFileSync("unzip", ["-p", path, "xl/worksheets/sheet1.xml"], { encoding: "utf8" });
  return [...xml.matchAll(/<x:c r="A(\d+)"[^>]*>.*?<x:v>(.*?)<\/x:v><\/x:c>/g)]
    .filter(match => Number(match[1]) > 1)
    .map(match => match[2]);
}

test("all workbook postal codes enter the postal search path", { skip: !existsSync(workbookPath) }, () => {
  const postalCodes = readPostalCodes(workbookPath);
  assert.equal(postalCodes.length, 716);
  assert.equal(new Set(postalCodes).size, 716);
  for (const postalCode of postalCodes) {
    assert.equal(isPostalCode(postalCode), true, `${postalCode} must be accepted as a postal code`);
    assert.equal(buildGeocodeQuery(postalCode, "WA"), `${postalCode}, United States`);
  }
});

test("98121 ranks valid FEMA geometry from nearest to farthest", () => {
  const shelters = [
    { id: 2, latitude: 47.6608, longitude: -117.4125 },
    { id: 1, latitude: 47.6909, longitude: -120.2078 },
    { id: 3, latitude: null, longitude: null },
  ];
  const ranked = rankNearestShelters(shelters, { latitude: 47.6152, longitude: -122.3493 });
  assert.deepEqual(ranked.map(shelter => shelter.id), [1, 2]);
  assert.ok(ranked[0].distanceMiles < ranked[1].distanceMiles);
});

test("city searches retain the selected state", () => {
  assert.equal(buildGeocodeQuery("Seattle", "WA"), "Seattle, WA, United States");
});
