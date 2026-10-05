import { IconChevronDown, IconGitBranch } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ButtonGroupSplit() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ButtonGroup aria-label="Deploy">
        <Button>
          <IconGitBranch data-icon="inline-start" />
          Deploy main
        </Button>
        <ButtonGroupSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button size="icon" aria-label="Choose branch" />}
          >
            <IconChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>Deploy staging</DropdownMenuItem>
              <DropdownMenuItem>Deploy preview</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup aria-label="Delete">
        <Button variant="destructive">Delete</Button>
        <ButtonGroupSeparator />
        <Button variant="destructive" size="icon" aria-label="More">
          <IconChevronDown />
        </Button>
      </ButtonGroup>
    </div>
  )
}
