import { IconChevronDown } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuHover() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={120}
        closeDelay={120}
        render={<Button variant="ghost" />}
      >
        Products
        <IconChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Analytics</DropdownMenuItem>
        <DropdownMenuItem>Engagement</DropdownMenuItem>
        <DropdownMenuItem>Security</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
