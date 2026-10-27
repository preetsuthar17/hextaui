import { apiError } from "@/lib/api-error"
import { siteUrl } from "@/lib/site"
import { buildThemeItem, themeEditorPath } from "@/lib/theme-editor/registry"

type Context = {
  params: { id: string }
}

export async function onRequestGet({ params }: Context) {
  const result = buildThemeItem(String(params.id))
  if (!result.ok) {
    return apiError("bad_request", {
      error: "Invalid theme id",
      detail: result.detail,
      resolution: `Make a theme at ${siteUrl}${themeEditorPath} and copy its install command.`,
    })
  }

  return Response.json(result.item, {
    headers: {
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*",
    },
  })
}
