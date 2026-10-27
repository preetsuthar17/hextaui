import { proBlocks } from "@/lib/pro/catalog"
import type { ProBlockInfo } from "@/lib/page-builder/doc"

function getProSections(): ProBlockInfo[] {
  return proBlocks
    .filter((block) => !block.free)
    .map((block) => ({
      name: block.name,
      title: block.title,
      category: block.category,
    }))
}

export { getProSections }
