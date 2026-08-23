import type { MetadataRoute } from "next";

const siteUrl = "https://venkat-ankit-gundala-portfolio.vercel.app";

const routes = [
  "",
  "/work/civicconnect",
  "/work/reliefready",
  "/civicconnect",
  "/civicconnect/services",
  "/civicconnect/services/parking-permits",
  "/civicconnect/report",
  "/disaster-resource-coordinator",
  "/disaster-resource-coordinator/assistant",
  "/disaster-resource-coordinator/my-area",
  "/disaster-resource-coordinator/shelters",
  "/disaster-resource-coordinator/declarations",
  "/disaster-resource-coordinator/recovery-centers",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route, index) => ({
    url: `${siteUrl}${route}`,
    lastModified: "2026-08-23",
    changeFrequency: index === 0 ? "monthly" : "yearly",
    priority: index === 0 ? 1 : route.startsWith("/work/") ? 0.9 : 0.7,
  }));
}
