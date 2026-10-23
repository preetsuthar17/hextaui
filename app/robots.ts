import type { MetadataRoute } from "next"

import {
  absoluteUrl,
  crawlAllowPaths,
  crawlDisallowPaths,
  siteUrl,
} from "@/lib/site"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: crawlAllowPaths,
      disallow: crawlDisallowPaths,
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  }
}
