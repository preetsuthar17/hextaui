import { KbdGroup } from "@/components/ui/kbd"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function MenubarDemo() {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab
            <MenubarShortcut>
              <KbdGroup keys="mod+t" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window
            <MenubarShortcut>
              <KbdGroup keys="mod+n" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New incognito window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print…
            <MenubarShortcut>
              <KbdGroup keys="mod+p" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo
            <MenubarShortcut>
              <KbdGroup keys="mod+z" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo
            <MenubarShortcut>
              <KbdGroup keys="mod+shift+z" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Search the web</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Find…</MenubarItem>
              <MenubarItem>Find next</MenubarItem>
              <MenubarItem>Find previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Always show bookmarks bar</MenubarCheckboxItem>
          <MenubarCheckboxItem defaultChecked>
            Always show full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>
            Reload
            <MenubarShortcut>
              <KbdGroup keys="mod+r" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarItem inset disabled>
            Force reload
            <MenubarShortcut>
              <KbdGroup keys="mod+shift+r" variant="flat" size="sm" />
            </MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Toggle full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Switch profile</MenubarLabel>
            <MenubarRadioGroup defaultValue="mira">
              <MenubarRadioItem value="jun">Jun</MenubarRadioItem>
              <MenubarRadioItem value="mira">Mira</MenubarRadioItem>
              <MenubarRadioItem value="sol">Sol</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit…</MenubarItem>
          <MenubarItem inset>Add profile…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
