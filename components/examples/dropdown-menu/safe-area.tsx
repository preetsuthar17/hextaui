"use client"

import * as React from "react"
import { IconDots } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const folders = [
  "Inbox",
  "Design",
  "Engineering",
  "Marketing",
  "Finance",
  "Legal",
  "Archive",
  "Shared with me",
]

const submenus = [
  { label: "Move to", items: folders },
  { label: "Copy to", items: folders },
  { label: "Share", items: ["Copy link", "Email", "Slack"] },
  { label: "Export as", items: ["PDF", "PNG", "SVG"] },
]

export function DropdownMenuSafeArea() {
  const [showSafeArea, setShowSafeArea] = React.useState(true)

  return (
    <div className="flex flex-col items-center gap-6">
      <label className="flex items-center gap-3 text-sm">
        <Checkbox
          checked={showSafeArea}
          onCheckedChange={(checked) => setShowSafeArea(checked === true)}
        />
        Show safe area
      </label>
      <DropdownMenu showSafeArea={showSafeArea}>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <IconDots data-icon="inline-start" />
          Q3 report.pdf
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          {submenus.map((submenu) => (
            <DropdownMenuSub key={submenu.label}>
              <DropdownMenuSubTrigger>{submenu.label}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44">
                {submenu.items.map((item) => (
                  <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
