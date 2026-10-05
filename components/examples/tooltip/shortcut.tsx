import { IconDeviceFloppy } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { KbdGroup } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipShortcut() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          <IconDeviceFloppy data-icon="inline-start" />
          Save
        </TooltipTrigger>
        <TooltipContent>
          Save changes
          <KbdGroup keys="mod+s" size="sm" />
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Go to inbox
        </TooltipTrigger>
        <TooltipContent>
          Go to inbox
          <KbdGroup keys="g i" size="sm" />
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
