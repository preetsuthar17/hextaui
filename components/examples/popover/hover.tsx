import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PopoverHover() {
  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={200}
        closeDelay={150}
        render={<Button variant="link" />}
      >
        @preetsuthar
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
          <PopoverHeader>
            <PopoverTitle>Preet Suthar</PopoverTitle>
            <PopoverDescription>
              Building HextaUI. Opens on hover after 200ms and stays open while
              the pointer is inside.
            </PopoverDescription>
          </PopoverHeader>
        </div>
      </PopoverContent>
    </Popover>
  )
}
