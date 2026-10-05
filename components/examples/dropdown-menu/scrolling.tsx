import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuScrolling() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        40 documents
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Array.from({ length: 40 }, (_, index) => (
          <DropdownMenuItem key={index}>Document {index + 1}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
