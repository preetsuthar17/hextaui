"use client"

import { useSiteChromeMode } from "@/components/site/site-chrome"
import { useSitePathname } from "@/lib/i18n/client"

const framelessPrefixes = [
  "/docs",
  "/blocks/",
  "/preview/",
  "/account",
  "/tools/page-builder",
]

function FrameLines() {
  const pathname = useSitePathname()
  const mode = useSiteChromeMode()
  if (mode !== "site") return null
  if (framelessPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }
  return <div aria-hidden="true" className="frame-lines max-sm:hidden" />
}

export { FrameLines }
