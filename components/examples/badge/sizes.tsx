import { IconCheck } from "@tabler/icons-react"

import { Badge, BadgeClose, BadgeCount, BadgeDot } from "@/components/ui/badge"

export function BadgeSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge size="sm" variant="success">
          <IconCheck data-icon="inline-start" />
          Paid
        </Badge>
        <Badge size="sm" variant="info">
          <BadgeDot pulse />
          Live
        </Badge>
        <Badge size="sm">
          design
          <BadgeClose />
        </Badge>
        <Badge size="sm">
          <BadgeCount value={42} />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="success">
          <IconCheck data-icon="inline-start" />
          Paid
        </Badge>
        <Badge variant="info">
          <BadgeDot pulse />
          Live
        </Badge>
        <Badge>
          design
          <BadgeClose />
        </Badge>
        <Badge>
          <BadgeCount value={42} />
        </Badge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge size="lg">Large</Badge>
        <Badge size="lg" variant="success">
          <IconCheck data-icon="inline-start" />
          Paid
        </Badge>
        <Badge size="lg" variant="info">
          <BadgeDot pulse />
          Live
        </Badge>
        <Badge size="lg">
          design
          <BadgeClose />
        </Badge>
        <Badge size="lg">
          <BadgeCount value={42} />
        </Badge>
      </div>
    </div>
  )
}
