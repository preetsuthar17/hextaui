import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tooltip>
        <TooltipTrigger render={<Button disabled focusableWhenDisabled />}>
          Publish
        </TooltipTrigger>
        <TooltipContent>Add a title before publishing</TooltipContent>
      </Tooltip>
      <Tooltip disabled>
        <TooltipTrigger render={<Button variant="outline" />}>
          No tooltip
        </TooltipTrigger>
        <TooltipContent>You won’t see this</TooltipContent>
      </Tooltip>
    </div>
  )
}
