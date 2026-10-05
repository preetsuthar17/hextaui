"use client"

import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Timezone = { value: string; label: string }
type TimezoneGroup = { value: string; items: Timezone[] }

const timezones: TimezoneGroup[] = [
  {
    value: "Americas",
    items: [
      { value: "America/New_York", label: "New York (GMT-4)" },
      { value: "America/Chicago", label: "Chicago (GMT-5)" },
      { value: "America/Los_Angeles", label: "Los Angeles (GMT-7)" },
      { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
    ],
  },
  {
    value: "Europe",
    items: [
      { value: "Europe/London", label: "London (GMT+1)" },
      { value: "Europe/Paris", label: "Paris (GMT+2)" },
      { value: "Europe/Berlin", label: "Berlin (GMT+2)" },
    ],
  },
  {
    value: "Asia",
    items: [
      { value: "Asia/Kolkata", label: "Kolkata (GMT+5:30)" },
      { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
      { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    ],
  },
]

export function ComboboxInSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>
            Choose the timezone for your reports.
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="flex flex-col gap-2">
            <Label htmlFor="combobox-sheet">Timezone</Label>
            <Combobox items={timezones} autoHighlight>
              <ComboboxInput
                id="combobox-sheet"
                placeholder="Select a timezone"
              />
              <ComboboxContent>
                <ComboboxEmpty>No timezone found.</ComboboxEmpty>
                <ComboboxList>
                  {(group: TimezoneGroup) => (
                    <ComboboxGroup key={group.value} items={group.items}>
                      <ComboboxLabel>{group.value}</ComboboxLabel>
                      <ComboboxCollection>
                        {(item: Timezone) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxCollection>
                    </ComboboxGroup>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
