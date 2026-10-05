"use client"

import * as React from "react"

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
  ComboboxSeparator,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

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

export function ComboboxGroups() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-groups">Timezone</Label>
      <Combobox items={timezones} autoHighlight>
        <ComboboxInput id="combobox-groups" placeholder="Select a timezone" />
        <ComboboxContent>
          <ComboboxEmpty>No timezone found.</ComboboxEmpty>
          <ComboboxList>
            {(group: TimezoneGroup, index: number) => (
              <React.Fragment key={group.value}>
                {index > 0 ? <ComboboxSeparator /> : null}
                <ComboboxGroup items={group.items}>
                  <ComboboxLabel>{group.value}</ComboboxLabel>
                  <ComboboxCollection>
                    {(item: Timezone) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              </React.Fragment>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
