import { IconFile } from "@tabler/icons-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuLongContent() {
  return (
    <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Long labels
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>
            A label that goes on for much longer than any menu label should
          </ContextMenuLabel>
          <ContextMenuItem>
            <IconFile />
            Move to “Supercalifragilisticexpialidocious project archive 2026”
            <ContextMenuShortcut>⌥⌘M</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            https://example.com/a/really/long/url/without/any/spaces/at/all/in/it
          </ContextMenuItem>
          <ContextMenuItem>مرحبا بالعالم — mixed العربية text</ContextMenuItem>
          <ContextMenuItem>👩‍👩‍👧‍👦 Family 日本語のテキスト</ContextMenuItem>
          <ContextMenuItem>Short</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          40 items
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Recent</ContextMenuLabel>
            {Array.from({ length: 40 }, (_, index) => (
              <ContextMenuItem key={index}>
                Document {index + 1}
              </ContextMenuItem>
            ))}
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
