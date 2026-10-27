import { isAppToolPath } from "@/lib/tools"

type SiteChromeMode = "site" | "app" | "bare"

function getSiteChromeMode(pathname: string): SiteChromeMode {
  if (pathname.startsWith("/preview/")) return "bare"
  if (isAppToolPath(pathname.replace(/\/$/, ""))) return "app"
  return "site"
}

export { getSiteChromeMode, type SiteChromeMode }
