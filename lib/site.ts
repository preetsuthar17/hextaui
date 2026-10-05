const siteName = "HextaUI"
const siteUrl = "https://hextaui.com"
const siteDescription = "Ready-to-use foundation components/blocks built on top of shadcn/ui."
const siteRepository = "https://github.com/preetsuthar17/hextaui"

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

export { absoluteUrl, siteDescription, siteName, siteRepository, siteUrl }
