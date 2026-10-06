"use client"

import { previews } from "@/lib/pro/generated/previews"

function BlockPreview({ name }: { name: string }) {
  const Block = previews[name]
  return Block ? <Block /> : null
}

export { BlockPreview }
