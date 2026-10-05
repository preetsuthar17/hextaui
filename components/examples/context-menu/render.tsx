import { IconDownload, IconLink } from "@tabler/icons-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuRender() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        render={<figure />}
        className="flex w-full max-w-xs flex-col gap-2 rounded-xl border p-3"
      >
        <div className="h-28 rounded-lg bg-muted" />
        <figcaption className="text-sm text-muted-foreground">
          Trigger rendered as a figure
        </figcaption>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <IconDownload />
          Save image
        </ContextMenuItem>
        <ContextMenuItem render={<a href="#render-as-another-element" />}>
          <IconLink />
          Link item
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
