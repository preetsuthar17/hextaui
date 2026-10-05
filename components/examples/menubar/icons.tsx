import {
  IconCopy,
  IconDownload,
  IconFilePlus,
  IconFolderOpen,
  IconScissors,
  IconTrash,
} from "@tabler/icons-react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarIcons() {
  return (
    <Menubar aria-label="Files">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconFilePlus />
            New file
            <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconFolderOpen />
            Open…
            <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconDownload />
            Export
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <IconTrash />
            Move to trash
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <IconScissors />
            Cut
            <MenubarShortcut>⌘X</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <IconCopy />
            Copy
            <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
