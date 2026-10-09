import type { MetadataRoute } from "next"

import { absoluteUrl, crawlDisallowPaths, siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: crawlDisallowPaths,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  }
}
