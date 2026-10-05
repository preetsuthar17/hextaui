import { IconItalic, IconTextWrap } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleText() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle>
        <IconItalic />
        Italic
      </Toggle>
      <Toggle variant="outline" defaultPressed>
        <IconTextWrap />
        Wrap lines
      </Toggle>
      <Toggle variant="outline">Show hidden files</Toggle>
    </div>
  )
}
