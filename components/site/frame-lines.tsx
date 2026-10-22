"use client"

import { useSitePathname } from "@/lib/i18n/client"

const framelessPrefixes = ["/docs", "/blocks/", "/preview/", "/account"]

function FrameLines() {
  const pathname = useSitePathname()
  if (framelessPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null
  }
  return <div aria-hidden="true" className="frame-lines max-sm:hidden" />
}

export { FrameLines }
