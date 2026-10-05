import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ContextMenuInSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inside a sheet</SheetTitle>
          <SheetDescription>
            The menu layers above the sheet and Escape closes only the menu.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <ContextMenu>
            <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
