import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger disabled render={<Button variant="outline" />}>
          Disabled trigger
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Never shown</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          Disabled items
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem disabled>Move (no permission)</DropdownMenuItem>
          <DropdownMenuItem disabled>Share (no permission)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
