import { IconCheck } from "@tabler/icons-react"

import { Badge, BadgeClose, BadgeCount, BadgeDot } from "@/components/ui/badge"

export function BadgeRtl() {
  return (
    <div dir="rtl" className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="success">
        <IconCheck data-icon="inline-start" />
        مدفوع
      </Badge>
      <Badge>
        <BadgeDot pulse />
        مباشر
      </Badge>
      <Badge>
        تصميم
        <BadgeClose />
      </Badge>
      <Badge>
        <BadgeCount value={120} />
      </Badge>
    </div>
  )
}
