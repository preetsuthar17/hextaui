import { IconBell, IconBellOff } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function EmptyInPopover() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Notifications" />
        }
      >
        <IconBell />
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Empty size="sm">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconBellOff />
            </EmptyMedia>
            <EmptyTitle>Nothing new</EmptyTitle>
            <EmptyDescription>
              We’ll let you know when something needs your attention.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </PopoverContent>
    </Popover>
  )
}
