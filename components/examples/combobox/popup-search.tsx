"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "in", label: "India" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "nl", label: "Netherlands" },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
]

export function ComboboxPopupSearch() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Combobox items={countries}>
        <ComboboxTrigger aria-label="Country">
          <ComboboxValue placeholder="Select a country" />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxInput placeholder="Search countries" />
          <ComboboxEmpty>No country found.</ComboboxEmpty>
          <ComboboxList>
            {(item: (typeof countries)[number]) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
