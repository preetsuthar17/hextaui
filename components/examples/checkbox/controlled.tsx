"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxControlled() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div className="flex flex-col items-start gap-3">
      <label className="flex items-center gap-3 text-sm">
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        Controlled ({checked ? "on" : "off"})
      </label>
      <Button variant="outline" size="sm" onClick={() => setChecked(!checked)}>
        Toggle from outside
      </Button>
    </div>
  )
}
