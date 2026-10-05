import { IconBookmark, IconHeart, IconStar } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleFilledIcon() {
  return (
    <div className="flex items-center gap-1">
      <Toggle aria-label="Like" defaultPressed>
        <IconHeart className="group-data-pressed/toggle:fill-current" />
      </Toggle>
      <Toggle aria-label="Star">
        <IconStar className="group-data-pressed/toggle:fill-current" />
      </Toggle>
      <Toggle aria-label="Save">
        <IconBookmark className="group-data-pressed/toggle:fill-current" />
      </Toggle>
    </div>
  )
}
