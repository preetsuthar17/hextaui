"use client"

import * as React from "react"
import { IconLoader2 } from "@tabler/icons-react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

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
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
  { value: "za", label: "South Africa" },
  { value: "kr", label: "South Korea" },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
]

export function ComboboxAsync() {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState(countries.slice(0, 5))
  const [loading, setLoading] = React.useState(false)
  const runRef = React.useRef(0)

  React.useEffect(() => {
    const run = ++runRef.current
    const timer = setTimeout(() => {
      setLoading(true)
      setTimeout(() => {
        if (run !== runRef.current) {
          return
        }
        const needle = query.trim().toLowerCase()
        setResults(
          countries.filter((country) =>
            country.label.toLowerCase().includes(needle)
          )
        )
        setLoading(false)
      }, 600)
    }, 150)
    return () => {
      clearTimeout(timer)
      runRef.current += 1
    }
  }, [query])

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-async">Country</Label>
      <Combobox
        items={results}
        filter={null}
        inputValue={query}
        onInputValueChange={setQuery}
      >
        <ComboboxInput id="combobox-async" placeholder="Search countries" />
        <ComboboxContent>
          <ComboboxStatus>
            {loading ? (
              <>
                <IconLoader2 className="animate-spin" />
                Searching…
              </>
            ) : null}
          </ComboboxStatus>
          {loading ? null : (
            <ComboboxEmpty>No country matches “{query}”.</ComboboxEmpty>
          )}
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
