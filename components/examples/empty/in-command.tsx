"use client"

import * as React from "react"
import { IconSearch } from "@tabler/icons-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyInCommand() {
  const [search, setSearch] = React.useState("zzz")

  return (
    <Command className="w-full max-w-sm">
      <CommandInput
        placeholder="Search people…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {(search) => (
            <Empty size="sm">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconSearch />
                </EmptyMedia>
                <EmptyTitle>No results</EmptyTitle>
                <EmptyDescription>
                  Nothing matches “{search}”. Try another name.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CommandEmpty>
        <CommandGroup heading="People">
          <CommandItem>Ada Lovelace</CommandItem>
          <CommandItem>Alan Turing</CommandItem>
          <CommandItem>Grace Hopper</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
