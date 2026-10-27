import { apiError } from "@/lib/api-error"
import {
  decodeDoc,
  maxEncodedLength,
  type ProBlockInfo,
} from "@/lib/page-builder/doc"
import { exportPage, registryItem } from "@/lib/page-builder/export"

const builderUrl = "https://hextaui.com/tools/page-builder"

async function pageRegistryResponse(id: string, proBlocks: ProBlockInfo[]) {
  const encoded = id.replace(/\.json$/, "")
  if (encoded.length > maxEncodedLength + 1) {
    return apiError("bad_request", {
      error: "Page too large",
      detail: `This page link is ${encoded.length} characters; the limit is ${maxEncodedLength + 1}.`,
      resolution: `Remove a few sections in ${builderUrl} and copy the install command again.`,
    })
  }
  const doc = await decodeDoc(encoded, proBlocks)
  if (!doc || doc.sections.length === 0) {
    return apiError("bad_request", {
      error: "Invalid page",
      detail:
        "This page link could not be read. It may be cut off or from an older version of the builder.",
      resolution: `Open ${builderUrl}, compose the page again and copy the install command from Export.`,
    })
  }
  return Response.json(registryItem(exportPage(doc), encoded), {
    headers: {
      "cache-control": "public, max-age=86400",
      "access-control-allow-origin": "*",
    },
  })
}

export { pageRegistryResponse }
