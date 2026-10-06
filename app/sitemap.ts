import type { MetadataRoute } from "next"

import { legalPages } from "@/components/legal/legal-page"
import { docsNav } from "@/lib/docs"
import { proBlocks } from "@/lib/pro/catalog"
import { absoluteUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = docsNav.flatMap((section) => section.items)

  return [
    { url: absoluteUrl("/"), priority: 1 },
    { url: absoluteUrl("/components"), priority: 0.8 },
    { url: absoluteUrl("/blocks"), priority: 0.6 },
    ...proBlocks.map((block) => ({
      url: absoluteUrl(`/blocks/${block.name}`),
      priority: 0.6,
    })),
    ...docs.map((item) => ({ url: absoluteUrl(item.href), priority: 0.7 })),
    ...legalPages.map((page) => ({
      url: absoluteUrl(page.href),
      priority: 0.2,
    })),
  ]
}
