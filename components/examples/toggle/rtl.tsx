import { IconAlignRight, IconBold, IconItalic } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleRtl() {
  return (
    <div dir="rtl" className="flex items-center gap-2">
      <Toggle variant="outline" defaultPressed>
        <IconBold />
        عريض
      </Toggle>
      <Toggle variant="outline">
        <IconItalic />
        مائل
      </Toggle>
      <Toggle variant="outline" aria-label="محاذاة لليمين">
        <IconAlignRight />
      </Toggle>
    </div>
  )
}
