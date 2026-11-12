import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Signed-in pages have nothing for a crawler and redirect to sign-in anyway.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/review", "/settings", "/subscribe", "/onboarding"] }, sitemap: `${SITE.url}/sitemap.xml` };
}
