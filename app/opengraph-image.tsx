import { homeOgImage } from "@/lib/og-home"
import { renderOgImage } from "@/lib/opengraph-image"

export const dynamic = "force-static"

export const alt = "HextaUI — React components and blocks for shadcn/ui"

export const size = { width: 1200, height: 630 }

export const contentType = "image/png"

export default function Image() {
  return renderOgImage(homeOgImage)
}
