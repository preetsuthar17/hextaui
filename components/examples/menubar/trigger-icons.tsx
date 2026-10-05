import {
  IconAdjustmentsHorizontal,
  IconDots,
  IconFolder,
  IconLayoutGrid,
  IconPencil,
} from "@tabler/icons-react"

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarTriggerIcons() {
  return (
    <Menubar aria-label="Project">
      <MenubarMenu>
        <MenubarTrigger>
          <IconFolder />
          Project
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Open…</MenubarItem>
          <MenubarItem>Duplicate</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <IconPencil />
          Edit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Rename</MenubarItem>
          <MenubarItem>Move</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <IconLayoutGrid />
          View
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Grid</MenubarItem>
          <MenubarItem>List</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger aria-label="More">
          <IconDots />
        </MenubarTrigger>
        <MenubarContent align="end">
          <MenubarItem>
            <IconAdjustmentsHorizontal />
            Preferences
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Delete project</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
