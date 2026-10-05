import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconEye,
  IconLoader2,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge variant="warning">
        <IconAlertTriangle data-icon="inline-start" />
        Pending
      </Badge>
      <Badge variant="info">
        <IconLoader2 data-icon="inline-start" />
        In progress
      </Badge>
      <Badge variant="warning">
        <IconEye data-icon="inline-start" />
        In review
      </Badge>
      <Badge variant="destructive">
        <IconCircleX data-icon="inline-start" />
        Failed
      </Badge>
      <Badge variant="success">
        <IconCircleCheck data-icon="inline-start" />
        Success
      </Badge>
      <Badge>
        <IconClock data-icon="inline-start" />
        Expired
      </Badge>
    </div>
  )
}
