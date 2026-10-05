"use client"

import * as React from "react"

import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox"

const fruits = ["Apple", "Banana", "Cherry", "Mango", "Peach"]

export function CheckboxSelectAll() {
  const [value, setValue] = React.useState<string[]>(["Banana"])

  return (
    <div className="text-sm">
      <CheckboxGroup
        aria-label="Fruits"
        value={value}
        onValueChange={setValue}
        allValues={fruits}
      >
        <label className="flex items-center gap-3">
          <Checkbox parent />
          <span>
            Select all{" "}
            <span className="text-muted-foreground">
              ({value.length}/{fruits.length})
            </span>
          </span>
        </label>
        <div className="flex flex-col gap-3 ps-7">
          {fruits.map((fruit) => (
            <label key={fruit} className="flex items-center gap-3">
              <Checkbox value={fruit} />
              {fruit}
            </label>
          ))}
        </div>
      </CheckboxGroup>
    </div>
  )
}
