"use client"

import {
  Combobox,
  ComboboxContent,
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

export function ComboboxStates() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="combobox-disabled">Disabled</Label>
        <Combobox items={fruits} disabled defaultValue="Apple">
          <ComboboxInput id="combobox-disabled" showClear />
          <ComboboxContent>
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="combobox-invalid">Invalid</Label>
        <Combobox items={fruits}>
          <ComboboxInput
            id="combobox-invalid"
            aria-invalid
            placeholder="Required"
          />
          <ComboboxContent>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem
                  key={item}
                  value={item}
                  disabled={item.startsWith("B")}
                >
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p className="text-sm text-muted-foreground">
          Items starting with B are disabled.
        </p>
      </div>
    </div>
  )
}
