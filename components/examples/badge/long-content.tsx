import { IconCheck } from "@tabler/icons-react"

import { Badge, BadgeClose } from "@/components/ui/badge"

export function BadgeLongContent() {
  return (
    <div className="flex w-56 max-w-full flex-col items-start gap-2">
      <Badge>
        SupercalifragilisticexpialidociousSupercalifragilisticexpialidocious
      </Badge>
      <Badge variant="success">
        <IconCheck data-icon="inline-start" />
        firstname.lastname+tag@subdomain.example.co.uk
        <BadgeClose />
      </Badge>
    </div>
  )
}
