import { getMarkdownCatalog } from "@/lib/md/llms"
import { siteName, siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export async function GET() {
  const routes = await getMarkdownCatalog()
  return Response.json({
    site: siteName,
    url: siteUrl,
    count: routes.length,
    routes: routes.map(({ path, url, markdown, title, summary, section }) => ({
      path,
      url,
      markdown,
      title,
      summary,
      section,
    })),
  })
}
