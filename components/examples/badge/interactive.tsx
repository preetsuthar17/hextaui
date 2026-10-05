import { IconArrowUpRight, IconX } from "@tabler/icons-react"

import { Badge, BadgeDot } from "@/components/ui/badge"

export function BadgeInteractive() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Badge render={<a href="#changelog" />}>
        v2.0 is out
        <IconArrowUpRight data-icon="inline-end" />
      </Badge>
      <Badge render={<button type="button" />} variant="info">
        <BadgeDot />
        Filter: open
      </Badge>
      <Badge render={<a href="#new" />}>New</Badge>
      <Badge render={<button type="button" />} aria-invalid>
        <IconX data-icon="inline-start" />
        Invalid
      </Badge>
    </div>
  )
}
