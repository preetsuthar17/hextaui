"use client"

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

export function ComboboxWithClear() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-clear">Fruit</Label>
      <Combobox items={fruits} defaultValue="Mango">
        <ComboboxInput
          id="combobox-clear"
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
    </div>
  )
}
