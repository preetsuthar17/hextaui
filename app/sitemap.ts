import type { MetadataRoute } from "next"

import { docsNav } from "@/lib/docs"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = docsNav.flatMap((section) => section.items)

  return [
    { url: absoluteUrl("/"), priority: 1 },
    { url: absoluteUrl("/components"), priority: 0.8 },
    ...docs.map((item) => ({ url: absoluteUrl(item.href), priority: 0.7 })),
  ]
}
