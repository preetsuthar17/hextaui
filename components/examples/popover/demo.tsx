import { IconAdjustmentsHorizontal } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const field =
  "h-8 w-full min-w-0 rounded-md border bg-transparent px-2 text-sm outline-none focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-focus-ring pointer-coarse:h-11 pointer-coarse:text-lg"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <IconAdjustmentsHorizontal />
        Dimensions
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-2">
          <label htmlFor="popover-width" className="text-sm">
            Width
          </label>
          <input id="popover-width" className={field} defaultValue="100%" />
          <label htmlFor="popover-height" className="text-sm">
            Height
          </label>
          <input id="popover-height" className={field} defaultValue="25px" />
        </div>
        <div className="flex justify-end gap-2">
          <PopoverClose render={<Button variant="ghost" size="sm" />}>
            Cancel
          </PopoverClose>
          <PopoverClose render={<Button size="sm" />}>Apply</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
