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

const longItems = [
  "A very long option label that wraps onto a second line instead of pushing the popup wider than its input",
  "supercalifragilisticexpialidocious-unbroken-string-without-any-spaces-at-all-anywhere",
  "olivia.martin+newsletter-subscriptions@a-very-long-company-domain.example.com",
  "👩‍👩‍👧‍👦 Family 🧑🏽‍💻 Developer 🏳️‍🌈",
  "東京都千代田区丸の内一丁目",
  "",
  "Short",
]

const manyItems = Array.from({ length: 500 }, (_, index) => `Item ${index + 1}`)

export function ComboboxLongContent() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <div className="flex w-full max-w-60 flex-col gap-2">
        <Label htmlFor="combobox-long">Long labels</Label>
        <Combobox items={longItems} defaultValue={longItems[1]}>
          <ComboboxInput id="combobox-long" placeholder="Pick one" showClear />
          <ComboboxContent>
            <ComboboxEmpty>
              Nothing matches this unusually long query, try something else.
            </ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item || "(empty)"}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="combobox-many">500 items</Label>
        <Combobox items={manyItems} limit={100}>
          <ComboboxInput id="combobox-many" placeholder="Search items" />
          <ComboboxContent>
            <ComboboxEmpty>No item found.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <p className="text-sm text-muted-foreground">
          Shows the first 100 matches.
        </p>
      </div>
    </div>
  )
}
