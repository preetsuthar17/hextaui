import {
  IconAlignCenter,
  IconAlignJustified,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupOutline() {
  return (
    <ToggleGroup
      variant="outline"
      aria-label="Text alignment"
      defaultValue={["left"]}
    >
      <ToggleGroupItem value="left" aria-label="Align left">
        <IconAlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <IconAlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <IconAlignRight />
      </ToggleGroupItem>
      <ToggleGroupItem value="justify" aria-label="Justify">
        <IconAlignJustified />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
