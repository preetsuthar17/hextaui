"use client"

import * as React from "react"
import { IconChevronDown, IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const workspaces = [
  "Acme Inc.",
  "Monsters Inc.",
  "A workspace with a very long name that wraps",
]

export function DropdownMenuSelect() {
  const [workspace, setWorkspace] = React.useState(workspaces[0])

  return (
    <div className="w-64 max-w-full">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" className="w-full justify-between" />
          }
        >
          <span className="truncate">{workspace}</span>
          <IconChevronDown data-icon="inline-end" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={workspace}
            onValueChange={setWorkspace}
          >
            {workspaces.map((name) => (
              <DropdownMenuRadioItem key={name} value={name} closeOnClick>
                {name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <IconPlus />
            New workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
