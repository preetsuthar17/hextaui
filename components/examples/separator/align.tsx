import { IconCalendar } from "@tabler/icons-react"

import { Separator } from "@/components/ui/separator"

export function SeparatorAlign() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Separator align="start">
        <IconCalendar aria-hidden="true" />
        Today
      </Separator>
      <Separator>Yesterday</Separator>
      <Separator align="end">Last week</Separator>
    </div>
  )
}
