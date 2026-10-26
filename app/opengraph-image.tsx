import { getOgPages } from "@/lib/og-pages"
import { renderOgImage } from "@/lib/opengraph-image"

export const dynamic = "force-static"

export const alt = "HextaUI — React components and blocks for shadcn/ui"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default function Image() {
  const home = getOgPages().find((page) => page.path === "/")
  if (!home) throw new Error("og: no image for the home page")
  return renderOgImage(home.image)
}
