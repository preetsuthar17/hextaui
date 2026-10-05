"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupClear,
  InputGroupInput,
} from "@/components/ui/input-group"

const fruits = ["Apple", "Apricot", "Banana", "Blackberry", "Cherry", "Fig"]

export function InputGroupClearDemo() {
  const [query, setQuery] = React.useState("ap")
  const matches = fruits.filter((fruit) =>
    fruit.toLowerCase().includes(query.trim().toLowerCase())
  )

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <InputGroup>
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter fruit"
          aria-label="Filter fruit"
        />
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupClear />
        </InputGroupAddon>
      </InputGroup>
      <p className="text-sm text-muted-foreground">
        {matches.length > 0 ? matches.join(", ") : "No fruit matches."}
      </p>
    </div>
  )
}
