export type CivicService = { icon: string; title: string; description: string; href: string; group: string; summary?: string; actions?: string[] };

export const services: CivicService[] = [
  { icon: "P", title: "Parking permits", description: "Apply for resident and visitor parking permits.", href: "/civicconnect/services/parking-permits", group: "Transportation" },
  { icon: "$", title: "Pay a bill", description: "Pay utilities, fees, and city invoices securely.", href: "/civicconnect/services/pay-a-bill", group: "Utilities", summary: "View common city charges and choose a secure payment path.", actions: ["Water and sewer bill", "Property tax bill", "Parking citation", "City invoice"] },
  { icon: "!", title: "Report an issue", description: "Tell us about a street, sanitation, or safety concern.", href: "/civicconnect/report", group: "Public safety" },
  { icon: "T", title: "Trash schedule", description: "Find collection dates and recycling guidance.", href: "/civicconnect/services/trash-schedule", group: "Trash and recycling", summary: "Enter an address to see the next trash, recycling, and yard waste collection dates.", actions: ["View collection calendar", "Check accepted materials", "Request a new cart", "Report a missed pickup"] },
  { icon: "B", title: "Business license", description: "Start or renew a license for your business.", href: "/civicconnect/services/business-license", group: "Business services", summary: "Understand license requirements, prepare your documents, and begin an application.", actions: ["Find a license type", "Start an application", "Renew a license", "Search active licenses"] },
  { icon: "G", title: "Business services", description: "Find guidance, permits, programs, and city resources for businesses.", href: "/civicconnect/services/business-services", group: "Business services", summary: "Find the city resources you need to start, operate, and grow a business.", actions: ["Start a business", "Find permits", "Explore support programs", "Work with the city"] },
  { icon: "H", title: "Housing support", description: "Explore rental, housing, and assistance programs.", href: "/civicconnect/services/housing-support", group: "Housing", summary: "Find rental assistance, housing counseling, and emergency support in one place.", actions: ["Rental assistance", "Housing counseling", "Home repair support", "Emergency shelter"] },
  { icon: "R", title: "Find parks and recreation", description: "Explore parks, playgrounds, facilities, and programs.", href: "/civicconnect/services/parks-and-recreation", group: "Parks and recreation", summary: "Browse public spaces and discover recreation options by location and amenity.", actions: ["Find a park", "Explore playgrounds", "Browse recreation programs", "Reserve a facility"] },
  { icon: "S", title: "Public safety information", description: "View safety resources and public incident information.", href: "/civicconnect/services/public-safety", group: "Public safety", summary: "Access nonemergency resources and understand public safety activity in your community.", actions: ["View safety resources", "Explore incident information", "Find a police station", "Prepare for emergencies"] },
  { icon: "C", title: "Request city records", description: "Find records and learn how to submit a public request.", href: "/civicconnect/services/city-records", group: "City records", summary: "Search frequently requested records or prepare a public records request.", actions: ["Search published records", "Request a public record", "Find meeting documents", "View city datasets"] },
  { icon: "D", title: "Explore public data", description: "Review trusted datasets used to inform this prototype.", href: "/civicconnect/data", group: "City records" },
];

export const categories = [
  "Transportation",
  "Parking",
  "Trash and recycling",
  "Utilities",
  "Permits and licenses",
  "Housing",
  "Public safety",
  "Health and community",
  "Parks and recreation",
  "Business services",
  "Property",
  "City records",
];

export const serviceDetails = Object.fromEntries(services.filter(service => service.summary).map(service => [service.href.split("/").at(-1), service])) as Record<string, CivicService>;

export const publicDataSources = [
  { category: "Parks and recreation", title: "NYC Parks Active and Passive Recreation", description: "Public open spaces with recreation category, acreage, location, and active or passive use information.", publisher: "NYC Open Data", url: "https://data.cityofnewyork.us/Recreation/NYC-Parks-Active-and-Passive-Recreation-Map/s9bk-jdih", fields: ["Park name", "Recreation category", "Acres", "Location"] },
  { category: "Business services", title: "Business Licenses", description: "License records including business name, address, license type, application type, and status.", publisher: "City of Chicago", url: "https://data.cityofchicago.org/Community-Economic-Development/Business-Licenses/r5kz-chrr/data", fields: ["Business name", "License type", "Status", "Expiration"] },
  { category: "Public safety", title: "APD 911 Calls for Service", description: "Informational records for calls received through 911, excluding duplicate and transferred incidents.", publisher: "City of Austin", url: "https://data.austintexas.gov/Public-Safety/APD-911-Calls-for-Service-2023-2026/e687-fx2y", fields: ["Incident type", "Response date", "Location area", "Disposition"] },
  { category: "City records", title: "Facilities Database", description: "Locations and types of public and community facilities used for neighborhood planning.", publisher: "NYC Open Data", url: "https://data.cityofnewyork.us/City-Government/Facilities-Database-Shapefile/2fpa-bnsx/about", fields: ["Facility name", "Facility type", "Agency", "Location"] },
];
