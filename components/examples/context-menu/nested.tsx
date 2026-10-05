import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuNested() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-sm items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        Three levels deep
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Move to</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Inbox</ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger>Projects</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Acme</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Archive</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem>2024</ContextMenuItem>
                    <ContextMenuItem>2025</ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSub disabled>
              <ContextMenuSubTrigger disabled>Locked</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Hidden</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
