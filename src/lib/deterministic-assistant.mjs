const states = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY", "District of Columbia": "DC", "Puerto Rico": "PR",
};

const stateCodes = new Set(Object.values(states));

export function detectDisasterIntent(question) {
  const text = question.toLowerCase();
  if (/\b(911|immediate danger|life threatening|life-threatening|emergency now)\b/.test(text)) return "emergency";
  if (/\b(recovery cent(?:er|re)s?|drc|fema centers?)\b/.test(text)) return "recovery";
  if (/\b(shelters?|evacuation cent(?:er|re)s?|safe places?)\b/.test(text)) return "shelter";
  if (/\b(declarations?|declared|federal disasters?|fema disasters?|assistance programs?)\b/.test(text)) return "declaration";
  if (/\b(alerts?|warnings?|watches|weather|tornado(?:es)?|hurricanes?|floods?|storms?|wildfires?)\b/.test(text)) return "alert";
  if (/\b(what can you|how can you|help me|data sources|what do you know)\b/.test(text)) return "capabilities";
  return "unknown";
}

export function extractStateCode(question) {
  for (const [name, code] of Object.entries(states).sort(([a], [b]) => b.length - a.length)) {
    if (new RegExp(`\\b${name.replace(" ", "\\s+")}\\b`, "i").test(question)) return code;
  }
  const codes = question.match(/\b[A-Z]{2}\b/g) ?? [];
  return codes.find(code => stateCodes.has(code)) ?? null;
}

export function extractLocationQuery(question) {
  const postalCode = question.match(/\b\d{5}\b/)?.[0];
  if (postalCode) return postalCode;
  const match = question.match(/\b(?:near|around|at|in)\s+([^?]+)$/i);
  return match?.[1]?.trim().replace(/\s+(?:right now|today|currently)$/i, "") ?? null;
}

export function understandDisasterQuestion(question, previousContext = {}) {
  return { intent: detectDisasterIntent(question), area: extractStateCode(question) ?? previousContext.area ?? null, location: extractLocationQuery(question) ?? previousContext.location ?? null };
}
