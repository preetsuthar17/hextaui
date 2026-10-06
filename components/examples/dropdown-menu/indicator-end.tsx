"use client"

import * as React from "react"
import { IconChevronDown } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const plans = [
  { value: "starter", label: "Starter", description: "For side projects" },
  { value: "team", label: "Team", description: "Shared workspace and roles" },
  { value: "scale", label: "Scale", description: "SSO, audit log and SLA" },
]

export function DropdownMenuIndicatorEnd() {
  const [plan, setPlan] = React.useState("team")
  const current = plans.find((item) => item.value === plan)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        {current?.label}
        <IconChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={plan} onValueChange={setPlan}>
          <DropdownMenuLabel>Plan</DropdownMenuLabel>
          {plans.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              indicator="end"
              closeOnClick
            >
              <span className="flex min-w-0 flex-col">
                <span>{item.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
