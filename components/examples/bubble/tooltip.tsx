import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BubbleTooltip() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Tooltip>
        <TooltipTrigger render={<Bubble align="end" tabIndex={0} />}>
          <BubbleContent>Hover to see when this was read.</BubbleContent>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          Read 9:41 AM
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
