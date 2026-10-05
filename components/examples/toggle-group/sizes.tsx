import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleGroupSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup
          key={size}
          multiple
          size={size}
          variant="outline"
          aria-label={`Formatting, ${size}`}
          defaultValue={["bold"]}
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
        </ToggleGroup>
      ))}
    </div>
  )
}
