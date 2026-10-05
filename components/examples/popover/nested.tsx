import { IconInfoCircle } from "@tabler/icons-react"

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
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function PopoverNested() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Popover in popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Parent</PopoverTitle>
            <PopoverDescription>
              Clicking inside the child keeps this one open.
            </PopoverDescription>
          </PopoverHeader>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
              <IconInfoCircle />
              More info
            </PopoverTrigger>
            <PopoverContent side="right" className="w-56">
              <PopoverTitle>Child</PopoverTitle>
              <PopoverClose render={<Button size="sm" variant="ghost" />}>
                Close child
              </PopoverClose>
            </PopoverContent>
          </Popover>
        </PopoverContent>
      </Popover>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          Popover in a sheet
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Sheet</SheetTitle>
            <SheetDescription>
              The popover layers above the sheet, and Escape closes only the
              popover.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>
                Open popover
              </PopoverTrigger>
              <PopoverContent>
                <PopoverTitle>Inside a sheet</PopoverTitle>
              </PopoverContent>
            </Popover>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  )
}
