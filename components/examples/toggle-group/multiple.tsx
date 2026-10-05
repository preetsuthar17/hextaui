import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupMultiple() {
  return (
    <ToggleGroup
      multiple
      variant="outline"
      aria-label="Text formatting"
      defaultValue={["bold", "italic"]}
    >
      <ToggleGroupItem value="bold" aria-label="Bold">
        <IconBold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <IconItalic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <IconUnderline />
      </ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
        <IconStrikethrough />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
