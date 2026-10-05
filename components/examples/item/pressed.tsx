"use client"

import * as React from "react"
import { IconCheck } from "@tabler/icons-react"

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"

const themes = [
  { id: "system", title: "System", description: "Follow your device" },
  { id: "light", title: "Light", description: "Always light" },
  { id: "dark", title: "Dark", description: "Always dark" },
]

export function ItemPressed() {
  const [theme, setTheme] = React.useState("system")

  return (
    <ItemGroup variant="grouped" className="max-w-sm">
      {themes.map((option) => (
        <Item
          key={option.id}
          size="sm"
          render={<button type="button" />}
          aria-pressed={theme === option.id}
          onClick={() => setTheme(option.id)}
        >
          <ItemContent>
            <ItemTitle>{option.title}</ItemTitle>
            <ItemDescription>{option.description}</ItemDescription>
          </ItemContent>
          {theme === option.id && (
            <IconCheck className="size-4 text-foreground" aria-hidden="true" />
          )}
        </Item>
      ))}
    </ItemGroup>
  )
}
