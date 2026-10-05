import { IconChevronDown } from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export function InputGroupDropdown() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Enter a search term" aria-label="Search" />
      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<InputGroupButton />}>
            Everywhere
            <IconChevronDown data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Everywhere</DropdownMenuItem>
              <DropdownMenuItem>This project</DropdownMenuItem>
              <DropdownMenuItem>Documentation</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  )
}
