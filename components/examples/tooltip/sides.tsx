import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const sides = [
  { side: "top", cell: "col-start-2 row-start-1" },
  { side: "inline-start", cell: "col-start-1 row-start-2" },
  { side: "inline-end", cell: "col-start-3 row-start-2" },
  { side: "bottom", cell: "col-start-2 row-start-3" },
] as const

export function TooltipSides() {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-2">
        {sides.map(({ side, cell }) => (
          <div key={side} className={cell}>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                {side}
              </TooltipTrigger>
              <TooltipContent side={side}>{side}</TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  )
}
