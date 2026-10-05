import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuHoldFeedback() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Press and hold
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger
          holdFeedback={false}
          className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground"
        >
          No hold feedback
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
