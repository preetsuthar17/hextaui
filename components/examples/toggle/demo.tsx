import { IconBold, IconItalic, IconUnderline } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Bold" defaultPressed>
        <IconBold />
      </Toggle>
      <Toggle aria-label="Italic">
        <IconItalic />
      </Toggle>
      <Toggle aria-label="Underline">
        <IconUnderline />
      </Toggle>
    </div>
  )
}
