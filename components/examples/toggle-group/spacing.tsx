import { IconStar } from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupSpacing() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ToggleGroup spacing={1} aria-label="Rating filter" defaultValue={["4"]}>
        {["1", "2", "3", "4", "5"].map((stars) => (
          <ToggleGroupItem key={stars} value={stars}>
            {stars}
            <IconStar />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ToggleGroup
        multiple
        spacing={2}
        variant="outline"
        size="sm"
        aria-label="Topics"
        defaultValue={["design"]}
      >
        <ToggleGroupItem value="design">Design</ToggleGroupItem>
        <ToggleGroupItem value="engineering">Engineering</ToggleGroupItem>
        <ToggleGroupItem value="research">Research</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
