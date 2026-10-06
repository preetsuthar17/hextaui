"use client"

import { usePathname } from "next/navigation"

function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return pathname.startsWith("/preview/") ? null : children
}

export { SiteChrome }
