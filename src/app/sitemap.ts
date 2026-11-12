import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/practice", "/learn", "/sign-up", "/privacy", "/terms", "/refunds"].map((path) => ({ url: `${SITE.url}${path}` }));
}
