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
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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

export function ComboboxWithIcons() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <Label htmlFor="combobox-icons">Framework</Label>
      <Combobox items={frameworks} autoHighlight>
        <ComboboxInput id="combobox-icons" placeholder="Select a framework" />
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
