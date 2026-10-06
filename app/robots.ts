import type { MetadataRoute } from "next"

import { absoluteUrl, noindexPaths, siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: noindexPaths,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  }
}
