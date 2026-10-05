import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

export function PopoverPlacement() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        {sides.map((side) => (
          <Popover key={side}>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              {side}
            </PopoverTrigger>
            <PopoverContent side={side} className="w-48">
              <PopoverTitle>Side: {side}</PopoverTitle>
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {aligns.map((align) => (
          <Popover key={align}>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              Align {align}
            </PopoverTrigger>
            <PopoverContent align={align} className="w-64">
              <PopoverTitle>Align: {align}</PopoverTitle>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  )
}
