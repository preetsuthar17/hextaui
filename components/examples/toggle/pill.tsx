import { IconSparkles, IconWorld } from "@tabler/icons-react"

import { Toggle } from "@/components/ui/toggle"

export function TogglePill() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle shape="pill" defaultPressed>
        <IconSparkles />
        Think
      </Toggle>
      <Toggle shape="pill" variant="outline">
        <IconWorld />
        Search
      </Toggle>
    </div>
  )
}
