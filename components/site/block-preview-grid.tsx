"use client"

import { BlockCard } from "@/components/site/block-card"
import { track } from "@/lib/track"

function BlockPreviewGrid({
  blocks,
  event,
}: {
  blocks: { name: string; title: string }[]
  event?: { name: string; from: string }
}) {
  return (
    <ul
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      onClick={(clickEvent) => {
        if (!event || !(clickEvent.target instanceof Element)) return
        const href = clickEvent.target.closest("a")?.getAttribute("href")
        if (href) track(event.name, { from: event.from, to: href })
      }}
    >
      {blocks.map((block) => (
        <BlockCard
          key={block.name}
          name={block.name}
          title={block.title}
          tile
        />
      ))}
    </ul>
  )
}

export { BlockPreviewGrid }
