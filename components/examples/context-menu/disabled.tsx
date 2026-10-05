import { IconTrash } from "@tabler/icons-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuDisabled() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <ContextMenu disabled>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Disabled menu
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Never shown</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Disabled items
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Enabled</ContextMenuItem>
          <ContextMenuItem disabled>Disabled item</ContextMenuItem>
          <ContextMenuItem variant="destructive" disabled>
            <IconTrash />
            Disabled destructive
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
