"use client"

import type * as React from "react"
import {
  IconBrandAngular,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandSvelte,
  IconBrandVue,
} from "@tabler/icons-react"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"

type Framework = {
  value: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const frameworks: Framework[] = [
  { value: "next", label: "Next.js", icon: IconBrandNextjs },
  { value: "react", label: "React", icon: IconBrandReact },
  { value: "vue", label: "Vue", icon: IconBrandVue },
  { value: "svelte", label: "Svelte", icon: IconBrandSvelte },
  { value: "angular", label: "Angular", icon: IconBrandAngular },
]

export function ComboboxMultiple() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-multiple">Frameworks</Label>
      <Combobox
        items={frameworks}
        multiple
        autoHighlight
        defaultValue={[frameworks[0], frameworks[1]]}
      >
        <ComboboxChips>
          <ComboboxValue>
            {(values: Framework[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value.value}>{value.label}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="combobox-multiple"
                  placeholder={values.length > 0 ? "" : "Add frameworks"}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: Framework) => (
              <ComboboxItem key={item.value} value={item}>
                <item.icon />
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
