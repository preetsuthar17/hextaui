import { IconBell } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipWithArrow() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon" aria-label="Notifications" />
        }
      >
        <IconBell />
      </TooltipTrigger>
      <TooltipContent arrow>Notifications</TooltipContent>
    </Tooltip>
  )
}
