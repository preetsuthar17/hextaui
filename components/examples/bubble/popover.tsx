import { IconAlertCircle } from "@tabler/icons-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function BubblePopover() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Popover>
        <Bubble variant="destructive" align="end">
          <PopoverTrigger
            render={<BubbleContent render={<button type="button" />} />}
          >
            <IconAlertCircle /> Not delivered. Tap for details.
          </PopoverTrigger>
        </Bubble>
        <PopoverContent align="end" className="w-64">
          <PopoverHeader>
            <PopoverTitle>Delivery failed</PopoverTitle>
            <PopoverDescription>
              The recipient&apos;s server rejected the message (550: mailbox
              unavailable).
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  )
}
