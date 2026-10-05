import { IconX } from "@tabler/icons-react"

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

export function PopoverModal() {
  return (
    <Popover modal>
      <PopoverTrigger render={<Button variant="outline" />}>
        Modal
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-start justify-between gap-2">
          <PopoverHeader>
            <PopoverTitle>Modal popover</PopoverTitle>
            <PopoverDescription>
              Page scroll is locked and outside clicks only dismiss.
            </PopoverDescription>
          </PopoverHeader>
          <PopoverClose
            aria-label="Close"
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <IconX />
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
