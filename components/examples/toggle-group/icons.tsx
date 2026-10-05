import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupIcons() {
  return (
    <ToggleGroup aria-label="Theme" defaultValue={["system"]}>
      <ToggleGroupItem value="light">
        <IconSun />
        Light
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <IconMoon />
        Dark
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <IconDeviceDesktop />
        System
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
