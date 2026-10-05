import { IconBookmark } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleOutline() {
  return (
    <div className="flex items-center gap-2">
      <Toggle variant="outline" aria-label="Bookmark">
        <IconBookmark />
      </Toggle>
      <Toggle variant="outline">
        <IconBookmark />
        Bookmark
      </Toggle>
    </div>
  )
}
