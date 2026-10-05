import { IconBold, IconUnderline } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDisabled() {
  return (
    <div className="flex items-center gap-2">
      <Toggle disabled aria-label="Bold">
        <IconBold />
      </Toggle>
      <Toggle disabled defaultPressed aria-label="Underline">
        <IconUnderline />
      </Toggle>
      <Toggle disabled variant="outline">
        Read-only mode
      </Toggle>
    </div>
  )
}
