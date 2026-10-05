import { IconInfoCircle } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipLongContent() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          <IconInfoCircle data-icon="inline-start" />
          Retention
        </TooltipTrigger>
        <TooltipContent>
          Deleted projects stay in the trash for 30 days. After that they’re
          removed for good, along with their deployments and logs.
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Webhook URL
        </TooltipTrigger>
        <TooltipContent>
          https://api.example.com/v1/hooks/8f3a2c91d7e64b0f9a1c5e2d7b8a4f60/deliveries
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
