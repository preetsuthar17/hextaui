"use client"

import * as React from "react"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function ContextMenuDemo() {
  const [bookmarks, setBookmarks] = React.useState(true)
  const [urls, setUrls] = React.useState(false)
  const [person, setPerson] = React.useState("pedro")
  const [last, setLast] = React.useState("Nothing yet")

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset onClick={() => setLast("Back")}>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset onClick={() => setLast("Reload")}>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>More tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem onClick={() => setLast("Save page")}>
                Save page as…
                <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setLast("Create shortcut")}>
                Create shortcut…
              </ContextMenuItem>
              <ContextMenuItem onClick={() => setLast("Name window")}>
                Name window…
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => setLast("Developer tools")}>
                Developer tools
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={bookmarks}
            onCheckedChange={setBookmarks}
          >
            Show bookmarks bar
            <ContextMenuShortcut>⇧⌘B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
            Show full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuLabel inset>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <p className="text-sm text-muted-foreground">Last action: {last}</p>
    </div>
  )
}
