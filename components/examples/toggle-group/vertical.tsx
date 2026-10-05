import { IconLayoutGrid, IconLayoutList, IconList } from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupVertical() {
  return (
    <ToggleGroup
      orientation="vertical"
      variant="outline"
      aria-label="Layout"
      defaultValue={["grid"]}
    >
      <ToggleGroupItem value="grid" aria-label="Grid">
        <IconLayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="cards" aria-label="Cards">
        <IconLayoutList />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List">
        <IconList />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
