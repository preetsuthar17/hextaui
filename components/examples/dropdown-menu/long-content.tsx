import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuLongContent() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Long labels
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          A label that goes on for much longer than any menu label should
        </DropdownMenuLabel>
        <DropdownMenuItem>
          Move to “Supercalifragilisticexpialidocious archive 2026”
          <DropdownMenuShortcut>⌥⌘M</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          https://example.com/a/really/long/url/without/any/spaces/at/all
        </DropdownMenuItem>
        <DropdownMenuItem>👩‍👩‍👧‍👦 日本語のテキスト</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
