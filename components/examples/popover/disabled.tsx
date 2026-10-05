import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverDisabled() {
  return (
    <Popover>
      <PopoverTrigger disabled render={<Button variant="outline" />}>
        Disabled
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Never shown</PopoverTitle>
      </PopoverContent>
    </Popover>
  )
}
