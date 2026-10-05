import { IconBold } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Toggle size="sm" aria-label="Bold, small">
          <IconBold />
        </Toggle>
        <Toggle aria-label="Bold">
          <IconBold />
        </Toggle>
        <Toggle size="lg" aria-label="Bold, large">
          <IconBold />
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle size="sm" variant="outline">
          Small
        </Toggle>
        <Toggle variant="outline">Default</Toggle>
        <Toggle size="lg" variant="outline">
          Large
        </Toggle>
      </div>
    </div>
  )
}
