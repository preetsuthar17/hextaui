"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

const fruits = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Grapefruit",
  "Kiwi",
  "Lychee",
  "Mango",
  "Orange",
  "Papaya",
  "Peach",
  "Pear",
  "Pineapple",
  "Plum",
  "Raspberry",
  "Strawberry",
  "Watermelon",
]

export function ComboboxControlled() {
  const [value, setValue] = React.useState<string | null>("Peach")
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-controlled">Fruit</Label>
      <Combobox
        items={fruits}
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
      >
        <ComboboxInput
          id="combobox-controlled"
          placeholder="Select a fruit"
          showClear
        />
        <ComboboxContent>
          <ComboboxEmpty>No fruit found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue("Kiwi")}>
          Pick Kiwi
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open"}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Value: {value ?? "none"}</p>
    </div>
  )
}
