"use client"

import { useSitePathname } from "@/lib/i18n/client"
import { getSiteChromeMode, type SiteChromeMode } from "@/lib/site-chrome"

function useSiteChromeMode() {
  return getSiteChromeMode(useSitePathname())
}

function SiteChrome({
  modes = ["site"],
  children,
}: {
  modes?: SiteChromeMode[]
  children: React.ReactNode
}) {
  const mode = useSiteChromeMode()
  return modes.includes(mode) ? children : null
}

function SiteFrame({ children }: { children: React.ReactNode }) {
  const mode = useSiteChromeMode()
  return (
    <div data-chrome={mode} className="flex min-h-svh flex-col">
      {children}
    </div>
  )
}

export { SiteChrome, SiteFrame, useSiteChromeMode }
